import { defineStore } from 'pinia';
import { Funnel } from '~/bash-frontend-kit/types/models/Funnel';
import { ColumnType } from '~/bash-frontend-kit/types/models/ColumnType';
import useStoreActionEdit from '~/bash-frontend-kit/composables/store/useStoreActionEdit';
import useStoreActionRemove from '~/bash-frontend-kit/composables/store/useStoreActionRemove';
import useStoreActionAdd from '~/bash-frontend-kit/composables/store/useStoreActionAdd';
import useStoreActionFetch from '~/bash-frontend-kit/composables/store/useStoreActionFetch';
import { useCustomColumnsStore } from '~/bash-frontend-kit/store/substore/customColumns';
import { useFunnelStatusStore } from '~/bash-frontend-kit/store/substore/funnelStatus';
import { TableColumnsSettings } from '~/bash-frontend-kit/types/table/TableColumnsSettings';
import {
  FilterMeta,
  FilterMetaOption,
} from '~/bash-frontend-kit/types/models/Filter';
import Column from '~/bash-frontend-kit/types/models/Column';
import { createInputOptionFromStatusFunnel } from '~/bash-frontend-kit/utils/data/convert/createInputOptionFromStatusFunnel';
import { createInputOptionFromFunnel } from '~/bash-frontend-kit/utils/data/convert/createInputOptionFromFunnel';

export const useFunnelsStore = defineStore('funnels', () => {
  const funnels = ref<Funnel[]>([]);
  const filtersMeta = ref<FilterMeta[]>([]);
  const funnelActiveId = ref<number>();

  const funnelsOptions = computed(() => {
    return funnels.value
      ?.filter((funnel) => !funnel.is_union)
      ?.map(createInputOptionFromFunnel);
  });

  const funnelsReal = computed(() => {
    return funnels.value?.filter(({ is_union }) => !is_union);
  });

  const funnelActive = computed(() => {
    return funnels.value?.find((funnel) => funnel.id === funnelActiveId.value);
  });

  function getFunnel(id: number) {
    return computed((): Funnel => {
      return funnels.value.find((item) => item.id === id);
    });
  }

  function setFunnels(funnelsList: Funnel[]) {
    funnels.value = funnelsList;
  }

  function setFunnelActive(funnel: Funnel, archive?: boolean) {
    funnelActiveId.value = funnel.id;
  }

  const [fetchFunnels, fetchFunnelsIfEmpty] = useStoreActionFetch<
    ResponseFunnels,
    { archive?: boolean; reals?: boolean }
  >(
    '/funnels',
    (data, { archive, reals } = {}) => {
      funnels.value = data.funnels;
      columnsStore.setColumnsSettings(data.columns);
      columnsStore.setColumnsInfo(data.columns_info);
      filtersMeta.value = data.filters;
      if (!funnelActive.value) {
        const active = funnels.value.find((funnel) => !funnel.is_union);
        setFunnelActive(active, archive);
      }
    },
    null,
    () => !funnels.value.length
  );
  const addFunnel = useStoreActionAdd('/funnels/create', funnels);

  const editFunnel = useStoreActionEdit<Funnel, object>(
    (id) => `/funnels/${id}/save`,
    funnels
  );

  const removeFunnel = useStoreActionRemove('/funnels/delete', funnels);

  const changeActiveFunnel = useStoreActionEdit<Funnel, boolean>(
    (id) => `/funnels/${id}/set/active`,
    funnels,
    (is_active) => ({ is_active })
  );

  const statusesOptions = computed<FilterMetaOption<number>[]>(() => {
    const statuses = funnelActive.value?.statuses ?? [];
    return statuses.map(createInputOptionFromStatusFunnel);
  });

  const statusStore = useFunnelStatusStore({
    funnels,
    getFunnel,
    fetchFunnels,
  });

  const columnsStore = useCustomColumnsStore('leads');

  return {
    ...columnsStore,
    ...statusStore,

    funnelActive,
    funnels,
    funnelsOptions,
    funnelsReal,
    filtersMeta,
    statusesOptions,

    getFunnel,
    setFunnelActive,
    setFunnels,
    fetchFunnels,
    fetchFunnelsIfEmpty,
    addFunnel,
    editFunnel,
    removeFunnel,
    changeActiveFunnel,
  };
});

export interface ResponseFunnels {
  column_types: ColumnType[];
  funnels: Funnel[];
  columns: TableColumnsSettings;
  columns_info: Column[];
  filters: FilterMeta[];
}
