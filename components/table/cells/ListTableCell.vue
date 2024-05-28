<template>
  <TableCellWrap
    :format="TableCellFormat.LIST"
    class="ListTableCell"
  >
    <ApplicationTagsList :list="list" />
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import ApplicationTagsList from '~/bash-frontend-kit/components/table/cells/ApplicationTagsList.vue';

const props = defineProps<{
  value?: string[] | string;
}>();

const list = computed(() => {
  if (Array.isArray(props.value)) {
    return props.value;
  } else {
    return [props.value];
  }
});
</script>

<style lang="scss">
.ListTableCell {
}
</style>
