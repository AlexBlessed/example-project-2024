<template>
  <div class="BaseTagsSelect">
    <div
      v-if="white ? !disabled : true"
      class="BaseTagsSelect__input"
    >
      <BaseSelect
        :model-value="modelValue"
        :reduce="reduce"
        :options="options"
        :get-options-label="getOptionsLabel"
        :get-option-label="getOptionLabel"
        :placeholder="placeholder"
        :default-img="defaultImg"
        :multiple="isMultiple"
        :disabled="disabled"
        :item-select-all="itemSelectAll"
        v-bind="$attrs"
        @update:modelValue="updateModelValue"
        @update:group="updateGroup"
      />
    </div>
    <TagsList
      class="BaseTagsSelect__tags-list"
      :model-value="tags"
      :reduce="reduce"
      :get-label="getOptionLabel"
      :default-icon="defaultImg"
      :draggable="!disableDrag && !disabled"
      :primary-number="primaryNumber"
      :disabled="disabled"
      :white="white"
      @update:modelValue="updateTags"
    />
  </div>
</template>

<script setup lang="ts">
import {InputOption} from '~/bash-frontend-kit/types/form/InputOption';
import BaseSelect from '~/bash-frontend-kit/components/form/BaseSelect.vue';
import {InputOptionsGroup} from '~/bash-frontend-kit/types/form/InputOptionsGroup';
import TagsList from '~/bash-frontend-kit/components/form/sub-elements/TagsList.vue';
import {sortByOrderList} from '~/bash-frontend-kit/utils/data/array/sortByOrderList';
import {optionsIsGrouped} from '~/bash-frontend-kit/composables/form/optionsIsGrouped';
import {InputOptionWithIcon} from '~/bash-frontend-kit/types/form/InputOptionWithIcon';

const props = defineProps<{
  modelValue: any[] | null;
  options: InputOption[] | InputOptionWithIcon[] | InputOptionsGroup[] | any[];
  reduce?: (option: any) => any;
  getOptionsLabel?: (options: any[]) => string;
  getOptionLabel?: (option: any) => string;
  placeholder: string;
  primaryNumber?: number;
  disableDrag?: boolean;
  white?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  defaultImg?: string;
  itemSelectAll?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', selectedList: any[]);
  (e: 'update:group', group: any);
}>();

const isMultiple = computed(() => props.multiple ?? true);

const grouped = optionsIsGrouped(computed(() => props.options));

function reduceOption(option: any) {
  if (props.reduce) {
    return props.reduce(option);
  }
  return (option as InputOption).value;
}

const normalizedOptions = computed<InputOption[]>(() => {
  if (!props.options) {
    return [];
  }
  if (grouped.value) {
    return (props.options as InputOptionsGroup[]).reduce(
      (sum, { options }) => [...sum, ...options],
      []
    );
  } else {
    return props.options;
  }
});

const tags = computed(() => {
  if (!props.modelValue) {
    return [];
  }
  const activeOptions = normalizedOptions.value.filter((option) => {
    const id = reduceOption(option);

    return isMultiple.value
      ? props.modelValue.includes(id)
      : props.modelValue === id;
  });
  return sortByOrderList(activeOptions, props.modelValue, reduceOption);
});

function updateTags(tags: any[]) {
  updateModelValue(tags.map(reduceOption));
}

function updateModelValue(tags: any[]) {
  emit('update:modelValue', tags);
}
function updateGroup(group: any) {
  emit('update:group', group);
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss">
.BaseTagsSelect {
  min-width: 0;

  &__input {
  }

  &__tags-list:first-child {
    margin-left: -15px;
  }

  &__tags-list:not(:first-child) {
    margin-top: 15px;
  }
}
</style>
