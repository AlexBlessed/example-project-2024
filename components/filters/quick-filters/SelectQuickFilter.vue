<template>
  <QuickFilterInput
    class="SelectQuickFilter"
    :label="filterMeta.title"
    :value="value"
    :persist="persist"
    :white-mobile="whiteMobile"
    ref="filterInput"
    @remove="emit('remove-filter')"
  >
    <SelectFilter
      ref="selectFilter"
      :options="filterMeta.options"
      :filter-meta="filterMeta"
      :filter="filter"
      @update:filter="updateFilter"
    />
  </QuickFilterInput>
</template>

<script setup lang="ts">
import {FilterMeta, FilterMetaOption} from "~/bash-frontend-kit/types/models/Filter";
import QuickFilterInput from "~/bash-frontend-kit/components/filters/QuickFilterInput.vue";
import SelectFilter from "~/bash-frontend-kit/components/filters/items/SelectFilter.vue";
import {TableFilterStatus} from "~/bash-frontend-kit/types/table/TableFilter";
import {optionsIsGrouped} from "~/bash-frontend-kit/composables/form/optionsIsGrouped";
import {InputOptionsGroup} from "~/bash-frontend-kit/types/form/InputOptionsGroup";

const props = defineProps<{
  filterMeta: FilterMeta;
  filter: FilterMetaOption['value'];
  persist?: boolean;
  whiteMobile?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:filter', filter: TableFilterStatus);
  (e: 'remove-filter');
}>()

const activeOption = computed(() => {
  const grouped = optionsIsGrouped(computed(() => props.filterMeta.options));

  if (grouped.value) {
    const flatOptions = (props.filterMeta.options as any as InputOptionsGroup[]).reduce((sum, { options }) => [...sum, ...options], []);
    return flatOptions.find((option) => {
      return option.value === props.filter;
    });
  } else {
    return props.filterMeta.options.find((option) => option.value === props.filter);
  }
});

const filterInput = ref(null);

function updateFilter(filter) {
  emit('update:filter', filter);
  filterInput.value?.close();
}

const selectFilter = ref(null);

const value = computed(() => {
  return activeOption.value?.text;
});
</script>

<style lang="scss">
.SelectQuickFilter {

  @include mobileUp {
    .BaseSelect {
      &__dropdown {
        padding-right: 20px;
      }

      &__option-label {
        white-space: nowrap;
      }
    }
  }
}
</style>
