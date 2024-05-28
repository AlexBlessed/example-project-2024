<template>
  <BaseSelect
    v-model="timeModel"
    class="TimeInput"
    :options="options ?? timeOptions"
    :reduce="reduce"
    :validate-option="validateOption"
  />
</template>

<script setup lang="ts">
import BaseSelect from '~/bash-frontend-kit/components/form/BaseSelect.vue';
import { InputOption } from '~/bash-frontend-kit/types/form/InputOption';
import { DateTime } from '~/bash-frontend-kit/libs/date-time/dateTime';
import { convertMsToTime } from '~/bash-frontend-kit/utils/data/date/convertMsToTime';

const props = defineProps<{
  modelValue?: number | string;
  options?: InputOption[];
  relative?: boolean;
  convertToMs?: boolean;
  min?: string | number;
  max?: string | number;
  extraOption?: boolean;
  validateTime?: (timestamp: number) => boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', time: string);
}>();

function reduce(option: InputOption) {
  if (props.convertToMs) {
    return option?.value;
  } else {
    return option?.text;
  }
}

function validateOption(option) {
  if (props.validateTime) {
    return props.validateTime(reduce(option));
  }

  return true;
}

const timeOptions = computed(() => {
  const options = Array.from({ length: 24 }, (_, index) => {
    const ms = index * DateTime.HOUR;
    const time = convertMsToTime(ms);

    return {
      text: time,
      value: ms,
    };
  });

  if (props.extraOption) {
    options.push({
      text: '23:59',
      value: DateTime.DAY,
    });
  }

  if (props.relative) {
    return options.filter(({ value, text }) => {
      const val = props.convertToMs ? value : text;

      if (props.min != null) {
        if (val < props.min) {
          return false;
        }
      }
      if (props.max != null) {
        if (val > props.max) {
          return false;
        }
      }

      return true;
    });
  }

  return options;
});

const timeModel = computed({
  get() {
    return props.modelValue;
  },
  set(time: string) {
    emit('update:modelValue', time);
  },
});
</script>

<style lang="scss">
.TimeInput {
  .BaseSelect__dropdown {
    padding-right: 20px;

    max-height: 180px;
    max-width: unset;

    white-space: nowrap;

    @include mobileUp {
      right: unset;
    }
  }
}
</style>
