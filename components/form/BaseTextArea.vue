<template>
  <div class="BaseTextArea">
    <BaseLabel
      :value="modelValue"
      :label="label ?? placeholder"
    >
      <div class="BaseTextArea__body">
        <textarea
          v-model="model"
          :placeholder="placeholderStr"
          :style="{ 'min-height': minHeight && `${minHeight}px` }"
          :rows="rows"
          class="BaseTextArea__textarea"
          :class="{
            'BaseTextArea__textarea--error': error,
          }"
        />
        <BaseTooltip
          v-if="tooltip || $slots.tooltip"
          class="BaseTextArea__tooltip"
          :tooltip="tooltip"
        >
          <slot name="tooltip" />
        </BaseTooltip>
      </div>
      <InputError
        class="BaseInput__error"
        :error="error"
      />
    </BaseLabel>
  </div>
</template>

<script lang="ts" setup>
import BaseLabel from '~/bash-frontend-kit/components/form/BaseLabel.vue';

import InputError from '~/bash-frontend-kit/components/form/sub-elements/InputError.vue';
import BaseTooltip from '~/bash-frontend-kit/components/form/BaseTooltip.vue';
import { computed } from '#imports';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: [String, null],
    default: null,
  },
  placeholder: {
    type: String,
    default: 'Введите текст…',
  },
  error: {
    type: [String, Array],
    default: '',
  },
  minHeight: Number,
  rows: Number,
  tooltip: String,
  required: Boolean,
  disabled: Boolean,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const model = computed({
  get: (): string => props.modelValue,
  set: (e: string) => emit('update:modelValue', e),
});

const placeholderStr = computed(() =>
  props.required && props.placeholder && !props.disabled
    ? `${props.placeholder} *`
    : props.placeholder
);
</script>

<style lang="scss">
.BaseTextArea {
  min-width: 0;

  &__textarea {
    display: block;
    border: 1px solid var(--border-light-color);
    border-radius: 5px;
    min-height: 120px;
    min-width: 100%;
    max-width: 100%;
    padding: 13px 16px;

    &--error {
      border-color: #ff5101;
    }

    &::placeholder {
      color: var(--text);
    }

    &:not(:read-only) {
      &:focus,
      &:active {
        border: 1px solid #ff7739 !important;
      }
    }
  }

  &:focus-within textarea::placeholder {
    color: transparent;
  }

  &__tip {
    position: absolute;
    top: 11px;
    right: 13px;
    cursor: pointer;

    @include mobile {
      display: none;
    }

    &:hover {
      .BaseTextArea__tip--modal {
        display: block;
      }
    }

    &--modal {
      position: absolute;
      top: calc(-200% - 10px);
      right: -12px;

      display: none;
      background: #ffffff;
      box-shadow: 5px 0 44px rgba(228, 228, 234, 0.33);
      border-radius: 15px;
      padding: 20px 16px;

      width: 280px;
    }
  }

  &__body {
    position: relative;
  }

  &__tooltip {
    position: absolute;
    top: 15px;
    right: 13px;
  }
}
</style>
