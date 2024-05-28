<template>
  <div
    v-click-outside="close"
    class="BaseSelect"
    :class="{
      'BaseSelect--dropdown-opened': dropdownOpened,
      'BaseSelect--valid': valid,
      'BaseSelect--error': isError,
      'BaseSelect--small': small,
      'BaseSelect--without-border': withoutBorder,
      'BaseSelect--fit-width': fitWidth,
      'BaseSelect--disabled': disabled,
      'BaseSelect--capitalize': capitalize,
      'BaseSelect--img': img,
      'BaseSelect--checkmark': checkmark,
      'BaseSelect--nowrap': noWrap,
      'BaseSelect--blue': blue,
      'BaseSelect--only-dropdown': onlyDropdown,
      'BaseSelect--right': right,
      'BaseSelect--tooltip': tooltip || $slots.tooltip,
    }"
  >
    <BaseLabel
      v-if="!onlyDropdown"
      :label="label ?? placeholder"
      :disabled="disabled || blue"
      :value="labelIsFilled"
      tabindex="0"
      focus-disabled
      @click="toggle"
      @keydown.down.prevent="selectTo(1)"
      @keydown.up.prevent="selectTo(-1)"
      @keydown.enter.prevent="close"
      @keydown.esc.prevent="close"
    >
      <div class="BaseSelect__body">
        <div
          v-if="multiple && modelValue && modelValue.length"
          class="BaseSelect__value"
        >
          <div
            class="BaseSelect__value-text"
            :class="{ 'BaseSelect__value-text--hover': hover }"
          >
            {{ getOptionsLabel(activeOptions) }}
          </div>
        </div>
        <div
          v-else-if="activeOption"
          class="BaseSelect__value"
        >
          <div
            v-if="color"
            class="BaseSelect__color"
            :style="getColor(activeOption)"
          />
          <img
            v-if="img"
            class="BaseSelect__img"
            :src="getImg(activeOption)"
          />
          <div
            class="BaseSelect__value-text"
            :class="{ 'BaseSelect__value-text--hover': hover }"
            v-html="
              getValueLabel
                ? getValueLabel(activeOption)
                : getOptionLabel(activeOption)
            "
          />
        </div>
        <div
          v-else
          class="BaseSelect__placeholder"
        >
          {{ placeholderStr }}
        </div>
        <div class="BaseSelect__icon-valid">
          <BaseTooltip
            v-if="tooltip || $slots.tooltip"
            :tooltip="tooltip"
            @click.prevent.stop
          >
            <slot name="tooltip" />
          </BaseTooltip>
          <img
            v-else-if="valid"
            src="@/bash-frontend-kit/icons/input-valid-checkmark.svg"
            alt=""
          />
        </div>
      </div>
    </BaseLabel>
    <div
      v-if="dropdownOpened"
      class="BaseSelect__dropdown"
    >
      <slot name="dropdown" />
      <div
        v-if="searchable"
        class="BaseSelect__search"
      >
        <BaseInput
          v-model="searchValue"
          placeholder="Поиск"
          blue
        />
      </div>
      <TransitionGroup name="list">
        <template
          v-if="emptyOptions && (showExtraOption || (!grouped && !multiple))"
        >
          <div
            v-if="optionsListEmpty && emptyOptions?.description"
            class="BaseSelect__empty-description"
          >
            {{ emptyResultSearch ? 'Не найдено' : emptyOptions.description }}
          </div>
          <div
            v-if="emptyOptions.contact && addModal"
            class="BaseSelect__empty-add"
            @click="openAddContactModal"
          >
            + {{ emptyOptions.add }}
          </div>
          <AppLink
            v-else
            :to="emptyOptions.link"
            class="BaseSelect__empty-add"
            target="_blank"
            @click="$emit('click-add')"
          >
            + {{ emptyOptions.add }}
          </AppLink>
        </template>
        <div
         v-if="itemSelectAll"
         class="BaseSelect__empty-add"
         @click="selectAll"
        >
          Выбрать всё
        </div>
        <template v-if="grouped">
          <div
            v-for="group in sortedOptionsGroups"
            :key="group.group"
            class="BaseSelect__group"
          >
            <div class="BaseSelect__group-title">{{ group.name }}</div>
            <div class="BaseSelect__group-options">
              <div
                v-for="(option, index) in filterOptions(group.options)"
                :key="index"
                class="BaseSelect__option"
                :class="{
                  'BaseSelect__option--active': checkOptionIsActive(option),
                  'BaseSelect__option--disabled':
                    !!validateOption && !validateOption(option),
                }"
                @click="selectOption(option)"
              >
                <img
                  v-if="img || notify"
                  class="BaseSelect__img"
                  :src="getImg(option)"
                />
                <div
                  class="BaseSelect__option-label"
                  v-html="getOptionLabel(option)"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="(option, index) in normalizedOptions"
            :key="index"
            class="BaseSelect__option"
            :class="{
              'BaseSelect__option--active': checkOptionIsActive(option),
              'BaseSelect__option--disabled':
                !!validateOption && !validateOption(option),
            }"
            @click="selectOption(option)"
          >
            <div
              v-if="color"
              class="BaseSelect__color"
              :style="getColor(option)"
            />
            <img
              v-if="img || notify"
              class="BaseSelect__img"
              :src="getImg(option)"
            />
            <div
              class="BaseSelect__option-label"
              v-html="getOptionLabel(option)"
            />
          </div>
        </template>
      </TransitionGroup>
      <slot name="dropdown-footer" />
    </div>
    <InputError
      v-if="isError"
      class="BaseSelect__error"
      :error="error"
    />
    <div
      v-if="description"
      class="BaseSelect__description"
    >
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseLabel from '~/bash-frontend-kit/components/form/BaseLabel.vue';
import {computed, ref} from '#imports';
import InputError from '~/bash-frontend-kit/components/form/sub-elements/InputError.vue';
import {toggleItem} from '~/bash-frontend-kit/utils/data/array/toggleItem';
import {optionsIsGrouped} from '~/bash-frontend-kit/composables/form/optionsIsGrouped';
import {sortByOrderList} from '~/bash-frontend-kit/utils/data/array/sortByOrderList';
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import defaultImage from '~/bash-frontend-kit/icons/default-select-image.svg';
import AppLink from '~/bash-frontend-kit/components/app/AppLink.vue';
import {useRoute} from '#app';
import BaseTooltip from '~/bash-frontend-kit/components/form/BaseTooltip.vue';

