<template>
  <TableCellWrap
    :format="format"
    class="PriorityTableCell"
  >
    <BadgePriority
      v-if="value"
      :priority="value"
    />
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import BadgePriority from '~/bash-frontend-kit/components/table/cells/BadgePriority.vue';
import { PriorityTask } from '~/bash-frontend-kit/types/models/Task';

const props = defineProps<{
  value?: PriorityTask;
  format?: TableCellFormat;
}>();
</script>

<style lang="scss">
.PriorityTableCell {
}
</style>
