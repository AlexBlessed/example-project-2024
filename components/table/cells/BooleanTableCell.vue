<template>
  <TableCellWrap
    :format="TableCellFormat.BOOLEAN"
    class="BooleanTableCell"
  >
    <div
      v-if="value"
      class="BooleanTableCell__status BooleanTableCell__status--active"
    >
      {{ yesNo ? 'Да' : 'Есть' }}
    </div>
    <div
      v-else
      class="BooleanTableCell__status BooleanTableCell__status--inactive"
    >
      Нет
    </div>
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import { computed } from '#imports';

const props = defineProps<{
  value?: '' | boolean;
  format?: TableCellFormat;
}>();

const yesNo = computed(() => props.format === TableCellFormat.YES_NO);
</script>

<style lang="scss">
.BooleanTableCell {
  &__status {
    display: flex;
    align-items: center;
    position: relative;

    &::before {
      content: '';
      display: flex;
      flex-shrink: 0;

      width: 10px;
      height: 10px;

      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;

      margin-right: 6px;
    }

    &--active {
      &::before {
        background-image: url('~/bash-frontend-kit/icons/checkmark-black.svg');
      }
    }

    &--inactive {
      &::before {
        background-image: url('~/bash-frontend-kit/icons/minus.svg');
      }
    }
  }
}
</style>
