<template>
  <div class="SpaceRentTimePeriodInput">
    <TimePeriodInput
      :start="start"
      :end="end"
      :disabled="disabled"
      :start-props="{ ...(startProps ?? {}), options: startOptions }"
      :end-props="{ ...(endProps ?? {}), options: endOptions }"
      convert-to-ms
      spaced
      :validate-time="validateTimeByBusy"
      @update:start="updateStart"
      @update:end="updateEnd"
    />
  </div>
</template>

<script setup lang="ts">
import TimePeriodInput from '~/bash-frontend-kit/components/form/TimePeriodInput.vue';
import { convertTimeToMs } from '~/bash-frontend-kit/utils/data/date/convertTimeToMs';
import { DateTime } from '~/bash-frontend-kit/libs/date-time/dateTime';
import { convertMsToTime } from '~/bash-frontend-kit/utils/data/date/convertMsToTime';
import { InputOption } from '~/bash-frontend-kit/types/form/InputOption';
import { InputObject } from 'untyped';
import { computed } from '#imports';

const props = defineProps<{
  start?: number;
  end?: number;
  date?: DateTime;
  spaced?: boolean;
  minDuration?: number;
  disabled?: boolean;
  disabledPeriods?: { from: number; to: number }[];
  openAt?: string;
  closeAt?: string;
  startProps?: object;
  endProps?: object;
  withinDay?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:start', time: number);
  (e: 'update:end', time: number);
}>();

const normalizedMinDuration = computed(
  () => props.minDuration || DateTime.HOUR
);
const openAtMs = computed(() => props.openAt && convertTimeToMs(props.openAt));
const closeAtMs = computed(() => {
  let closeAtMs = props.closeAt && convertTimeToMs(props.closeAt);

  if (closeAtMs < openAtMs.value) {
    // Close at night
    closeAtMs += DateTime.DAY;
  }

  return closeAtMs;
});

const periodValid = computed(() => {
  if (props.start != null) {
    if (!validateOptionValue(startOptions.value, props.start)) {
      return false;
    }
  }

  if (props.end != null) {
    if (!validateOptionValue(endOptions.value, props.end)) {
      return false;
    }
  }

  if (props.date && props.start != null && props.end != null) {
    if (!validatePeriod(props.start, props.end)) {
      return false;
    }
  }

  return true;
});

function validateOptionValue(options: any[], value: number) {
  return options.some((option) => option.value === value && !option.disabled);
}

function validatePeriod(start: number, end: number) {
  if (props.disabledPeriods?.length && props.date != null) {
    const dateStart = +props.date.copy.resetDay();
    const startDate = dateStart + start;
    const endDate = dateStart + end;

    const periodValid = props.disabledPeriods.every(({from, to}) => {
      if (startDate < from && endDate < from) {
        return true;
      }

      if (startDate > to && endDate > to) {
        return true;
      }

      return false;
    });

    return periodValid;
  }

  return true;
}

watch(
  () => props.start,
  (start, oldStart) => {
    if (oldStart == null && props.end != null) {
      return;
    }

    const suggestedEnd = start + normalizedMinDuration.value;

    if (validateWorkTime(suggestedEnd) && validateTimeByBusy(suggestedEnd)) {
      updateEnd(suggestedEnd);
    }
  }
);

function validateWorkTime(time: number) {
  if (openAtMs.value != null && openAtMs.value > time) {
    return false;
  }

  if (closeAtMs.value != null && closeAtMs.value < time) {
    return false;
  }

  return true;
}

const startOptions = computed(() => {
  return createTimeOptions((option) => {
    if (!validateWorkTime(option.value)) {
      return false;
    }

    if (
      closeAtMs.value != null &&
      closeAtMs.value < option.value + normalizedMinDuration.value
    ) {
      return false;
    }

    if (!validateTimeByBusy(option.value)) {
      return markOptionAsBusy(option);
    }

    return option;
  });
});

const endOptionsLen = computed(() => {
  if (props.withinDay) {
    return 25 - props.start / DateTime.HOUR;
  }
  return 25;
});

const endOptions = computed(() => {
  return createTimeOptions(
    (option) => {
      if ((props.start ?? 0) + normalizedMinDuration.value > option.value) {
        return false;
      }

      if (!validateWorkTime(option.value)) {
        return false;
      }

      if (!validateTimeByBusy(option.value)) {
        return markOptionAsBusy(option);
      }

      return option;
    },
    endOptionsLen.value,
    props.start ?? 0
  );
});

function createTimeOptions(
  creator: (option: InputOption) => InputObject | false,
  length = 24,
  msOffset = 0
): InputOption[] {
  return Array.from({ length }).reduce<InputOption[]>(
    (options, _, index: number) => {
      const ms = index * DateTime.HOUR + msOffset;
      const time = convertMsToTime(ms);

      const option = {
        text: time,
        value: ms,
      };

      const result = creator(option);

      if (result) {
        options.push(result as InputOption);
      }

      return options;
    },
    []
  );
}

function markOptionAsBusy(option: InputOption) {
  return {
    ...option,
    text: `${option.text} (занято)`,
    disabled: true,
  };
}

function validateTimeByBusy(time: number) {
  if (props.date?.notEmpty && props.disabledPeriods?.length) {
    const dateTime = +props.date.copy.resetDay() + time;
    const dateDisabled = props.disabledPeriods.some(({ from, to }) => {
      return from <= dateTime && dateTime <= to;
    });

    return !dateDisabled;
  }

  return true;
}

function updateStart(start: number) {
  emit('update:start', start);
}

function updateEnd(end: number) {
  emit('update:end', end);
}

defineExpose({
  periodValid,
  validatePeriod,
});
</script>

<style lang="scss">
.SpaceRentTimePeriodInput {
}
</style>
