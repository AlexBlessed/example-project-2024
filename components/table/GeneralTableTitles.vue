<template>
  <div class="GeneralTableTitles">
    <div
      v-for="(columnTitle, i) in titles"
      :key="i"
      class="GeneralTableTitles__item"
      :class="getItemClassNames(columnTitle)"
      :style="{ width: getWidth(columnTitle.format) }"
      @click="handleTitleClick(columnTitle)"
    >
      <div class="GeneralTableTitles__name">
        {{ columnTitle.name }}
      </div>
      <div
        v-if="columnTitle.sortable"
        class="GeneralTableTitles__sort"
        v-html="ArrowIcon"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TableRowAction } from '~/bash-frontend-kit/utils/data/_consts';
import { TableColumnTitle } from '~/bash-frontend-kit/types/table/TableColumn';
import ArrowIcon from '~/bash-frontend-kit/icons/arrow-hide-gray.svg?raw';
import { getTableCellSize } from '~/bash-frontend-kit/utils/table/getTableCellSize';
import { toPixels } from '~/bash-frontend-kit/utils/format/toPixels';

import {
  TableColumnSort,
  TableColumnSortStatus,
} from '~/bash-frontend-kit/types/table/TableColumnsSettings';
import Column from '~/bash-frontend-kit/types/models/Column';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';

const props = defineProps<{
  titles: Column[];
  columnsSort?: TableColumnSort;
}>();

const emit = defineEmits<{
  (e: 'item-action', action: { action: TableRowAction; id: number });
  (e: 'update:columns-sort', sort: TableColumnSort);
  (e: 'remove-column', id: number);
}>();

function getWidth(format: TableCellFormat): string {
  return toPixels(getTableCellSize(format));
}

function handleTitleClick({ sortable, is_custom, slug, id }: TableColumnTitle) {
  if (props.columnsSort && sortable) {
    changeSortStatus(slug);
  }
}

function changeSortStatus(type: string) {
  const activeSortStatus = props.columnsSort[type];

  if (activeSortStatus === TableColumnSortStatus.descending) {
    const columnsSortCopy = { ...props.columnsSort };
    delete columnsSortCopy[type];
    emitSortStatus(columnsSortCopy);
  } else {
    if (activeSortStatus === TableColumnSortStatus.ascending) {
      emitSortStatus({
        ...props.columnsSort,
        [type]: TableColumnSortStatus.descending,
      });
    } else {
      emitSortStatus({
        ...props.columnsSort,
        [type]: TableColumnSortStatus.ascending,
      });
    }
  }
}

function emitSortStatus(columnsSort: TableColumnSort) {
  emit('update:columns-sort', columnsSort);
}

function getItemClassNames(item) {
  return [
    {
      [`GeneralTableTitles__slug--${item.slug}`]: item.slug,
      'GeneralTableTitles__item--interactive': item.sortable || item.is_custom,
      'GeneralTableTitles__item--sortable': item.sortable,
      'GeneralTableTitles__item--sortable-asc':
        props.columnsSort?.[item.slug] === TableColumnSortStatus.ascending,
      'GeneralTableTitles__item--sortable-desc':
        props.columnsSort?.[item.slug] === TableColumnSortStatus.descending,
    },
  ];
}
</script>

<style lang="scss">
.GeneralTableTitles {
  display: flex;
  justify-content: space-between;
  padding-bottom: 23px;
  border-bottom: 1px solid #edeef4;

  @include mobile {
    display: none;
  }

  &__name {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__item {
    display: flex;
    align-items: center;

    font-weight: 400;
    font-size: 16px;
    line-height: 23px;
    color: #b4bbc6;
    white-space: nowrap;

    &--interactive {
      cursor: pointer;
      transition: color $transition;

      &:hover {
        color: #3b4453;
      }
    }

    &--sortable {
      &-asc,
      &-desc {
        color: #3b4453;

        path {
          stroke: #3b4453;
        }
      }

      &-asc {
      }

      &-desc {
        svg {
          transform: rotate(180deg);
        }
      }
    }

    & + & {
      margin-left: 38px;
    }
  }

  &__sort {
    display: flex;
    margin-left: 5px;
  }
}
</style>
