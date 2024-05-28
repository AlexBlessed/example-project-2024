<template>
  <div
    v-long-press="longPress"
    class="GeneralTableRow"
    :class="{
      'GeneralTableRow--pressed': rowMenu,
    }"
  >
    <div
      v-if="!hideActions && actionsFiltered?.length"
      class="GeneralTableRow__menu"
      @click="rowMenuOpen"
    >
      <img
        src="@/bash-frontend-kit/icons/row-menu.svg"
        alt=""
      />
    </div>
    <div class="GeneralTableRow__container">
      <Component
        :is="getComponentCell(format, slug)"
        v-for="{
          format,
          value,
          columnId,
          options,
          slug,
          typeable,
          link,
          editable,
        } in row"
        :key="columnId"
        :slug="slug"
        :typeable="typeable"
        :value="value"
        :format="format"
        :options="options"
        :editable="editable"
        :link="link"
        class="GeneralTableRow__item"
        @change="changeCell(slug, $event, format)"
      />
    </div>
    <GeneralRowModal
      v-if="!hideActions && actionsFiltered?.length"
      :modal-open="rowMenu"
      :actions="actionsFiltered"
      :action-statuses="actionStatuses"
      @close="rowMenuClose"
      @action="emit('action', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import GeneralRowModal from '~/bash-frontend-kit/components/table/GeneralRowModal.vue';
import { TableRowAction } from '~/bash-frontend-kit/utils/data/_consts';
import {
  NormalizedRowActionStatuses,
  NormalizedTableCell,
} from '~/bash-frontend-kit/types/table/NormalizedTable';
import { ActionTableItem } from '~/bash-frontend-kit/types/table/ActionTableItem';
import { takeComponentTableCell } from '~/bash-frontend-kit/utils/table/tableCellFormatToComponentMap';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';

const props = defineProps<{
  row: NormalizedTableCell[];
  index: number;
  actionStatuses?: NormalizedRowActionStatuses;
  actions: ActionTableItem[];
  hideActions?: boolean;
}>();

const emit = defineEmits<{
  (e: 'action', action: TableRowAction);
  (e: 'change', action: { slug: string; value: any });
}>();

const actionsFiltered = computed(() =>
  props.actions.filter(
    ({ condition }) =>
      !condition || condition({ actionStatuses: props.actionStatuses })
  )
);

function longPress() {
  rowMenuOpen();
  try {
    navigator.vibrate(35);
  } catch (e) {}
}

const rowMenu = ref(false);

function rowMenuOpen() {
  rowMenu.value = true;
}

function rowMenuClose() {
  rowMenu.value = false;
}

function close() {
  rowMenuClose();
}

function changeCell(slug, value, format) {
  if (format === TableCellFormat.ACTION) {
    emit('action', TableRowAction.action);
  } else {
    emit('change', { slug, value });
  }
}

function getComponentCell(format, slug) {
  if (slug === 'funnel') {
    return takeComponentTableCell(TableCellFormat.COLOR_OBJECT);
  }
  return takeComponentTableCell(format);
}
defineExpose({ close });
</script>

<style lang="scss">
.GeneralTableRow {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -42px;
    top: 0;
    width: 42px;
    height: 100%;
    background: none;
    border-radius: 13px 0 0 13px;
  }

  &:hover {
    background: #f9fafc;
    border-radius: 0 13px 13px 0;

    .TagsItem__more-tags--modal {
      .TagsItem__tag {
        background: #f9fafc;
      }
    }

    .TagsItem__tag {
      background: #ffffff;
    }

    &::before {
      content: '';
      position: absolute;
      left: -14px;
      top: 0;
      width: 14px;
      height: 100%;
      background: #f9fafc;
      border-radius: 13px 0 0 13px;
    }
  }

  &__menu {
    display: flex;
    position: absolute;
    top: 50%;
    transform: translateY(-50%) scale(-1);
    left: -42px;
    padding: 14px;
    cursor: pointer;
  }

  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    transition: transform $transition;
    transform-origin: left center;
    min-height: 70px;
  }

  @include mobile {
    &--pressed &__container {
      transform: scale(0.9);
      z-index: 2;
    }
  }

  &__item {
    & + & {
      margin-left: 38px;
    }
  }
}
</style>