const props = defineProps({
  // InputOptionsGroup[] | InputOption[] | any[];
  options: [Array, Object],
  option: Object,
  modelValue: {
    type: [Object, String, Number],
    default: null,
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: null,
    required: false,
  },
  getValueLabel: Function,
  // For single select
  getOptionLabel: {
    type: Function,
    default: (option) => {
      let label =
        option?.text ?? option?.label ?? option?.name ?? option?.title;

      if (option?.count != null) {
        label += `<span class="BaseSelect__option-count">${option.count}</span>`;
      }

      return label;
    },
  },
  // For multiple select
  getOptionsLabel: {
    type: Function,
    default: (activeOptions) =>
      activeOptions.map(({ text }) => text).join(', '),
  },
  reduce: {
    type: Function,
    default: (option) => option?.id ?? option?.alias ?? option?.value,
  },
  error: {
    type: [String, Array],
    default: '',
  },
  defaultImg: {
    type: [String, Function],
    default: defaultImage,
  },
  notify: [Boolean, Object],
  multiple: Boolean,
  valid: Boolean,
  blue: Boolean,
  small: Boolean,
  withoutBorder: Boolean,
  color: Boolean,
  img: Boolean,
  hover: Boolean,
  required: Boolean,
  noWrap: Boolean,
  disabled: Boolean,
  validateOption: {
    type: Function,
    default: (option) => !option?.disabled,
  },
  capitalize: Boolean,
  fitWidth: Boolean,
  checkmark: Boolean,
  searchable: Boolean,
  emptyOptions: Object,
  showExtraOption: Boolean,
  addModal: Boolean,
  onlyDropdown: Boolean,
  right: Boolean,
  tooltip: String,
  resetItem: {
    type: String,
    default: null,
  },
  description: String,
  itemSelectAll: Boolean,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any | any[]): void;
  (e: 'select', option: any);
  (e: 'open-modal-add'): void;
  (e: 'click-add'): void;
}>();

