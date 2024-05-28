<template>
  <TableCellWrap
    :format="TableCellFormat.MOBILE_CHECKBOX_DATE"
    class="MobileTableCellTask"
  >
    <BaseCheckbox
      v-model="model"
      :label="value.label"
    />
    <div
      v-if="formattedDate"
      class="MobileTableCellTask__date"
    >
      {{ formattedDate }}
    </div>
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import BaseCheckbox from '~/bash-frontend-kit/components/form/BaseCheckbox.vue';
import { computed } from '#imports';
import { dateTime } from '~/bash-frontend-kit/libs/date-time/dateTime';
import { AnyDate } from '~/bash-frontend-kit/types/base/date';

const props = defineProps<{
  value?: {
    checked: boolean;
    label: string;
    date: AnyDate;
  };
}>();

const emit = defineEmits<{
  (e: 'change', value: any);
}>();

const model = computed({
  get() {
    return !!props.value.checked;
  },
  set(value) {
    emit('change', value);
  },
});

const formattedDate = computed(() => {
  const date = dateTime(props.value.date);
  if (date.notEmpty) {
    return date.formatFullDateTime();
  }
  return '';
});
</script>

<style lang="scss">
.MobileTableCellTask {
  &__date {
    margin-top: 2px;
    margin-left: 32px;

    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: var(--gray);
  }
}
</style>
