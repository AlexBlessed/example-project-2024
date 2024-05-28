<template>
  <div
    class="BaseInput"
    :class="[{
      'BaseInput--small': small,
      'BaseInput--without-border': withoutBorder,
      'BaseInput--mini': mini,
      'BaseInput--opacity': opacity,
      'BaseInput--mini-md': miniMd,
      'BaseInput--lg': lg,
      'BaseInput--number': number,
      'BaseInput--enter-icon': enterIcon,
    }, props.class]"
  >
    <img
      v-if="searchIcon"
      class="BaseInput__search-icon"
      src="@/bash-frontend-kit/icons/search.svg"
      alt=""
    />
    <img
      v-if="customIcon"
      class="BaseInput__custom-icon"
      :src="customIcon"
      alt=""
    />
    <div
      v-if="copy"
      class="BaseInput__copy-icon"
      v-html="copied ? CopiedIcon : CopyIcon"
      @click="copyValue"
    />
    <img
      v-if="loadingIcon"
      v-show="pending"
      class="BaseInput__loading-icon"
      :class="{ 'BaseInput__loading-icon--loading': pending }"
      src="@/bash-frontend-kit/icons/loading.svg"
      alt=""
    />
    <img
      v-if="closeIcon"
      class="BaseInput__close-icon"
      src="@/bash-frontend-kit/icons/close.svg"
      alt=""
      @click="clean"
    />
    <span
      v-if="actionButton"
      class="BaseInput__action"
    >
      Найти
    </span>
    <BaseLabel
      :gray="grayLabel"
      :label="label ?? placeholder"
      :readonly="readonly"
      :disabled="disabled || blue"
      :value="valueModel"
    >
      <div class="BaseInput__body">
        <input
          ref="input"
          v-bind="$attrs"
          v-model="valueModel"
          class="BaseInput__input"
          :required="required"
          :autofocus="autoFocus"
          :class="{
            'BaseInput__input--error': error,
            'BaseInput__input--gray-placeholder': grayPlaceholder,
            'BaseInput__input--blue': blue,
            'BaseInput__input--search-icon': searchIcon,
            'BaseInput__input--custom-icon': customIcon,
            'BaseInput__input--required': required,
            'BaseInput__input--has-icon': hasIcon,
            'BaseInput__input--pro-access': proAccess,
            'BaseInput__input--tooltip': tooltip,
          }"
          :style="{ 'min-width': minWidth && `${minWidth}px` }"
          :type="getType"
          :placeholder="placeholderStr"
          :disabled="disabled || pending"
          :readonly="readonly"
          @keydown.enter="$emit('enter')"
        />
        <div
          v-if="proAccess && !valueModel"
          class="BaseInput__static-placeholder"
        >
          <span>{{ placeholder }}</span>
          <ProAccountTag
            disabled
            class="BaseInput__pro-access"
          />
        </div>
        <div
          v-if="!error && !disabled"
          class="BaseInput__checkmark-icon"
        >
          <img
            v-if="type === 'password' && getType === 'password'"
            class="BaseInput__show-pass"
            src="@/bash-frontend-kit/icons/eye.svg"
            alt=""
            @click="showPass"
          />
          <img
            v-else-if="type === 'password' && getType !== 'password'"
            class="BaseInput__show-pass"
            src="@/bash-frontend-kit/icons/eye-closed.svg"
            alt=""
            @click="showPass"
          />
          <img
            v-else-if="valid && type !== 'password'"
            src="@/bash-frontend-kit/icons/input-valid-checkmark.svg"
            alt=""
          />
          <BaseTooltip
            v-else-if="tooltip || $slots.tooltip || premiumAccess"
            :tooltip="tooltip"
          >
            <slot name="tooltip">
              <div v-if="premiumAccess">
                Услуга доступна только при премиум размещении
              </div>
            </slot>
            <template #icon>
              <slot name="icon">
                <span
                  v-if="premiumAccess"
                  class="BaseInput__premium-tooltip-icon"
                  v-html="PremiumTooltipIcon"
                />
              </slot>
            </template>
          </BaseTooltip>
        </div>
      </div>
      <InputError
        v-if="!disabled"
        class="BaseInput__error"
        :error="error"
      />
      <div
        v-if="description"
        class="BaseInput__description"
      >
        {{ description }}
      </div>
      <div
        v-if="copied"
        class="BaseInput__copied"
      >
        Скопировано
      </div>
    </BaseLabel>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from '#imports';
