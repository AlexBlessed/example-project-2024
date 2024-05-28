<template>
  <div
    class="DateInput"
    :class="{ 'DateInput--time': viewTime }"
  >
    <BaseInput
      v-model="dateValue"
      class="DateInput__date-input"
      :title="date?.toCalendarString?.()"
      v-bind="$attrs"
      :type="typeInput"
      :error="error || $attrs.error"
      :valid="valid"
      @click.prevent
      @focus="onFocus"
      @blur="onBlur"
    />
    <template v-if="viewTime">
      <select
        v-model="hoursModel"
        class="DateInput__select"
      >
        <option
          v-for="{ title, value } in hoursOptions"
          :key="value"
          :value="value"
        >
          {{ title }}
        </option>
      </select>
      <select
        v-model="minutesModel"
        class="DateInput__select"
      >
        <option
          v-for="{ title, value } in minutesOptions"
          :key="value"
          :value="value"
        >
          {{ title }}
        </option>
      </select>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {dateTime, DateTime,} from '~/bash-frontend-kit/libs/date-time/dateTime';
import {validatorDate} from '~/bash-frontend-kit/utils/validators/validateDate';
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import {computed, ref, watch} from '#imports';
import {formatDateTimeNumber} from '~/bash-frontend-kit/utils/format/formatDateTimeNumber';
import {RawDate} from '~/bash-frontend-kit/types/base/date';

const props = defineProps<{
  modelValue?: RawDate | DateTime;
  viewTime?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: DateTime): void;
}>();

const date = computed<DateTime>(() => {
  if (props.modelValue) {
    if (props.modelValue instanceof DateTime) {
      return props.modelValue;
    } else {
      return dateTime(props.modelValue);
    }
  }
});

const isFocused = ref(false);

const dateIsNotEmpty = computed(() => !!date.value?.notEmpty);

const dateValue = ref<string>(
  dateIsNotEmpty.value ? date.value?.toInputString() : null
);

const typeInput = computed(() => {
  return isFocused.value || props.modelValue ? 'date' : 'text';
});

function onFocus() {
  isFocused.value = true;
}

function onBlur() {
  isFocused.value = false;
}

watch(date, (date) => {
  if (date?.notEmpty) {
    dateValue.value = date.toInputString();
  }
});

watch(dateValue, () => {
  if (checkFormatDate(dateValue.value)) {
    updateDateTime(dateTime(dateValue.value).resetDay(), true);
  } else {
    updateDateTime();
  }
});

function checkFormatDate(date: string) {
  return dateTime(date).notEmpty;
}

const hoursModel = computed({
  get() {
    if (dateIsNotEmpty.value) {
      return date.value.hours;
    }
  },
  set(hours) {
    if (dateIsNotEmpty.value) {
      updateDateTime(date.value.copy.setHours(hours));
    } else {
      updateDateTime(dateTime(dateTime.now().resetDay()).setHours(hours));
    }
  },
});

const minutesModel = computed({
  get() {
    if (dateIsNotEmpty.value) {
      return date.value.minutes;
    }
  },
  set(minutes) {
    if (dateIsNotEmpty.value) {
      updateDateTime(date.value.copy.setMinutes(minutes));
    } else {
      updateDateTime(dateTime(dateTime.now().resetDay()).setMinutes(minutes));
    }
  },
});

const validateResult = computed(() => validatorDate(dateValue.value));
const validateResultIsString = computed(
  () => typeof validateResult.value === 'string'
);

const error = computed(() => {
  return validateResultIsString.value ? validateResult.value : null;
});
const valid = computed(() => {
  return validateResultIsString.value ? false : validateResult.value;
});

function updateDateTime(date?: DateTime, setTime = false) {
  if (props.viewTime && setTime) {
    emit(
      'update:modelValue',
      date.empty
        ? date
        : date.copy
            .setHours(hoursModel.value ?? 0)
            .setMinutes(minutesModel.value ?? 0)
    );
  } else {
    if (date?.notEmpty && date.isSame(dateTime(props.modelValue))) {
      return;
    }
    emit('update:modelValue', date);
  }
}

const hoursOptions = Array.from({ length: 24 }, (_, index) => ({
  title: formatDateTimeNumber(index),
  value: index,
}));

const minutesOptions = Array.from({ length: 60 }, (_, index) => ({
  title: formatDateTimeNumber(index),
  value: index,
}));
</script>

<style lang="scss">
.DateInput {
  display: flex;
  align-items: flex-start;

  .DateInput__select {
    height: 50px;
  }

  &--time {
    //border: 1px solid var(--border-light-color);
    border-radius: 5px;

    .DateInput__select {
      border: 1px solid var(--border-light-color);

      &:nth-child(2) {
        border-left: none;
      }
    }

    .DateInput__date-input {
      flex-grow: 1;
      border-radius: 5px 0 0 5px;
    }
  }

  .DateInput__date-input {
    width: 100%;
  }

  &__select {
    @include baseInputText;

    min-width: 70px;
    padding-left: 16px;
    flex-shrink: 0;

    border-left: 1px solid #edeef4;
    appearance: none;

    background-image: url('~/bash-frontend-kit/icons/time-select-arrow.svg');
    background-repeat: no-repeat;
    background-position: calc(100% - 18px) center;
  }
}
</style>
