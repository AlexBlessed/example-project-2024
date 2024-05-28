<template>
  <TableCellWrap
    :format="format"
    class="CheckboxTableCell"
  >
    <BaseCheckbox
      v-model="model"
      :label="label"
    />
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import BaseCheckbox from '~/bash-frontend-kit/components/form/BaseCheckbox.vue';
import { computed } from '#imports';

const props = defineProps<{
  value?: boolean;
  format?: TableCellFormat;
}>();

const emit = defineEmits<{
  (e: 'change', value: any);
}>();

const labels = {
  [TableCellFormat.COMPLETED]: ['Сделано', 'Сделать'],
  [TableCellFormat.PAYED]: ['Оплачено', 'Оплатить'],
  [TableCellFormat.PAID]: ['Оплачено', 'Не оплачено'],
};

const label = computed(() => labels[props.format]?.[props.value ? 0 : 1]);

const model = computed({
  get() {
    return !!props.value;
  },
  set(value) {
    emit('change', value);
  },
});
</script>

<style lang="scss">
.CheckboxTableCell {
}
</style>