import BaseLabel from '~/bash-frontend-kit/components/form/BaseLabel.vue';
import InputError from '~/bash-frontend-kit/components/form/sub-elements/InputError.vue';
import BaseTooltip from '~/bash-frontend-kit/components/form/BaseTooltip.vue';
import ProAccountTag from '~/bash-frontend-kit/components/global/ProAccountTag.vue';
import PremiumTooltipIcon from '~/bash-frontend-kit/icons/premium-access-input-tooltip.svg?raw';
import CopyIcon from '~/bash-frontend-kit/icons/copy-gray.svg?raw';
import CopiedIcon from '~/bash-frontend-kit/icons/checkmark-black.svg?raw';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  label: {
    type: String,
    default: null,
    required: false,
  },
  error: {
    type: [String, Array],
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  description: String,
  grayPlaceholder: Boolean,
  tooltip: String,
  valid: Boolean,
  confirm: Boolean,
  blue: Boolean,
  small: Boolean,
  withoutBorder: Boolean,
  grayLabel: Boolean,
  searchIcon: Boolean,
  actionButton: Boolean,
  closeIcon: Boolean,
  customIcon: String,
  loadingIcon: Boolean,
  disabled: Boolean,
  pending: Boolean,
  number: Boolean,
  required: Boolean,
  readonly: Boolean,
  proAccess: Boolean,
  premiumAccess: Boolean,
  copy: Boolean,
  mini: Boolean,
  miniMd: Boolean,
  lg: Boolean,
  minWidth: Number,
  autoFocus: Boolean,
  enterIcon: Boolean,
  trim: Boolean,
  opacity: Boolean,
  class: String,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'clean'): void;
  (e: 'enter'): void;
}>();

const input = ref(null);

const valueModel = computed({
  get: () => props.modelValue,
  set: (e) => {
    if (props.trim) {
      emit('update:modelValue', e?.toString()?.trim());
    } else {
      emit('update:modelValue', e);
    }
  },
});

const hasIcon = computed(
  () =>
    props.searchIcon ||
    props.closeIcon ||
    props.loadingIcon ||
    props.confirm ||
    props.customIcon ||
    props.valid ||
    props.copy
);

const getType = ref(props.type);

const copied = ref(false);

watch(
  () => props.type,
  () => {
    getType.value = props.type;
  }
);

const placeholderStr = computed(() =>
  props.required && props.placeholder && !props.disabled
    ? `${props.placeholder} *`
    : props.placeholder
);

function clean() {
  valueModel.value = '';
  emit('clean');
}

function copyValue() {
  navigator.clipboard.writeText(valueModel.value.toString());
  copyUrl();
}

function showPass() {
  if (getType.value === 'text') getType.value = 'password';
  else getType.value = 'text';
}