const route = useRoute();

const dropdownOpened = ref(!!props.onlyDropdown);

const searchValue = ref('');

const isError = computed(() => !props.disabled && props.error);

const normalizedSearchValue = computed(() => {
  return searchValue.value.trim().toLowerCase();
});

const grouped = optionsIsGrouped(computed(() => props.options));

const normalizedOptions = computed(() => {
  if (!props.options) {
    return [];
  }
  let options = props.options as any[];

  if (grouped.value) {
    options = options.reduce((sum, { options }) => [...sum, ...options], []);
  }

  if (props.resetItem) {
    options = [{ title: props.resetItem }, ...options];
  }

  return filterOptions(options);
});

const sortedOptionsGroups = computed(() => {
  if (!props.options) {
    return [];
  }

  return props.options
    .map((el) => ({
      ...el,
      options: filterOptions(el.options),
    }))
    .sort((a, b) => Boolean(b.options.length) - Boolean(a.options.length));
});

const optionsListEmpty = computed(() => {
  return !props.options?.length || !normalizedOptions.value.length;
});

const emptyResultSearch = computed(() => {
  return (
    props.searchable && props.options.length && !normalizedOptions.value.length
  );
});

function openAddContactModal() {
  emit('open-modal-add');
}

function filterOptions(options: any[]) {
  if (!props.searchable) {
    return options;
  }
  return options.filter((option) => {
    const label = props.getOptionLabel(option);
    if (label) {
      return label
        .toString()
        .toLowerCase()
        .includes(normalizedSearchValue.value);
    }
  });
}

const labelIsFilled = computed(() => {
  if (props.multiple) {
    return props.label ? activeOptions.value.length : null;
  } else {
    return activeOption.value;
  }
});
const activeOption = computed(() => {
  if (props.multiple) {
    return null;
  }
  return (
    normalizedOptions.value?.find(checkOptionIsActive) ??
    (checkOptionIsActive(props.option) && props.option)
  );
});

const placeholderStr = computed(() => {
  return props.required && !props.disabled && props.placeholder
    ? `${props.placeholder} *`
    : props.placeholder;
});

const activeOptions = computed(() => {
  if (!props.multiple) {
    return [];
  }
  const activeOptions = normalizedOptions.value.filter(checkOptionIsActive);
  return sortByOrderList(
    activeOptions,
    props.modelValue as any[],
    props.reduce as (option) => any
  );
});

function selectAll() {
  const selectCount = (props.modelValue ?? []).length;
  if(normalizedOptions.value.length === selectCount) {
    emit('update:modelValue', []);
  }
  else {
    emit(
     'update:modelValue',
     normalizedOptions.value.map((option) => props.reduce(option)),
    );
  }
  close();
}

function selectOption(option, closeDropdown = true) {
  if (closeDropdown) {
    close();
  }

  emit('select', option);

  if (props.multiple) {
    emit(
      'update:modelValue',
      toggleItem((props.modelValue ?? []) as any[], props.reduce(option))
    );
  } else {
    emit('update:modelValue', props.reduce(option));
  }
}

function checkOptionIsActive(option) {
  if (props.multiple) {
    return ((props.modelValue ?? []) as any[]).includes(props.reduce(option));
  } else {
    return props.reduce(option) === props.modelValue;
  }
}

function open() {
  if (!props.disabled) {
    dropdownOpened.value = true;
  }
}

