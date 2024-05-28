<template>
  <TableCellWrap
    :format="format"
    :link="link"
    class="TextTableCell"
    :class="[
      { 'TextTableCell--overflow': isOverflowText },
      `TextTableCell__slug--${slug}`,
    ]"
    :stretch="isEditable"
  >
    <Contenteditable
      v-if="isEditable"
      v-model="model"
      class="TextTableCell__text"
      @blur="scrollToTop"
    />

    <div
      v-else
      class="TextTableCell__text"
    >
      {{ value }}
    </div>
    <Tooltip
      v-if="isOverflowText"
      class="TextTableCell__tooltip"
      large
    >
      <span v-html="value" />
    </Tooltip>
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';

import { getTableCellSize } from '~/bash-frontend-kit/utils/table/getTableCellSize';
import Tooltip from '~/bash-frontend-kit/components/global/Tooltip.vue';
import { computed } from '#imports';
import Contenteditable from '~/bash-frontend-kit/components/global/Contenteditable.vue';

const props = defineProps<{
  value?: string | number;
  format?: TableCellFormat;
  slug?: string;
  link?: string;
  options?: any;
  editable?: boolean;
}>();

const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();

const isEditable = computed(() => props.editable);
const maxLen = computed(() => (getTableCellSize(props.format) / 10) * 2);

const linesCount = computed(() => {
  //Всегда заканчивается на /n даже если нет переноса
  return props.value
    ?.toString()
    ?.trimEnd()
    ?.split(/\n|<br>/)?.length;
});

const isOverflowText = computed(() => {
  return maxLen.value < props.value?.toString()?.length || linesCount.value > 2;
});

const model = computed({
  get() {
    return props.value;
  },
  set(val) {
    emit('change', val);
  },
});

function scrollToTop(e) {
  e.target.scrollTop = 0;
}
</script>

<style lang="scss">
.GeneralTableRow:nth-child(2) .TextTableCell {
  &__tooltip {
    bottom: unset;
    top: 100%;

    &::before {
      top: unset;
      bottom: 100%;
      transform: scale(1, -1);
    }
  }
}

.TextTableCell {
  word-break: break-word;

  &:not(:focus):hover &__tooltip {
    display: block;
  }

  &__text {
    display: inline-flex;
    align-items: center;
    width: 100%;
    line-height: 23px;
    padding: 0 10px;
    min-height: 100%;
    margin: -1px -11px;
    outline: none;
    white-space: pre-wrap;
    border: 1px solid transparent;
    overflow: hidden;

    &:not(:focus) {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &.Contenteditable {
      &:focus {
        overflow: auto;
      }
    }

    &:empty {
      &:not(:focus)::after {
        content: '–';
      }
    }
  }

  &__text:focus ~ * {
    display: none !important;
  }

  &--overflow:not(:focus-within) {
    position: relative;
  }

  &--overflow & {
    &__text {
      max-height: 23px * 2 + 2px;
      align-items: flex-start;
    }
  }

  &__tooltip {
    margin-top: 14px;
  }
}
</style>
