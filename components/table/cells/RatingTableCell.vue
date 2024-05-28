<template>
  <TableCellWrap
    :format="TableCellFormat.RATING"
    class="ListTableCell"
  >
    <StarsRating
      v-if="value != null"
      :rating="value"
      :long="!$media.md"
      small
    />
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import StarsRating from '~/bash-frontend-kit/components/global/rating/StarsRating.vue';

const props = defineProps<{
  value?: number;
}>();
</script>

<style lang="scss">
.RatingTableCell {
}
</style>
