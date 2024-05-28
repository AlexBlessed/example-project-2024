<template>
  <div class="DatePickerInput">
    <BaseLabel
      :label="label ?? placeholder"
      :value="notEmpty"
    >
      <div
        class="DatePickerInput__input"
        :class="{'DatePickerInput__input--error': error?.length}"
        @click="toggle"
      >
        <div
          v-if="notEmpty"
          class="DatePickerInput__value"
        >
          {{ valueStr }}
        </div>
        <div
          v-else
          class="DatePickerInput__placeholder"
        >
          {{ placeholderStr ?? (isPeriod ? 'Выберите даты' : 'Выберите дату') }}
        </div>
        <div class="DatePickerInput__icon">
          <img
            src="@/bash-frontend-kit/icons/calendar.svg"
            alt=""
          />
        </div>
      </div>
    </BaseLabel>
    <div
      v-if="error"
      class="DatePickerInput__error"
    >
      <InputError :error="error" />
    </div>
    <div
      v-show="opened"
      v-click-outside="close"
      class="DatePickerInput__picker"
    >
      <img
        class="DatePickerInput__close"
        src="@/bash-frontend-kit/icons/close.svg"
        alt=""
        @click="close"
      >
      <slot :period="period">
<!--        <div
          class="DatePickerInput__input"
          @click="close"
        >
          <div
            v-if="notEmpty"
            class="DatePickerInput__value"
          >
            {{ label }}
          </div>
        </div>-->
        <slot :period="period">
          <DatePickerCalendar
            :date="dateNormalize"
            :period="period"
            :is-period="isPeriod"
            :from-now="fromNow"
            v-bind="$attrs"
            @change="onChange"
            @update:date="$emit('update:modelValue', $event)"
          />
        </slot>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import DatePickerCalendar from '~/bash-frontend-kit/components/global/date-picker/DatePickerCalendar.vue';
import { useToggle } from '~/bash-frontend-kit/composables/form/useToggle';
import { dateTime, DateTime } from '~/bash-frontend-kit/libs/date-time/dateTime';
import { DateTimePeriod } from '~/bash-frontend-kit/libs/date-time/dateTimePeriod';
import { computed, watch } from '#imports';
import InputError from '~/bash-frontend-kit/components/form/sub-elements/InputError.vue';
import BaseLabel from '~/bash-frontend-kit/components/form/BaseLabel.vue';

const props = defineProps<{
  modelValue?: DateTime;
  period?: DateTimePeriod;
  isPeriod?: boolean;
  placeholder?: string;
  getLabel?: (date: DateTime | DateTimePeriod) => string;
  label?: string;
  error?: string | string[];
  required?: boolean;
  fromNow?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value?: DateTime): void;
}>();

const [opened, toggle, close] = useToggle();

const dateNormalize = computed(() => {
  if (typeof props.modelValue === 'number') {
    return dateTime(props.modelValue);
  }

  return props.modelValue ?? dateTime();
});

const placeholderStr = computed(() =>
  props.required ? `${props.placeholder} *` : props.placeholder
);

const notEmpty = computed(() => {
  if (props.isPeriod) {
    return props.period.start.notEmpty || props.period.end.notEmpty;
  } else {
    return dateNormalize.value.notEmpty;
  }
});

const valueStr = computed(() => {
  if (props.getLabel) {
    return props.getLabel(props.isPeriod ? props.period : dateNormalize.value);
  }

  if (props.isPeriod) {
    return props.period.toCalendarString();
  } else {
    return dateNormalize.value.toCalendarString();
  }
});

if (props.isPeriod) {
  watch(
    () => props.period,
    (period) => period?.isFullPeriod && close()
  );
} else {
  watch(
    () => props.modelValue,
    (date) => date?.notEmpty && close()
  );
}

function onChange() {}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss">
.DatePickerInput {
  position: relative;

  &__input {
    @include baseInputBlock;

    cursor: pointer;

    &--error {
      border: 1px solid #ff5101;
    }

    @include mobile {
      width: 100%;
    }
  }

  &__close {
    position: absolute;
    top: 20px;
    right: 25px;
    cursor: pointer;
    padding: 5px;
  }

  &__error {
    margin-top: 10px;
  }

  &__placeholder {
  }

  &__value {
  }

  &__icon {
    display: flex;
    margin-left: 12px;
  }

  &__picker {
    position: absolute;
    top: -50px;
    left: -12px;
    z-index: var(--z-index-dropdown);

    padding: 50px 40px 30px;

    background: var(--bg-secondary);
    box-shadow: var(--secondary-shadown);
    border-radius: 24px;

    @include mobile {
      display: flex;
      flex-direction: column;
      align-items: center;

      left: 0;
      right: 0;
    }
  }

  .DatePickerCalendar {
    margin-top: 10px;
  }
}
</style>
