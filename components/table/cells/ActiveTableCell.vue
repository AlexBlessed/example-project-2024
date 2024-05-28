<template>
  <TableCellWrap
    :format="TableCellFormat.ACTIVE"
    class="ActiveTableCell"
  >
    {{ value ? 'Активна' : 'Не активна' }}
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';

defineProps<{
  value?: boolean;
}>();
</script>

<style lang="scss">
.ActiveTableCell {
}
</style>
