<template>
  <div
    v-if="actionsFiltered?.length"
    class="TableItemActions"
  >
    <div
      class="TableItemActions__trigger"
      @click="menuOpen"
    >
      <img
        src="@/bash-frontend-kit/icons/menu-vertical.svg"
        alt=""
      />
    </div>

    <template v-if="menuOpened">
      <client-only>
        <GeneralRowModal
         v-if="!$media.md"
         modal-open
         :actions="actionsFiltered"
         :action-statuses="actionStatuses"
         @close="menuClose"
         @action="emitAction"
        />
        <Teleport
         v-else
         to="#root-modals"
        >
          <GeneralRowMobileModal
           v-if="menuOpened"
           :actions="actionsFiltered"
           :action-statuses="actionStatuses"
           modal-open
           @close="menuClose"
           @action="emitAction"
          />
        </Teleport>
      </client-only>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {ActionTableItem} from '~/bash-frontend-kit/types/table/ActionTableItem';
import {TableRowAction} from '~/bash-frontend-kit/utils/data/_consts';
import GeneralRowModal from '~/bash-frontend-kit/components/table/GeneralRowModal.vue';
import GeneralRowMobileModal from '~/bash-frontend-kit/components/table/GeneralRowMobileModal.vue';
import {NormalizedRowActionStatuses} from '~/bash-frontend-kit/types/table/NormalizedTable';
import {computed} from '#imports';

const props = defineProps<{
  actions?: ActionTableItem[];
  actionStatuses?: NormalizedRowActionStatuses;
}>();

const emit = defineEmits<{
  (e: 'action', action: TableRowAction);
}>();

const menuOpened = ref(false);

function emitAction(event) {
  emit('action', event);
  menuClose();
}

const actionsFiltered = computed(
  () =>
    props.actions?.filter(
      ({ condition }) =>
        !condition || condition({ actionStatuses: props.actionStatuses })
    ) ?? []
);

function menuOpen() {
  menuOpened.value = true;
}

function menuClose() {
  menuOpened.value = false;
}
</script>

<style lang="scss">
.TableItemActions {
  position: relative;
  cursor: pointer;

  &__trigger {
    margin: 0 -10px 0 auto;
    padding: 0 10px;

    &:hover img {
      opacity: 0.5;
    }

    img {
      vertical-align: middle;
      transition: all $transition;
    }
  }
}
</style>
