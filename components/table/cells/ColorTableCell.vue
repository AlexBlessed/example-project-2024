<template>
  <TableCellWrap
    :format="TableCellFormat.COLOR_OBJECT"
    class="ColorTableCell"
  >
    <ColorTableSelect
      :model-value="value"
      :options="options"
      @update:model-value="select"
    />
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import ColorTableSelect from '~/bash-frontend-kit/components/table/cells/ColorTableSelect.vue';

const props = defineProps<{
  value?: {
    id: number;
    value?: string;
    color?: string;
  };
  options: { name: string; id: number }[] | false;
}>();

const emit = defineEmits<{
  (e: 'change', value: number): void;
}>();

function select(option) {
  emit('change', option);
}
</script>

<style lang="scss">
.ColorTableCell {
  display: flex;
  align-items: center;

  &__color {
    width: 10px;
    height: 10px;
    flex-shrink: 0;

    margin-right: 10px;
    border-radius: 50%;
  }

  &__text {
  }
}
</style>
