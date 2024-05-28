<template>
  <TableCellWrap
    :format="TableCellFormat.ICON_OBJECT"
    :class="{ 'IconTableCell--overflow': isOverflowText }"
    :link="link"
    :blank-link="!props.link"
    class="IconTableCell"
  >
    <template v-if="value">
      <img
        class="IconTableCell__icon"
        :alt="value.value"
        :src="value.icon || defaultImage"
      />
      <div class="IconTableCell__text">
        {{ value.value }}
      </div>
      <Tooltip
        v-if="isOverflowText"
        class="IconTableCell__tooltip"
        large
      >
        {{ value.value }}
      </Tooltip>
    </template>
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import defaultImage from '~/bash-frontend-kit/icons/space-default-image.svg';
import { Image } from '~/bash-frontend-kit/types/base/image';

import { getTableCellSize } from '~/bash-frontend-kit/utils/table/getTableCellSize';
import Tooltip from '~/bash-frontend-kit/components/global/Tooltip.vue';
import { TableCellTypeable } from '~/bash-frontend-kit/types/table/NormalizedTable';
import getLinkInTypeable from '~/bash-frontend-kit/utils/table/getLinkInTypeable';
import { computed } from '#imports';

const props = defineProps<{
  value?: {
    id: number;
    value?: string;
    icon?: Image;
  };
  typeable: TableCellTypeable;
  link?: string;
}>();

const size = getTableCellSize(TableCellFormat.ICON_OBJECT);
const isOverflowText = computed(() => {
  return (size / 10) * 2 < props.value?.value?.toString()?.length;
});
const link = computed(
  () => props.link || getLinkInTypeable(props.typeable, props.value?.id)
);
</script>

<style lang="scss">
.IconTableCell {
  display: flex;
  align-items: center;

  &--overflow {
    position: relative;
    padding-bottom: 21px;
  }

  &--overflow & {
    &__text {
      display: block;
      max-height: 42px;
      overflow: hidden;

      &::after {
        display: block;
        content: '...';
        position: absolute;
        bottom: 0;
        left: 35px + 12px;
      }
    }
  }

  &:hover &__tooltip {
    display: block;
  }

  &__icon {
    width: 35px;
    height: 35px;
    flex-shrink: 0;
    margin-right: 12px;

    border-radius: 12px;
  }

  &__text {
  }
}
</style>
