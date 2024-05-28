<template>
  <div class="TableContractor">
    <div class="TableContractor__table">
      <GeneralTable
        v-model:columns-sort="columnsSort"
        :pending="pending"
        :table="table"
        :table-titles="tableTitles"
        :actions="actionsList"
        :refresh="refresh"
        item-name="рекламу"
        @update:columns-sort="$emit('update:columns-sort', $event)"
        @item-action="handleAction"
        @add="addAdvertisement"
      />
    </div>
    <div class="container">
      <BasePagination
        v-model="page"
        :meta="meta"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  URLDataWithParams,
  useHttp,
} from '~/bash-frontend-kit/composables/useHttp';
import GeneralTable from '~/bash-frontend-kit/components/table/GeneralTable.vue';
import { useHttpPagination } from '~/bash-frontend-kit/composables/useHttpPagination';
import { TableColumnSort } from '~/bash-frontend-kit/types/table/TableColumnsSettings';
import BasePagination from '~/bash-frontend-kit/components/global/BasePagination.vue';
import { NormalizedRow } from '~/bash-frontend-kit/types/table/NormalizedTable';
import { factoryColumn } from '~/bash-frontend-kit/utils/data/factory/factoryColumn';
import { ActionTableItem } from '~/bash-frontend-kit/types/table/ActionTableItem';
import { TableRowAction } from '~/bash-frontend-kit/utils/data/_consts';
import DeleteIcon from '~/bash-frontend-kit/icons/delete-accent.svg';
import EditIcon from '~/bash-frontend-kit/icons/edit-accent.svg';
import CopyIcon from '~/bash-frontend-kit/icons/copy.svg';
import { useNotify } from '~/bash-frontend-kit/composables/notify/useNotify';
import { Contractor } from '~/types/models/Contractor';
import { useRouter } from '#imports';

const router = useRouter();
const http = useHttp();

const columnsSort = ref<TableColumnSort>({});

const fetchListUrl = computed<URLDataWithParams>(() => {
  return {
    url: '/contractor',
    params: {
      sort: columnsSort.value,
    },
  };
});

const {
  data: contractors,
  page,
  meta,
  pending,
  next,
  change,
  refresh,
  stream,
} = useHttpPagination<Contractor>(fetchListUrl.value);
await stream;

await stream;

watch(fetchListUrl, (url) => change(url), { deep: true });

const { columns: tableTitles } = await http.get('/contractor/table/info');

const table = computed((): NormalizedRow[] =>
  contractors.value.map((item) => {
    return {
      id: item.id,
      actionStatuses: {
        isCanCopy: item.is_can_copy,
        isCanDelete: item.is_can_delete,
        isCanEdit: item.is_can_edit,
      },
      row: tableTitles.map(({ id, slug, format }) =>
        factoryColumn(
          id,
          item[slug],
          format,
          slug,
          slug === 'entity' && item.entity_type
        )
      ),
      mobileInfo: {
        slugs: [],
        permanentOpen: true,
      },
    };
  })
);

const actionsList: ActionTableItem[] = [
  {
    icon: EditIcon,
    name: 'Редактировать',
    type: TableRowAction.edit,
    condition: ({ actionStatuses: { isCanEdit } }) => isCanEdit,
  },
  {
    icon: CopyIcon,
    name: 'Копировать',
    type: TableRowAction.copy,
    condition: ({ actionStatuses: { isCanCopy } }) => isCanCopy,
  },
  {
    icon: DeleteIcon,
    name: 'Удалить',
    type: TableRowAction.delete,
    condition: ({ actionStatuses: { isCanDelete } }) => isCanDelete,
  },
];

const notify = useNotify();

async function handleAction({ action, id }) {
  if (action === TableRowAction.edit) {
    await router.push(`/advertisement/events/wizard?id=${id}`);
  } else if (action === TableRowAction.delete) {
    await http.delete(`/contractor/${id}/delete`);
    notify.notifySuccess({
      title: 'Удаленно',
    });
    await refresh();
  } else if (action === TableRowAction.copy) {
    await http.post(`/contractor/${id}/copy`);
    notify.notifySuccess({
      title: 'Скопировано',
    });
    await refresh();
  }
}

function addAdvertisement() {
  router.push('/advertisement/events/wizard');
}
</script>

<style lang="scss">
.TableContractor {
}
</style>
