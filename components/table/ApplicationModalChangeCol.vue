<template>
  <Modal
    class="ApplicationModalChangeCol"
    :title="col.title"
    :modal-open="opened"
    finance
    @close="close"
  >
    <BaseTextArea
      v-if="col.format === TableCellFormat.STRING"
      v-model="value"
    />

    <div class="ApplicationModalChangeCol__actions">
      <BaseButton @click="save">Сохранить изменения</BaseButton>
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
import BaseTextArea from '~/bash-frontend-kit/components/form/BaseTextArea.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import Modal from '~/bash-frontend-kit/components/global/Modal.vue';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';

const props = defineProps<{
  opened: boolean;
  col: {
    title: string;
    slug: number;
    format: TableCellFormat;
    value: any;
  };
}>();

const value = ref(props.col.value);

const emit = defineEmits<{
  (e: 'save', value: any): void;
  (e: 'close'): void;
}>();

function save() {
  emit('save', value.value);
}

function close() {
  emit('close');
}
</script>

<style lang="scss">
.ApplicationModalChangeCol {
  .Modal__content {
    overflow: auto;
  }

  &__actions {
    margin-top: auto;
    padding-top: 20px;
  }

  .BaseButton + .BaseButton {
    margin-top: 20px;
  }
}
</style>
