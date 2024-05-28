<template>
  <QuickFilterInput
    class="NumberQuickFilter"
    :label="filterMeta.title"
    :value="value"
    :white-mobile="whiteMobile"
    @remove="emit('remove-filter')"
  >
    <div class="NumberQuickFilter__dropdown">
      <NumberFilter
        :filter="filter"
        @update:filter="emit('update:filter', $event)"
      />
    </div>
  </QuickFilterInput>
</template>

<script setup lang="ts">
import {FilterMeta, FilterMetaOption} from "~/bash-frontend-kit/types/models/Filter";
import QuickFilterInput from "~/bash-frontend-kit/components/filters/QuickFilterInput.vue";
import {TableFilterStatus} from "~/bash-frontend-kit/types/table/TableFilter";
import NumberFilter from "~/bash-frontend-kit/components/filters/items/NumberFilter.vue";
import {formatNumberRange} from "~/bash-frontend-kit/utils/format/formatNumberRange";

const props = defineProps<{
  filterMeta: FilterMeta;
  filter: FilterMetaOption['value'];
  whiteMobile?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:filter', filter: TableFilterStatus);
  (e: 'remove-filter');
}>();

const value = computed(() => formatNumberRange(props.filter ?? {}));
</script>

<style lang="scss">
.NumberQuickFilter {

  &__dropdown {
    padding: 25px;
  }
}
</style>
