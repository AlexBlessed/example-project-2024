<template>
  <TableCellWrap
    :format="format"
    :link="isLink && value?.href"
    :blank-link="value?.blank"
    public-link
    class="ActionTableCell"
  >
    <BaseButton
      v-if="value?.title"
      :remove="isLink || !isSecondary"
      :white="!isLink && isSecondary"
      :gray="isSecondary"
      @click="handle"
    >
      {{ value.title }}
    </BaseButton>
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import { computed } from '#imports';
import {
  StatusAction,
  StatusActionStyle,
  StatusActionType,
} from '~/bash-frontend-kit/types/models/StatusAction';

const props = defineProps<{
  value?: StatusAction;
  format?: TableCellFormat;
  slug?: string;
  link?: string;
}>();

const emit = defineEmits<{
  (e: 'change', value: StatusAction);
}>();

const isLink = computed(() => props.value?.type === StatusActionType.LINK);

const isSecondary = computed(
  () => props.value?.style === StatusActionStyle.SECONDARY
);

function handle() {
  if (props.value?.type === StatusActionType.MODAL) {
    emit('change', props.value);
  }
}
</script>

<style lang="scss">
.ActionTableCell {
  text-decoration: none;

  .BaseButton {
    width: 100%;
    white-space: nowrap;

    &__text {
      white-space: normal;
      line-height: 1;
    }

    &__content {
      padding: 0 24px;
    }

    &--white {
      .BaseButton__text {
        color: #a5aabe;
      }
    }
  }
}
</style>
