<template>
  <QuickFilterInput
    class="PlainNumberQuickFilter"
    :active="focused"
    :label="filterMeta.title"
    :value="filter"
    :white-mobile="whiteMobile"
    @remove="emit('remove-filter')"
  >
    <template #input>
      <BaseInput
        :placeholder="filterMeta.title"
        without-border
        type="number"
        :model-value="filter"
        @update:modelValue="debouncedFilterUpdate"
        @focus="focused = true"
        @blur="focused = false"
      />
    </template>
    <template #arrow>
      <span/>
    </template>
  </QuickFilterInput>
</template>

<script setup lang="ts">
import QuickFilterInput from '~/bash-frontend-kit/components/filters/QuickFilterInput.vue';
import { FilterMeta, FilterMetaOption } from '~/bash-frontend-kit/types/models/Filter';
import { TableFilterStatus } from '~/bash-frontend-kit/types/table/TableFilter';
import debounce from 'lodash.debounce';
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';

const props = defineProps<{
  filterMeta: FilterMeta;
  filter: FilterMetaOption['value'];
  whiteMobile?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:filter', filter: TableFilterStatus);
  (e: 'remove-filter');
}>();

const focused = ref(false);

const debouncedFilterUpdate = debounce((filter) => {
  emit('update:filter', filter);
}, 500);
</script>

<style lang="scss">
.PlainNumberQuickFilter {

  .QuickFilterInput__input {
    padding: 0;
  }

  &:not(.QuickFilterInput--active)  {
    .QuickFilterInput__label {
      display: none;
    }
  }

  .BaseInput__input {
    max-width: 148px;
    padding: 0 16px;
    height: 51px;
    border: none !important;
  }

  .BaseInput__input:not(:read-only):focus, .BaseInput__input:not(:read-only):active {
    border: none !important;
  }

  .BaseLabel__placeholder {
    display: none !important;
  }

  .QuickFilterInput__dropdown {
    display: none;
  }
}
</style>
