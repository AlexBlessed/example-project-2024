<template>
  <PopUpModal
    class="SitesRowModal__popup"
    left-center
    :modal-open="modalOpen"
    @close="close"
  >
    <div class="SitesRowModal">
      <div
        v-for="{ name, icon, type, tariff } in actions"
        :key="type"
        class="SitesRowModal__item"
        :class="{
          'SitesRowModal__item--disabled':
            tariff && !checkUserTariffPriority(tariff),
          'SitesRowModal__item--pending':
            type === TableRowAction.download && actionStatuses.downloading,
        }"
        @click="emitAction(type, tariff)"
      >
        <DataLoading
          v-if="type === TableRowAction.download && actionStatuses.downloading"
          compact
          small
        />
        <img
          v-else
          :src="icon"
          alt="action"
        />
        <div class="SitesRowModal__text">{{ name }}</div>
        <PaywallTooltip
          v-if="tariff"
          :tariff-priority="tariff"
        />
      </div>
    </div>
  </PopUpModal>
</template>

<script lang="ts" setup>
import PopUpModal from '~/bash-frontend-kit/components/global/PopUpModal.vue';
import PaywallTooltip from '~/bash-frontend-kit/components/global/PaywallTooltip.vue';
import { TableRowAction } from '~/bash-frontend-kit/utils/data/_consts';
import { ActionTableItem } from '~/bash-frontend-kit/types/table/ActionTableItem';
import { checkUserTariffPriority } from '~/bash-frontend-kit/utils/tariff/checkUserTariffPriority';
import { TariffPriority } from '~/bash-frontend-kit/types/models/Tariff';
import { NormalizedRowActionStatuses } from '~/bash-frontend-kit/types/table/NormalizedTable';
import DataLoading from '~/bash-frontend-kit/components/global/DataLoading.vue';

defineProps<{
  modalOpen: boolean;
  actions: ActionTableItem[];
  actionStatuses?: NormalizedRowActionStatuses;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'action', action: TableRowAction);
}>();

function close() {
  emit('close');
}

function emitAction(action: TableRowAction, tariff?: TariffPriority) {
  if (!tariff || checkUserTariffPriority(tariff)) {
    emit('action', action);
    close();
  }
}
</script>

<style lang="scss">
.SitesRowModal {
  width: 285px;

  &__popup {
    overflow: visible;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    background: #ffffff;
    border-radius: 13px;
    cursor: pointer;

    > img {
      width: 20px;
      height: 20px;
      object-fit: none;
    }

    &--disabled {
      pointer-events: none;

      > *:not(.PaywallTooltip) {
        opacity: 0.5;
      }
    }

    &--pending {
      pointer-events: none;
    }

    &:hover {
      background: #f9fafc;
    }
  }

  &__text {
    margin-left: 8px;
  }
}
</style>
