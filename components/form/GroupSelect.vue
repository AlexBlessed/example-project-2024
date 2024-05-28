<template>
  <BaseSelect
    v-model="selectModel"
    :options="optionsWithGroup"
    searchable
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import BaseSelect from '~/bash-frontend-kit/components/form/BaseSelect.vue';
import { InputOptionsGroup } from '~/bash-frontend-kit/types/form/InputOptionsGroup';
import { computed } from '#imports';

const props = defineProps<{
  options: InputOptionsGroup[];
  modelValue: any;
  group: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any);
  (e: 'update:group', group: any);
}>();

const optionsWithGroup = computed(() => {
  return props.options.map((group) => ({
    ...group,
    options:
      group.options?.map((option) => ({
        ...option,
        value: `${group.group}/${option.value}`,
      })) ?? [],
  }));
});

const selectModel = computed({
  set(value: string) {
    const [optionGroup, optionValue] = parseValue(value);
    emit('update:group', optionGroup);
    emit('update:modelValue', optionValue);
  },
  get() {
    return `${props.group}/${props.modelValue}`;
  },
});

function parseValue(value: string) {
  return value.split('/') as [string, string];
}
</script>

<style lang="scss">
.GroupSelect {
}
</style>
