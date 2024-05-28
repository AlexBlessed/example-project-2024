<template>
  <div
    class="GeneralTableMobileLine"
    :class="[typeClass, formatClass]"
  >
    <div
      v-if="icon"
      :style="bgIcon"
      class="GeneralTableMobileLine__icon"
    />
    <div class="GeneralTableMobileLine__content">
      <div
        v-if="title"
        class="GeneralTableMobileLine__title"
      >
        {{ title }}
      </div>
      <Component
        :is="takeComponentTableCell(format)"
        v-if="type === RowMobileInfoItemType.CELL"
        :slug="slug"
        :format="format"
        :value="content"
        :options="options"
        @change="change"
      />
      <FullContentTransition
        v-else-if="type === RowMobileInfoItemType.TEXT"
        :height="42"
        :lines="2"
        :opened="opened"
      >
        {{ content }}
      </FullContentTransition>
      <template v-else>{{ content }}</template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RowMobileInfoItemType } from '~/bash-frontend-kit/types/table/NormalizedTable';
import { takeComponentTableCell } from '~/bash-frontend-kit/utils/table/tableCellFormatToComponentMap';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import FullContentTransition from '~/bash-frontend-kit/components/global/animation/FullContentTransition.vue';

const props = defineProps<{
  type: RowMobileInfoItemType;
  title?: string;
  content: any;
  icon?: string;
  format?: TableCellFormat;
  options?: any[];
  opened?: boolean;
}>();

const emit = defineEmits<{
  (e: 'change', changes: any);
}>();

const bgIcon = computed(() => ({ background: props.icon }));
const typeClass = computed(() => `GeneralTableMobileLine--${props.type}`);
const formatClass = computed(
  () => props.format && `GeneralTableMobileLine--${props.format}`
);

function change(changes) {
  emit('change', changes);
}
</script>

<style lang="scss">
.GeneralTableMobileLine {
  display: flex;
  align-items: center;

  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  text-overflow: ellipsis;

  &:first-child .ColorTableCell {
    margin-bottom: 10px;
  }

  &__icon {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 10px;
  }

  &__title {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #b4bbc6;
    margin-bottom: 5px;
  }

  &--bold {
    //white-space: nowrap;
    overflow: hidden;

    font-weight: 700;
    font-size: 16px;
    line-height: 23px;
  }

  .GeneralTableMobileRow__header ~ .GeneralTableMobileRow__content & {
    &--cell:first-child {
      margin-top: 10px;
    }

    &--rating:first-child {
      margin: 0 0 5px;
    }
  }

  &--text &__content {
    /*display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 21px;
    padding-right: 20px;*/
    //max-width: 136px;
  }

  &--action {
    margin-top: 25px;
  }

  &--action &__content {
    width: 100%;

    .ActionTableCell {
      width: 100% !important;
    }
  }

  & + &--cell {
    margin-top: 10px;
  }

  & + &--is_completed {
    margin-top: 18px;
  }

  .TableCellWrap {
    width: 100% !important;
  }
}
</style>