function close() {
  if (!props.onlyDropdown) {
    dropdownOpened.value = false;
  }
}

function toggle() {
  if (!props.disabled && !props.onlyDropdown) {
    dropdownOpened.value = !dropdownOpened.value;
  }
}

function selectTo(i) {
  if (props.multiple) {
    return;
  }

  const index = normalizedOptions.value.indexOf(activeOption.value);
  if (~index) {
    const selectIndex = index + i;
    if (selectIndex >= 0 && selectIndex < normalizedOptions.value.length) {
      selectOption(normalizedOptions.value[selectIndex], false);
    }
  } else if (normalizedOptions.value.length) {
    selectOption(normalizedOptions.value[0], false);
  }
}

function getColor(option) {
  return `background-color: ${option.bg || option.color}`;
}

function getImg(option) {
  const url = option.icon ?? option.avatar;
  if (url) {
    return url;
  } else if (typeof props.defaultImg === 'function') {
    return props.defaultImg(option);
  } else {
    return props.defaultImg;
  }
}

defineExpose({
  grouped,
  activeOption,
  activeOptions,
});
</script>

<style lang="scss">
.BaseSelect {
  position: relative;
  width: 100%;

  &--valid & {
    &__body::after {
      display: none;
    }
  }

  &__empty-description {
    font-size: 14px;
    line-height: 20px;
    color: #b4bbc6;
    margin-bottom: 15px;
  }

  &__empty-add {
    margin-bottom: 15px;

    font-weight: 700;
    font-size: 16px;
    color: #a5aabe;
    text-decoration: none;

    @extend .BaseSelect__option;
  }

  &:hover {
    .BaseSelect__value-text--hover {
      color: black;
    }
  }

  &--dropdown-opened &__body::after {
    transform: rotate(180deg) translateY(50%) !important;
  }

  &--disabled & {
    &__body {
      cursor: default;

      &::after {
        display: none;
      }
    }
  }

  &--error & {
    &__body {
      border: 1px solid #ff5101;
    }
  }

  &--without-border & {
    &__body {
      border-color: transparent;
      padding-left: 0;
    }
  }

  &--fit-width {
    width: fit-content;
  }

  &--fit-width & {
    &__body {
      padding-right: 0;
      min-width: min-content;

      &::after {
        right: 0;
      }
    }

    &__value {
      padding-right: 25px;

      @include mobile {
        padding-right: 16px;
      }
    }

    &__dropdown {
      width: fit-content;
      max-width: calc(100vw - 160px);

      @include mobile {
        max-width: calc(100vw - 40px);
      }
    }
  }

  &--checkmark & {
    &__option {
      padding-left: 35px;

      &::before {
        content: none !important;
      }

      &--active {
        &::after {
          border-color: #ff7739;
          background-color: #ff7739;
          background-image: url('~/bash-frontend-kit/icons/checkmark.svg');
          background-position: center;
          background-repeat: no-repeat;
        }
      }

      &::after {
        content: '';

        width: 20px;
        height: 20px;

        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);

        border: 1px solid var(--border-light-color);
        border-radius: 3px;
      }
    }
  }

  &--blue & {
    &__body {
      background: #f9fafc;
      border: none;
      border-radius: 13px;

      transition: background-color $transition;

      &:hover {
        background: #edeef4;
      }

      &:focus,
      &:active {
        border: none !important;
      }
    }
  }

  &__body {
    @include baseInputBlock;
    cursor: pointer;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: 16px;
      top: 50%;
      width: 8px;
      height: 5px;
      transform: translateY(-50%);

      background-image: url('~/bash-frontend-kit/icons/arrow-hide.svg');
      background-repeat: no-repeat;

      transition: transform $transition;
      filter: var(--icon-filter);
    }

    &:focus,
    &:active {
      border: 1px solid #ff7739;
      outline: none;
    }
  }

  &--right & {
    &__dropdown {
      right: 0;
      left: unset;
    }
  }

  &__value,
  &__placeholder {
    @include baseInputText;
    padding-right: 24px;
    min-width: 0;
  }

  &__value {
    display: flex;
    align-items: center;
  }

  &__value-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1;
  }

  &--img &__value-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 46px;
  }

  &__icon-valid {
    display: flex;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 16px;

    .BaseTooltip {
      position: relative;
      margin-right: -5px;
    }
  }

  &__arrow {
    transition: transform $transition;

    &--active {
      transform: rotate(180deg);
    }
  }

  &--only-dropdown {
    min-width: 240px;
  }

  &--tooltip {
    .BaseSelect__body::after {
      content: none !important;
    }

    .BaseSelect__icon-valid {
      z-index: 100;
    }
  }

  &__dropdown {
    position: absolute;
    z-index: var(--z-index-dropdown);
    top: 100%;
    left: 0;
    right: 0;
    max-height: 50vh;
    min-width: 120px;
    overflow: auto;

    max-height: 360px;
    overflow-y: auto;
    max-width: 100%;

    margin-top: 10px;
    padding: 25px 40px;

    background: var(--bg-secondary);
    box-shadow: var(--secondary-shadown);
    color: var(--text);
    border-radius: 15px;

    @include customScroll();
  }

  &__group {
    & + & {
      margin-top: 25px;
    }

    &-title {
      margin-bottom: 10px;

      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #b4bbc6;
    }

    &-options {
    }
  }

  &--disabled:not(&--without-border) {
    .BaseSelect__body {
      pointer-events: none;
      opacity: 0.75;
    }

    .BaseSelect__placeholder {
      color: #a5aabe;
    }

    .BaseSelect__body::after {
      opacity: 0.5;
    }
  }

  &--capitalize {
    .BaseSelect__value-text,
    .BaseSelect__option-label {
      &:first-letter {
        text-transform: capitalize;
      }
    }
  }

  &--nowrap {
    .BaseSelect__option-label {
      white-space: nowrap;
      overflow: hidden;
    }
  }

  &--small & {
    &__body {
      min-height: 40px;
      height: fit-content;
    }
  }

  &--without-border & {
    &__body {
      align-items: center;
      height: auto;

      &:focus,
      &:active {
        border-color: transparent !important;
      }
    }

    &__dropdown {
      width: fit-content;
    }
  }

  &__color {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin-right: 10px;
    flex-shrink: 0;
  }

  &__img {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f6fa;
    border-radius: 12px;
    width: 30px;
    height: 30px;
    margin-right: 7px;
    object-fit: contain;
    filter: var(--icon-filter);
  }

  &__option {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    line-height: 21px;

    &:hover {
      &:before {
        content: '';
        position: absolute;
        left: -41px;
        top: 2px;
        bottom: 2px;

        border-radius: 5px;
        width: 3px;
        background: #ff7739;
      }
    }

    & + & {
      margin-top: 12px;
    }

    &--active:before {
      content: '';
      position: absolute;
      left: -41px;
      top: 2px;
      bottom: 2px;

      border-radius: 5px;
      width: 3px;
      background: #ff7739;
    }

    &--disabled {
      color: #b4bbc6;
      cursor: default;
      pointer-events: none;
    }
  }

  &__option-count {
    font-size: 14px;
    color: #b4bbc6;
    margin-left: 5px;
  }

  &__error {
    margin-top: 10px;
  }

  &__description {
    margin-top: 5px;

    font-size: 14px;
    line-height: 20px;
    color: #a5aabe;
  }

  &__search {
    margin-bottom: 25px;
    margin-left: -15px;
    margin-right: -15px;

    .BaseInput__input::placeholder {
      color: #a5aabe;
    }
  }

  .list-move, /* apply transition to moving elements */
  .list-enter-active,
  .list-leave-active {
    transition: all $transition;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  /* ensure leaving items are taken out of layout flow so that moving
     animations can be calculated correctly. */
  .list-leave-active {
    position: absolute;
  }
}
</style>
