<template>
  <PopUpModal
    kanban
    :modal-open="modalOpen"
    @close="$emit('close')"
  >
    <div class="ColorTableModal">
      <BaseInput
        v-model="searchValue"
        placeholder="Поиск"
        gray-placeholder
        blue
      />
      <div class="ColorTableModal__list">
        <div
          v-for="{ value, text, color, description } in filteredList"
          :key="value"
          class="ColorTableModal__item"
          @click="$emit('select', value)"
        >
          <div
            v-if="color || description"
            class="ColorTableModal__color"
            :style="{ background: color ?? description }"
          />
          <div class="ColorTableModal__name">{{ text }}</div>
        </div>
      </div>
    </div>
  </PopUpModal>
</template>

<script lang="ts" setup>
import PopUpModal from '~/bash-frontend-kit/components/global/PopUpModal.vue';
import { FilterMetaOption } from '~/bash-frontend-kit/types/models/Filter';
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import { computed, ref } from '#imports';

const props = defineProps<{
  modalOpen: boolean;
  options: FilterMetaOption<number>[];
}>();

const searchValue = ref();

const filteredList = computed(() => {
  if (!searchValue.value) return props.options;
  else {
    return props.options.filter((el) => {
      return el.text.toLowerCase().includes(searchValue.value.toLowerCase());
    });
  }
});

const emit = defineEmits<{
  (e: 'select', id: number);
  (e: 'close');
}>();
</script>

<style lang="scss">
.ColorTableModal {
  max-height: 320px;
  min-width: 214px;
  overflow: scroll;
  padding-right: 25px;

  @include mobile {
    max-height: 350px;
  }

  &__list {
    padding-left: 5px;
    margin-top: 15px;
  }

  &__item {
    display: flex;
    align-items: center;
    cursor: pointer;

    & + & {
      margin-top: 15px;
    }
  }

  &__color {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 10px;
    flex-shrink: 0;
  }

  &__name {
    white-space: nowrap;

    &:hover {
      color: black;
    }
  }
}
</style>
