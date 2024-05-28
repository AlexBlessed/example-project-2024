import { defineStore } from 'pinia';
import Emitter from '~/bash-frontend-kit/libs/emitter/Emitter';
import { Tariff, TariffPayPeriod } from '~/bash-frontend-kit/types/models/Tariff';
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';
import { useNotify } from '~/bash-frontend-kit/composables/notify/useNotify';

export enum TariffsEvents {
  showTariffsModal = 'showTariffsModal',
}

export const useTariffsStore = defineStore('tariffs', () => {
  const http = useHttp();
  const notify = useNotify();

  const tariffsPending = ref(false);
  const tariffs = ref<Tariff[]>([]);
  const tariffsPaysPeriods = ref<TariffPayPeriod[]>([]);

  const emitter = new Emitter();

  async function fetchTariffs(force = false) {
    if (!force && (tariffs.value?.length || tariffsPending.value)) {
      return;
    }

    tariffsPending.value = true;

    try {
      const { data, pays } = await http.get<{ data: Tariff[], pays: TariffPayPeriod[] }>('/tariffing');
      tariffs.value = data;
      tariffsPaysPeriods.value = pays;
    } catch (e) {
      notify.notifyError({
        title: 'Ошибка сервера',
        message: e.toString()
      });
    } finally {
      tariffsPending.value = false;
    }
  }

  function openTariffsModal() {
    emitter.emit(TariffsEvents.showTariffsModal);
  }

  return {
    tariffs,
    tariffsPaysPeriods,
    tariffsPending,
    emitter,
    openTariffsModal,
    fetchTariffs
  };
});
