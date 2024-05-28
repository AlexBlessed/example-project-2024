<template>
  <div
    class="TimePeriodInput"
    :class="{'TimePeriodInput--spaced': spaced}"
  >
    <TimeInput
      class="TimePeriodInput__input"
      :model-value="start"
      :max="end"
      :placeholder="startPlaceholder ?? 'Начало'"
      :relative="relative"
      :convert-to-ms="convertToMs"
      :disabled="disabled"
      :validate-time="validateTime"
      v-bind="{ ...$attrs, ...startProps }"
      @update:modelValue="emit('update:start', $event)"
    />
    <TimeInput
      class="TimePeriodInput__input"
      :model-value="end"
      :min="start"
      :placeholder="endPlaceholder ?? 'Конец'"
      :relative="relative"
      :convert-to-ms="convertToMs"
      :disabled="disabled"
      :extra-option="extraEndOption"
      :validate-time="validateTime"
      v-bind="{ ...$attrs, ...endProps }"
      @update:modelValue="emit('update:end', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import TimeInput from '~/bash-frontend-kit/components/form/TimeInput.vue';

const props = defineProps<{
  start?: string | number;
  end?: string | number;
  startPlaceholder?: string;
  endPlaceholder?: string;
  startProps?: object;
  endProps?: object;
  relative?: boolean;
  convertToMs?: boolean;
  spaced?: boolean;
  disabled?: boolean;
  extraEndOption?: boolean;
  validateTime?: (value: number) => boolean;
}>();

const emit = defineEmits<{
  (e: 'update:start', time: string);
  (e: 'update:end', time: string);
}>();
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss">
.TimePeriodInput {
  display: flex;
  align-items: flex-start;

  &--spaced {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;

    @include mobile {
      grid-template-columns: 1fr;
      grid-gap: 20px;
    }
  }

  &__input {
  }

  &:not(&--spaced) & {
    &__input {
      width: 50%;

      &:first-child {
        margin-right: -1px;

        &:active,
        &:focus {
          .BaseSelect__body {
            z-index: 1;
          }
        }

        .BaseSelect__body {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }

      &:last-child {
        .BaseSelect__body {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }    }
  }

  &__separator {
    margin: 0 12px;
  }
}
</style>
