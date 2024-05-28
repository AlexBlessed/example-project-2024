<template>
  <BaseSelect
    v-if="sortOptions?.length"
    v-model="activeSortModel"
    class="TableSortSelect"
    :options="sortOptions"
    placeholder="Сортировать"
    label
    without-border
    fit-width
    no-wrap
  />
</template>

<script setup lang="ts">
import BaseSelect from '~/bash-frontend-kit/components/form/BaseSelect.vue';
import { TableColumnSort, TableColumnSortStatus } from '~/bash-frontend-kit/types/table/TableColumnsSettings';
import Column from '~/bash-frontend-kit/types/models/Column';

const props = defineProps<{
  modelValue?: TableColumnSort;
  columns: Column[];
}>();

const emit = defineEmits<{
  (e: 'update:model-value', sort: TableColumnSort);
}>();

const sortOptions = computed(() => {
  return props.columns?.reduce((options, column) => {
    if (column.sortable) {
      options.push({
        value: column.slug,
        label: column.name_sort ?? column.name,
      });
    }

    return options;
  }, []);
});

const activeSortModel = computed({
  set(slug: string) {
    emit('update:model-value', { [slug]: TableColumnSortStatus.ascending });
  },
  get() {
    if (props.modelValue) {
      return Object.keys(props.modelValue)[0];
    }
  },
});
</script>

<style lang="scss">
.TableSortSelect {
  display: flex;
  align-items: center;
}
</style>
