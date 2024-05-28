<template>
  <TableCellWrap
    :format="format"
    :link="link"
    class="FileTableCell"
    :class="[
      { 'FileTableCell--overflow': isOverflow },
      `FileTableCell__slug--${slug}`,
    ]"
  >
    <FileItem
      v-if="firstFile"
      :file="firstFile"
    />
    <Tooltip
      v-if="isOverflow"
      class="FileTableCell__tooltip"
      large
    >
      <FileItem
        v-for="(file, i) in otherFiles"
        :key="i"
        :file="file"
      />
    </Tooltip>
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';

import { getTableCellSize } from '~/bash-frontend-kit/utils/table/getTableCellSize';
import Tooltip from '~/bash-frontend-kit/components/global/Tooltip.vue';
import FileItem from '~/bash-frontend-kit/components/global/FileItem.vue';
import { FileAny } from '~/bash-frontend-kit/types/models/FileServer';

const props = defineProps<{
  value?: FileAny[];
  format?: TableCellFormat;
  slug?: string;
  link?: string;
}>();

const size = computed(() => getTableCellSize(props.format));
const isOverflow = computed(() => {
  return props.value && props.value.length > 1;
});

const firstFile = computed(() => Array.isArray(props.value) && props.value[0]);
const otherFiles = computed(
  () => Array.isArray(props.value) && props.value.slice(1)
);
</script>

<style lang="scss">
.FileTableCell {
  word-break: break-word;

  &:hover &__tooltip {
    display: block;
  }

  &--overflow {
    position: relative;
    padding-bottom: 21px;

    &::after {
      display: block;
      content: '...';
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }

  &--overflow & {
    &__text {
      display: block;
      max-height: 42px;
      overflow: hidden;
    }
  }

  &__tooltip {
  }
}
</style>
