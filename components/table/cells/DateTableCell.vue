<template>
  <TableCellWrap
    :format="TableCellFormat.DATE"
    class="DateTableCell"
  >
    {{ formattedDate }}
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import { RawDate } from '~/bash-frontend-kit/types/base/date';
import { dateTime } from '~/bash-frontend-kit/libs/date-time/dateTime';


const props = defineProps<{
  value?: RawDate;
  format?: TableCellFormat;
}>();

const formattedDate = computed(() => {
  const date = dateTime(props.value);
  if (date.notEmpty) {
    if (props.format === TableCellFormat.DATE_WITHOUT_TIME) {
      return date.formatFullDate(false);
    } else {
      return date.formatFullDateTime();
    }
  }
  return '';
});
</script>

<style lang="scss">
.DateTableCell {
}
</style>
