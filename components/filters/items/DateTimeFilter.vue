<template>
  <div
    class="DateTimeFilter"
    :class="{ 'DateTimeFilter--stepper': stepper }"
  >
    <div
      v-if="!stepper || stepTime"
      class="DateTimeFilter__time"
    >
      <Component
        :is="rent ? SpaceRentTimePeriodInput : TimePeriodInput"
        v-model:start="startTime"
        v-model:end="endTime"
        :min-duration="DateTime.HOUR"
        :relative="relative"
        convert-to-ms
        spaced
      />
    </div>
    <DatePickerCalendar
      v-if="!stepper || !$media.md || !stepTime"
      class="DateTimeFilter__calendar"
      v-model:date="date"
      :months-number="1"
      :from-now="fromNow"
    />
    <!--    <div class="DateTimeFilter__for-day">-->
    <!--      <BaseCheckbox-->
    <!--        v-model="forDayFlagModel"-->
    <!--        label="Хочу забронировать на сутки"-->
    <!--      />-->
    <!--    </div>-->

    <ShadowStickyActions
      v-if="$media.md"
      class="DateTimeFilter__action"
    >
      <BaseButton
        :disabled="stepper && !valid"
        @click="$emit('accept')"
      >
        Сохранить
      </BaseButton>
      <BaseButton
        gray
        @click="$emit('clear')"
      >
        {{ stepper && !valid ? 'Отмена' : 'Очистить' }}
      </BaseButton>
    </ShadowStickyActions>
    <BaseButton
      v-else-if="stepper && stepTime"
      :disabled="!valid"
      @click="$emit('accept')"
    >
      Сохранить
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
import DatePickerCalendar from '~/bash-frontend-kit/components/global/date-picker/DatePickerCalendar.vue';
import { TableFilterDatePeriod } from '~/bash-frontend-kit/types/table/TableFilter';
import {
  DateTime,
  dateTime,
} from '~/bash-frontend-kit/libs/date-time/dateTime';
import TimePeriodInput from '~/bash-frontend-kit/components/form/TimePeriodInput.vue';
import { dateTimePeriod } from '~/bash-frontend-kit/libs/date-time/dateTimePeriod';
import SpaceRentTimePeriodInput from '~/bash-frontend-kit/components/filters/items/SpaceRentTimePeriodInput.vue';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import ShadowStickyActions from '~/bash-frontend-kit/components/global/ShadowStickyActions.vue';
import { computed, onBeforeUnmount, watch } from '#imports';

const props = defineProps<{
  filter: TableFilterDatePeriod | null;
  fromNow?: boolean;
  rent?: boolean;
  stepper?: boolean;
  relative?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:filter', filter: TableFilterDatePeriod);
  (e: 'accept');
  (e: 'clear');
}>();

const date = ref(dateTime());
const startTime = ref();
const endTime = ref();
const stepTime = ref(false);

watch([date, startTime, endTime], () => updateFilter());

const valid = computed(() =>
  [date, startTime, endTime].every(({ value }) => value != null)
);

let unwatch;
onMounted(() => {
  if (props.filter?.min) {
    const dateStart = dateTime(props.filter.min);

    if (dateStart.notEmpty) {
      date.value = dateStart.copy.resetDay();
      startTime.value = +dateStart - +dateStart.copy.resetDay();
    }
  }

  if (props.filter?.max) {
    const dateEnd = dateTime(props.filter.max);

    if (dateEnd.notEmpty) {
      if (!date.value) {
        date.value = dateEnd.copy.resetDay();
      }
      endTime.value = +dateEnd - +dateEnd.copy.resetDay();
    }
  }

  unwatch = watch(date, (val) => {
    stepTime.value = !!val;
  });
});

onBeforeUnmount(() => {
  unwatch?.();
});

const forDayFlagModel = computed({
  get() {
    return endTime.value - startTime.value === DateTime.DAY;
  },
  set(forDay: boolean) {
    if (forDay) {
      startTime.value = 0;
      endTime.value = DateTime.DAY;
    }
  },
});

function updateFilter() {
  const timeEmpty = endTime.value == null || startTime.value == null;
  if (date.value.empty || (props.stepper && timeEmpty)) {
    return;
  }

  const datePeriod = dateTimePeriod();

  datePeriod.start = date.value.copy.resetDay().add(startTime.value ?? 0);

  if (endTime.value) {
    datePeriod.end = date.value.copy.resetDay().add(endTime.value);
  }

  if (
    +datePeriod.start !== +props.filter?.min ||
    +datePeriod.end !== +props.filter?.max
  ) {
    emit('update:filter', {
      min: datePeriod.start,
      max: datePeriod.end,
    });
  }
}
</script>

<style lang="scss">
.DateTimeFilter {
  flex-grow: 1;

  @include mobile {
    &--stepper {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    }
  }

  @include mobileUp {
    &--stepper {
      display: grid;
      align-items: flex-end;
      grid-template-columns: auto auto;
      grid-gap: 40px;

      .TimePeriodInput {
        width: 280px;
        grid-template-columns: 1fr;
        grid-gap: 25px;
      }
    }
    &--stepper & {
      &__time {
        grid-column: 2 / 3;
        margin-bottom: auto;
      }

      &__calendar {
        grid-row: 1 / 3;
        margin: 0;

        &:first-child:last-child {
          grid-column: 1 / 3;
          width: max-content;
        }
      }

      &__action {
      }
    }
  }

  &__for-day {
    margin-top: 15px;
  }

  & &__action {
    bottom: -40px;
    margin-bottom: -40px;
  }
}
</style>
