<template>
  <Modal
    class="DropSessionHistoryModal"
    :modal-open="open"
    @close="close"
  >
    <div class="DropSessionHistoryModal__content">
      Вы уверены, что хотите<br />завершить все сеансы?
    </div>
    <div class="DropSessionHistoryModal__actions">
      <BaseButton
        remove
        @click="confirm"
      >
        Завершить
      </BaseButton>
      <BaseButton
        white
        @click="close"
      >
        Отмена
      </BaseButton>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/bash-frontend-kit/components/global/Modal.vue';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';

defineProps({
  open: Boolean,
});

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'close'): void;
}>();

function confirm() {
  emit('confirm');
}

function close() {
  emit('close');
}
</script>

<style lang="scss">
.DropSessionHistoryModal {
  &__content {
    text-align: center;
    max-width: 360px;
    margin-bottom: 40px;
  }

  &__actions {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 10px;

    @include mobile {
      grid-template-columns: 1fr;
    }
  }
}
</style>
