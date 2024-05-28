<template>
  <div class="GeneralTableContent">
    <template v-if="pending || (table && table.length)">
      <GeneralTableTitles
        v-if="!pending || !firstPending"
        :titles="tableTitles"
        :columns-sort="columnsSort"
        @update:columns-sort="$emit('update:columns-sort', $event)"
        @remove-column="emit('remove-column', $event)"
      />
      <DataLoading
        v-if="pending"
        class="GeneralTableContent__loader"
      />
      <template v-else>
        <template v-if="!$media.md">
          <GeneralTableRow
            v-for="({ row, id, actionStatuses }, index) in table"
            ref="rows"
            :key="id"
            :class="{ 'GeneralTableRow--single': table.length === 1 }"
            :action-statuses="actionStatuses"
            :index="index"
            :row="row"
            :actions="actions"
            :hide-actions="hideActions"
            @action="emitAction($event, { id, actionStatuses })"
            @change="emitChange($event, id)"
          />
        </template>
        <template v-else>
          <GeneralTableMobileRow
            v-for="item in table"
            :id="item.id"
            :key="item.id"
            :info="item.mobileInfo"
            :titles="tableTitles"
            :row="item.row"
            :hide-actions="hideActions"
            @open-menu="openMobileMenu(item)"
            @action="
              emitAction($event, {
                id: item.id,
                actionStatuses: item.actionStatuses,
              })
            "
            @change="emitChange($event, item.id)"
          />
        </template>
      </template>
    </template>
    <AddNewLeadButton
      v-else
      :main="main"
      :active-item="activeItem"
      @add="$emit('add')"
    />
    <GeneralRowMobileModal
      v-if="!hideActions"
      :actions="actions"
      :action-statuses="activeActionsItem?.actionStatuses"
      :modal-open="activeActionsItem !== null"
      @close="closeMobileMenu"
      @action="emitAction($event, activeActionsItem)"
    />
  </div>
</template>

<script lang="ts" setup>
import GeneralTableRow from '~/bash-frontend-kit/components/table/GeneralTableRow.vue';
import GeneralTableTitles from '~/bash-frontend-kit/components/table/GeneralTableTitles.vue';
import GeneralTableMobileRow from '~/bash-frontend-kit/components/table/GeneralTableMobileRow.vue';
import GeneralRowMobileModal from '~/bash-frontend-kit/components/table/GeneralRowMobileModal.vue';
import { TableRowAction } from '~/bash-frontend-kit/utils/data/_consts';
import { TableColumnSort } from '~/bash-frontend-kit/types/table/TableColumnsSettings';
import {
  NormalizedRow,
  NormalizedRowActionStatuses,
  NormalizedTable,
} from '~/bash-frontend-kit/types/table/NormalizedTable';
import Column from '~/bash-frontend-kit/types/models/Column';
import DataLoading from '~/bash-frontend-kit/components/global/DataLoading.vue';
import AddNewLeadButton from '~/bash-frontend-kit/components/table/AddNewLeadButton.vue';
import { ActionTableItem } from '~/bash-frontend-kit/types/table/ActionTableItem';

const props = defineProps<{
  table: NormalizedTable;
  tableTitles: Column[];
  columnsSort?: TableColumnSort;
  pending?: boolean;
  activeItem?: number;
  actions: ActionTableItem[];
  hideActions?: boolean;
  main?: boolean;
}>();

const emit = defineEmits<{
  (
    e: 'item-action',
    action: {
      action: TableRowAction;
      id: number;
      actionStatuses: NormalizedRowActionStatuses;
    }
  );
  (
    e: 'item-change',
    action: {
      slug: string;
      value: any;
      id: number;
    }
  );
  (e: 'update:columns-sort', sort: TableColumnSort);
  (e: 'add');
  (e: 'remove-column', id: number);
}>();

const activeActionsItem = ref<NormalizedRow>(null);

const rows = ref([]);

const firstPending = ref(true);

const unwatch = watch(
  () => props.pending,
  () => {
    unwatch();
    firstPending.value = false;
  }
);

function emitAction(action, { id, actionStatuses }) {
  emit('item-action', { action, id, actionStatuses });
}

function emitChange({ slug, value }, id) {
  emit('item-change', { slug, value, id });
}

function openMobileMenu(row: NormalizedRow) {
  activeActionsItem.value = row;
}

function closeMobileMenu() {
  activeActionsItem.value = null;
}

function close() {
  rows.value.forEach((row) => row.close());
}

defineExpose({ close });
</script>

<style lang="scss">
.GeneralTableContent {
  position: relative;
  display: grid;
  grid-gap: 12px;
  align-items: flex-start;
  align-content: flex-start;

  padding-bottom: 40px;

  @include mobile {
    grid-gap: 0;
    margin-top: -25px;
  }

  &__loader {
    width: calc(100vw - 110px - var(--main-nav-panel-width));

    @include mobile {
      width: 100vw;
    }
  }

  .GeneralTableRow {
    &:nth-child(2) {
      .IconTableCell__tooltip {
        top: calc(100% + 8px);
        bottom: unset;

        &::before {
          bottom: 98%;
          top: unset;
          transform: rotate(180deg);
        }
      }
    }
  }

  .GeneralTableRow {
    &:nth-child(2) {
      .PopUpModal {
        bottom: unset;
        top: -30px;
      }
    }

    &:last-child:not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4)) {
      .PopUpModal {
        top: unset;
        bottom: -20px;
      }
    }
  }
}
</style>
