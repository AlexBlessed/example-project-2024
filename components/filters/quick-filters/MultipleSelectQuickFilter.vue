<template>
  <QuickFilterInput
    class="MultipleSelectQuickFilter"
    :label="filterMeta.title"
    :value="value"
    :white-mobile="whiteMobile"
    @remove="emit('remove-filter')"
  >
    <div class="MultipleSelectQuickFilter__dropdown">
      <MultipleSelectFilter
        :options="filterMeta.options"
        :filter-meta="filterMeta"
        :filter="filter"
        :persist-filter-options="persistFilterOptions"
        @update:filter="emit('update:filter', $event)"
        @update:persist-filter-options="emit('update:persist-filter-options', $event)"
      />
    </div>
  </QuickFilterInput>
</template>

<script setup lang="ts">
import {FilterMeta, FilterMetaOption} from "~/bash-frontend-kit/types/models/Filter";
import QuickFilterInput from "~/bash-frontend-kit/components/filters/QuickFilterInput.vue";
import MultipleSelectFilter from "~/bash-frontend-kit/components/filters/items/MultipleSelectFilter.vue";
import {TableFilterStatus} from "~/bash-frontend-kit/types/table/TableFilter";
import {wordDeclensionWithCount} from "~/bash-frontend-kit/utils/declension";

const props = defineProps<{
  filterMeta: FilterMeta;
  persistFilterOptions: FilterMetaOption[];
  filter: FilterMetaOption['value'];
  whiteMobile?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:filter', filter: TableFilterStatus);
  (e: 'update:persist-filter-options', filter: FilterMetaOption[]);
  (e: 'remove-filter');
}>();

const value = computed(() => {
  const options = [
    ...props.filterMeta.options,
    ...(props.persistFilterOptions ?? []),
  ];

  const activeOptions = options.filter((option) => props.filter?.includes(option.value));

  if (activeOptions.length) {
    if (activeOptions.length > 1 && props.filterMeta.title_selection?.length) {
      return wordDeclensionWithCount(activeOptions.length, ...props.filterMeta.title_selection);
    } else {
      return activeOptions.map(option => option.text).join(', ');
    }
  }
});
</script>

<style lang="scss">
.MultipleSelectQuickFilter {

  &__dropdown {
    padding: 25px;
  }

  .MultipleSelectFilter__action {
    display: none;
  }

  @include mobileUp {
    .MultipleSelectFilter__title {
      white-space: nowrap;
    }
  }
}
</style>
