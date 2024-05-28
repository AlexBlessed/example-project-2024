<template>
  <div
    v-if="modalOpen"
    class="GeneralRowMobileModal"
    @click.self="closeModal"
  >
    <div class="GeneralRowMobileModal__content">
      <div class="GeneralRowMobileModal__line" />
      <div
        v-for="(item, i) in actionsFiltred"
        :key="i"
        class="GeneralRowMobileModal__item"
        :class="{
          'GeneralRowMobileModal__item--disabled':
            item.tariff && !checkUserTariffPriority(item.tariff),
        }"
        @click="emitAction(item.type, item.tariff)"
      >
        <img
          class="GeneralRowMobileModal__icon"
          :src="item.icon"
          alt=""
        />
        <div class="GeneralRowMobileModal__text">{{ item.name }}</div>
        <PaywallTooltip
          v-if="item.tariff"
          :tariff-priority="item.tariff"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useScrollBlock } from '~/bash-frontend-kit/composables/useScrollBlock';
import { TableRowAction } from '~/bash-frontend-kit/utils/data/_consts';
import { ActionTableItem } from '~/bash-frontend-kit/types/table/ActionTableItem';
import { NormalizedRowActionStatuses } from '~/bash-frontend-kit/types/table/NormalizedTable';
import PaywallTooltip from '~/bash-frontend-kit/components/global/PaywallTooltip.vue';
import { checkUserTariffPriority } from '~/bash-frontend-kit/utils/tariff/checkUserTariffPriority';
import { TariffPriority } from '~/bash-frontend-kit/types/models/Tariff';

//TODO: Wrap in PopUpModal.vue if mobile
const props = defineProps<{
  modalOpen: boolean;
  actions: ActionTableItem[];
  actionStatuses?: NormalizedRowActionStatuses;
}>();

const emit = defineEmits<{
  (e: 'action', value: TableRowAction): void;
  (e: 'close');
}>();

const actionsFiltred = computed(() =>
  props.actions.filter(
    ({ condition }) =>
      !condition || condition({ actionStatuses: props.actionStatuses })
  )
);

function emitAction(action: TableRowAction, tariff?: TariffPriority) {
  if (!tariff || checkUserTariffPriority(tariff)) {
    emit('action', action);
    closeModal();
  }
}

function closeModal() {
  emit('close');
}

useScrollBlock(computed(() => props.modalOpen));
</script>

<style lang="scss">
.GeneralRowMobileModal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-index-full-screen);

  display: flex;
  justify-content: center;
  align-items: flex-end;
  background: var(--full-darkening);

  &__content {
    position: relative;
    padding: 42px 30px 30px 30px;
    background: #ffffff;
    border-radius: 20px 20px 0 0;
    width: 100%;
  }

  &__line {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);

    width: 100px;
    height: 4px;
    background: var(--border-light-color);
    border-radius: 10px;
  }

  &__item {
    display: flex;
    align-items: center;

    cursor: pointer;

    & + & {
      margin-top: 20px;
    }

    &--disabled {
      > *:not(.PaywallTooltip) {
        opacity: 0.5;
      }
    }
  }

  &__icon {
    margin-right: 10px;
  }
}
</style>
