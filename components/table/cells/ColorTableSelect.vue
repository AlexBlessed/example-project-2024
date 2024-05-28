<template>
  <div
    class="ColorTableSelect"
    :class="{ 'ColorTableSelect--disabled': !options?.length }"
  >
    <div
      class="ColorTableSelect__body"
      @click="openModal"
    >
      <div
        v-if="activeItem?.color || activeItem?.description"
        class="ColorTableSelect__color"
        :style="{ background: activeItem?.color ?? activeItem?.description }"
      />
      <div
        class="ColorTableSelect__name"
        :class="{ 'ColorTableSelect__name--dropdown-opened': modalOpen }"
      >
        {{ activeItem?.text ?? activeItem?.title ?? activeItem?.value ?? '–' }}
      </div>
    </div>
    <ColorTableModal
      v-if="options?.length"
      :modal-open="modalOpen"
      :options="options"
      @select="selectActive"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from '#imports';
import ColorTableModal from '~/bash-frontend-kit/components/table/cells/ColorTableModal.vue';
import { StatusLead } from '~/bash-frontend-kit/types/models/Lead';
import { FilterMetaOption } from '~/bash-frontend-kit/types/models/Filter';
import { InputOption } from '~/bash-frontend-kit/types/form/InputOption';

const props = defineProps<{
  modelValue?: StatusLead | InputOption | number;
  options?: FilterMetaOption<number>[];
}>();

const emit = defineEmits<{
  (e: 'update:model-value', value: number);
}>();

const modalOpen = ref(false);

const activeItem = computed(() => {
  if (props.modelValue != null) {
    if (props.modelValue?.value ?? props.modelValue?.id) {
      return props.modelValue;
    } else {
      return props.options.find(({ value }) => props.modelValue === value);
    }
  }
});

function openModal() {
  if (props.options) {
    modalOpen.value = true;
  }
}

function closeModal() {
  modalOpen.value = false;
}

function selectActive(value) {
  emit('update:model-value', value);
  closeModal();
}
</script>

<style lang="scss">
.ColorTableSelect {
  position: relative;

  &--disabled & {
    &__body {
      cursor: default;
    }
    &__name::after {
      display: none;
    }
  }

  &__body {
    display: flex;
    align-items: center;

    cursor: pointer;
  }

  &__color {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 10px;
    flex-shrink: 0;
  }

  &__name {
    //white-space: nowrap;
    line-height: 1;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      right: -16px;
      top: 50%;
      width: 8px;
      height: 5px;
      transform: translateY(-50%);

      background-image: url('../../../icons/arrow-hide.svg');
      background-repeat: no-repeat;

      transition: transform $transition;
    }

    &--dropdown-opened:after {
      transform: rotate(180deg) translateY(50%) !important;
    }
  }

  .PopUpModal {
    padding: 25px 0 25px 40px;
  }
}
</style>
