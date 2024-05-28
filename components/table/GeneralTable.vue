<template>
  <IfComponent
    :is="CustomScroll"
    :show="!noScroll"
    class="GeneralTable"
    :watch="table"
    @scroll="close"
  >
    <div class="GeneralTable__container">
      <GeneralTableContent
        ref="tableEl"
        :pending="pending"
        :table="table"
        :table-titles="tableTitles"
        :columns-sort="columnsSort"
        :actions="actions"
        :active-item="activeItem"
        :hide-actions="hideActions"
        :main="main"
        @update:columns-sort="$emit('update:columns-sort', $event)"
        @item-action="handleItemAction"
        @item-change="handleItemChange"
        @add="emit('add')"
        @remove-column="emit('remove-column', $event)"
      />
    </div>
  </IfComponent>

  <ConfirmDeleteModal
    v-if="deleteItem"
    modal-open
    @close="closeDelModal"
    @remove="removeAction"
  >
    Вы уверены, что хотите удалить {{ itemName ?? '' }}?
  </ConfirmDeleteModal>
</template>

<script lang="ts" setup>
import GeneralTableContent from '~/bash-frontend-kit/components/table/GeneralTableContent.vue';
import { TableRowAction } from '~/bash-frontend-kit/utils/data/_consts';
import { TableColumnSort } from '~/bash-frontend-kit/types/table/TableColumnsSettings';
import Column from '~/bash-frontend-kit/types/models/Column';
import { NormalizedRowActionStatuses, NormalizedTable } from '~/bash-frontend-kit/types/table/NormalizedTable';
import { ActionTableItem } from '~/bash-frontend-kit/types/table/ActionTableItem';
import IfComponent from '~/bash-frontend-kit/components/global/IfComponent.vue';
import ConfirmDeleteModal from '~/bash-frontend-kit/components/global/ConfirmDeleteModal.vue';
import CustomScroll from '~/bash-frontend-kit/components/global/CustomScroll.vue';

const props = defineProps<{
  tableTitles: Column[];
  table: NormalizedTable;
  columnsSort?: TableColumnSort;
  pending?: boolean;
  activeItem?: number;
  refresh: () => void;
  actions: ActionTableItem[];
  hideActions?: boolean;
  noScroll?: boolean;
  main?: boolean;
  itemName?: string;
}>();

const emit = defineEmits<{
  (
    e: 'item-action',
    action: {
      action: TableRowAction;
      id: number;
      actionStatuses: NormalizedRowActionStatuses;
    },
    refresh: typeof props.refresh
  );
  (
    e: 'item-change',
    action: {
      slug: string;
      value: any;
      id: number;
    },
    refresh: typeof props.refresh
  );
  (e: 'update:columns-sort', sort: TableColumnSort);
  (e: 'add');
  (e: 'remove-column', id: number);
}>();

const tableEl = ref(null);
const deleteItem = ref(null);

function handleItemAction(action: {
  action: TableRowAction;
  id: number;
  actionStatuses: NormalizedRowActionStatuses;
}) {
  if (action.action === TableRowAction.delete) {
    deleteItem.value = action;
  } else {
    emit('item-action', action, props.refresh);
  }
}

function removeAction() {
  emit('item-action', deleteItem.value, props.refresh);
}

function closeDelModal() {
  deleteItem.value = null;
}

function handleItemChange(data: { slug: string; value: any; id: number }) {
  emit('item-change', data, props.refresh);
}

function close() {
  tableEl.value.close();
}

defineExpose({ close });
</script>

<style lang="scss">
.GeneralTable {
  flex-grow: 1;
  flex-shrink: 0;
  overflow: auto;
  margin-left: 16px;
  //max-height: calc(100vh - 350px);

  @include mobile {
    margin-left: 0;
  }

  &__container {
    width: 100%;
    height: 100%;
    padding: 0 50px;

    @include mobile {
      width: 100%;
      padding: 0;
    }
  }
}
</style>