function copyUrl() {
  copied.value = true;

  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

defineExpose({ input });
</script>

<style lang="scss">
.BaseInput {
  display: flex;
  flex-direction: column;
  position: relative;

  &:focus-within input::placeholder {
    color: transparent;
  }

  &__search-icon {
    position: absolute;
    left: 11px;
    top: 16px;
    height: 14px;
    width: 14px;
    z-index: 2;
  }

  &__show-pass {
    cursor: pointer;
  }

  &__custom-icon {
    position: absolute;
    left: 11px;
    top: 18px;
    height: 14px;
    width: 14px;
    z-index: 2;
  }

  &__copy-icon {
    position: absolute;
    right: 15px;
    top: 14px;
    width: 17px;
    height: 20px;
    z-index: 2;
    cursor: pointer;

    &:hover {
      path {
        stroke: #3b4453;
      }
    }
  }

  &__copied {
    margin-top: 10px;
    color: #b4bbc6;
  }

  &__loading-icon {
    position: absolute;
    right: 17px;
    top: 16px;
    width: 18px;
    height: 18px;
    z-index: 2;

    &--loading {
      @keyframes backgroundColorAnimation {
        from {
          transform: rotate(0);
        }
        to {
          transform: rotate(360deg);
        }
      }

      animation-name: backgroundColorAnimation;
      animation-duration: 1.5s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }
  }

  &__close-icon {
    position: absolute;
    right: 19px;
    top: 18px;
    height: 8px;
    width: 8px;
    z-index: 2;
    cursor: pointer;
  }

  &__action {
    position: absolute;
    right: 48px;
    top: 13px;
    z-index: 2;

    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    color: #ff7739;
    cursor: pointer;
  }

  &__body {
    position: relative;
    display: flex;
  }

  &--small & {
    &__input {
      width: auto;
      min-width: 100%;
      height: fit-content;
      padding: 8px 30px 8px 15px;
      line-height: 23px;

      &:disabled {
        padding: 6px 18px 6px 0;
      }

      &:not(:read-only) {
        &:hover {
          border: 1px solid #edeef4;
        }
      }
    }
  }

  &--without-border & {
    &__input {
      background: none;
      border-color: transparent;

      &:disabled {
        opacity: 1;
        -webkit-text-fill-color: #3b4453;
      }
    }
  }

  &--mini {
    .BaseInput__input {
      max-width: 30px;
      min-width: unset;
      padding: 0;
      text-align: center;
    }
  }

  &--mini-md {
    .BaseInput__input {
      max-width: 60px;
      min-width: unset;
      padding: 0;
      text-align: center;
    }
  }

  &--lg {
    .BaseInput__input {
      border: none;
    }
  }

  &--number {
    .BaseInput__input {
      text-align: center;
      width: 100%;
      margin: 0;
      padding: 6px 0;
    }
  }

  &--enter-icon & {
    &__input {
      padding-right: 32px;
    }

    &__body {
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: 12px;
        transform: translateY(-50%);

        width: 18px;
        height: 18px;

        background-image: url('~/bash-frontend-kit/icons/enter.svg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }

  &__input {
    @include baseInputBlock;
    @include baseInputText;
    appearance: none;

    &::-webkit-inner-spin-button,
    &::-webkit-calendar-picker-indicator {
      display: none;
      -webkit-appearance: none;
    }

    &--error {
      border: 1px solid #ff5101;
    }

    &::placeholder {
      font-weight: 400;
      font-size: 16px;
      line-height: 23px;
      color: var(--text);
    }

    &:disabled {
      opacity: 0.75;
      cursor: default;
    }

    &:read-only {
      cursor: default;
    }

    &:not(:read-only) {
      &:focus,
      &:active {
        border: 1px solid #ff7739 !important;
      }
    }

    &--gray-placeholder::placeholder {
      font-size: 14px;
      line-height: 20px;
      color: #a5aabe;
    }

    &--blue {
      height: 46px;
      border: 0;
      background: #f9fafc;
      border-radius: 13px;
    }

    &--search-icon {
      padding-left: 35px;
    }

    &--custom-icon {
      padding-left: 30px;
    }

    &--required {
    }

    &--has-icon {
      padding-right: 34px;
    }

    &--pro-access {
      &::placeholder {
        opacity: 0;
      }
    }

    &--tooltip {
      padding-right: 42px;
    }
  }

  &__checkmark-icon {
    display: flex;

    .BaseTooltip {
      margin-right: -4px;
    }
  }

  &__error {
    margin-top: 10px;
  }

  &__checkmark-icon,
  &__error-tag {
    position: absolute;
    z-index: 2;
    top: 50%;
    transform: translateY(-50%);
    right: 16px;
  }

  &:focus-within &__static-placeholder {
    display: none;
  }
  &__input[readonly] + &__static-placeholder {
    display: flex;
  }

  &__static-placeholder {
    position: absolute;
    left: 16px;

    display: flex;
    align-items: center;

    max-width: calc(100% - 60px);
    height: 100%;

    color: #b4bbc6;

    span {
      white-space: nowrap;
      overflow: hidden;
    }
  }

  &--opacity & {
    &__input {
      background: none;
      border-color: transparent;

      &:disabled {
        opacity: 1;
      }

      &:hover,
      &:focus,
      &:active {
        border: transparent !important;
      }
    }
  }

  &__pro-access {
    margin-left: 8px;
  }

  &__premium-tooltip-icon {
    display: flex;
  }

  .BaseTooltip--active & {
    &__premium-tooltip-icon {
      circle {
        background: rgba(255, 119, 57, 0.1);
      }

      path {
        stroke: #ff7739;
      }
    }
  }

  &__description {
    margin-top: 5px;

    font-size: 14px;
    line-height: 20px;
    color: #a5aabe;
  }
}
</style>
