<template>
  <div class="DatePickerCalendar">
    <div
      class="DatePickerCalendar__prev-month"
      @click="prevMonth"
    >
      <img
        src="@/bash-frontend-kit/icons/calendar-month-arrow.svg"
        alt=""
      />
    </div>
    <div
      class="DatePickerCalendar__next-month"
      @click="nextMonth"
    >
      <img
        src="@/bash-frontend-kit/icons/calendar-month-arrow.svg"
        alt=""
      />
    </div>
    <div
      v-for="({ title, days, emptyDays }, monthIndex) in calendarMonths"
      :key="monthIndex"
      class="DatePickerCalendar__month"
      @mouseleave="handleDayMouseLeave"
    >
      <div class="DatePickerCalendar__month-title">
        {{ title }}
      </div>
      <div class="DatePickerCalendar__week-days DatePickerCalendar__grid">
        <div
          v-for="(weekDayName, index) in RU_SHORT_WEEK_DAYS"
          :key="index"
          class="DatePickerCalendar__week-day-name"
        >
          {{ weekDayName }}
        </div>
      </div>
      <div class="DatePickerCalendar__days DatePickerCalendar__grid">
        <div
          v-for="day in emptyDays"
          :key="day"
          class="DatePickerCalendar__empty-day"
        />
        <DatePickerCalendarDay
          v-for="day in days"
          :key="day.timestamp"
          :date="day.date.timestamp"
          :number="day.number"
          v-bind="day"
          @select="handleDayClick"
          @mouseenter="handleDayMouseEnter(day.date)"
          @mouseleave="handleDayMouseLeave"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RU_SHORT_WEEK_DAYS } from '~/bash-frontend-kit/consts/date';
import {
  dateTime,
  DateTime,
} from '~/bash-frontend-kit/libs/date-time/dateTime';
import {
  dateTimePeriod,
  DateTimePeriod,
} from '~/bash-frontend-kit/libs/date-time/dateTimePeriod';
import DatePickerCalendarDay from '~/bash-frontend-kit/components/global/date-picker/DatePickerCalendarDay.vue';
import { useMedia } from '~/bash-frontend-kit/composables/useMedia';

const media = useMedia();

const props = defineProps<{
  month?: DateTime; // month date model;
  date?: DateTime; // single date model;
  period?: DateTimePeriod; // date period model;
  isPeriod?: boolean;
  monthsNumber?: number;
  fromNow?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:month', DateTime);
  (e: 'update:date', DateTime);
  (e: 'update:period', DateTimePeriod);
  (e: 'change');
}>();

watch(
  () => props.month,
  (monthDate: DateTime | null) => {
    if (monthDate) {
      activeMonth.value = monthDate;
    }
  }
);

const today = dateTime.now().resetDay();

const activeMonth = ref(
  props.month?.notEmpty ? props.month : dateTime.orNow(props.date).resetMonth()
);

const startOfDate = computed(() => {
  if (props.date?.notEmpty ?? false) {
    return props.date.copy.resetDay();
  }
  return props.date;
});

const hoveredDayDate = ref<DateTime>();
const selectingPeriodStart = ref(true);

function prevMonth() {
  changeMonth(activeMonth.value.copy.setMonth(activeMonth.value.month - 1));
}

function nextMonth() {
  changeMonth(activeMonth.value.copy.setMonth(activeMonth.value.month + 1));
}

function changeMonth(monthDate: DateTime) {
  activeMonth.value = monthDate;
  emit('update:month', monthDate);
}

function handleDayClick(date: DateTime) {
  if (props.isPeriod) {
    selectDayPeriod(date);
  } else {
    selectDay(date);
  }
  emit('change');
}

function selectDay(date: DateTime) {
  if (props.date?.notEmpty) {
    emit(
      'update:date',
      date.copy.setHours(props.date.hours).setMinutes(props.date.minutes)
    );
  } else {
    emit('update:date', date);
  }
}

function isSetStart(date: DateTime): boolean {
  const period = props.period.copy;

  if (period.start.empty) {
    return true;
  } else if (date < period.start) {
    return true;
  } else if (period.end.notEmpty && date > period.end) {
    return false;
  } else {
    return selectingPeriodStart.value;
  }
}

function selectDayPeriod(date: DateTime) {
  const period = props.period.copy;

  const startDate = isSetStart(date);
  if (startDate) {
    if (period.start.notEmpty && period.end.empty) {
      period.setEnd(period.start);
    }
    period.setStart(date);
  } else {
    period.setEnd(date);
  }
  selectingPeriodStart.value = !startDate;

  emit('update:period', period);
}

function handleDayMouseEnter(dayDate: DateTime) {
  const period = props.period;
  if (
    props.isPeriod &&
    !period.isFullPeriod &&
    (period.start.notEmpty || period.end.notEmpty)
  ) {
    hoveredDayDate.value = dayDate;
  }
}

function handleDayMouseLeave() {
  hoveredDayDate.value = null;
}

const calendarMonths = computed(() => {
  const length = media.md ? 1 : props.monthsNumber || 1;
  return Array.from({ length }, (_, monthIndex) => {
    const monthDate = activeMonth.value.copy.setMonth(
      activeMonth.value.month + monthIndex
    );
    const title = createMonthTitle(monthDate);

    return {
      title,
      emptyDays: monthDate.dayOfWeek,
      days: createMonthDays(monthDate),
    };
  });
});

function createMonthDays(monthDate: DateTime) {
  const days = monthDate.daysInMonth;

  return Array.from({ length: days }).map((_, dayIndex) => {
    const dayNumber = dayIndex + 1;
    const dayDate = monthDate.copy.setDay(dayNumber);
    return createDay(dayDate, dayNumber);
  });
}

function createDay(dayDate: DateTime, number: number) {
  return {
    number,
    date: dayDate,
    selected: isDaySelected(dayDate),
    highlighted: isDayHighlighted(dayDate),
    today: today.isSame?.(dayDate),
    isStart: checkIsStartDay(dayDate),
    isEnd: checkIsEndDay(dayDate),
    disabled: checkIsDayDisabled(dayDate),
  };
}

function isDaySelected(dayDate: DateTime) {
  if (props.isPeriod) {
    if (props.period.isFullPeriod) {
      return props.period.withinPeriod(dayDate);
    } else {
      return (
        props.period.start.isSame?.(dayDate) ||
        props.period.end.isSame?.(dayDate)
      );
    }
  } else {
    return dayDate.isSame?.(startOfDate.value);
  }
}

function isDayHighlighted(dayDate: DateTime) {
  if (!hoveredDayDate.value) {
    return false;
  }

  if (props.isPeriod) {
    if (props.period.isFullPeriod) {
      return false;
    }

    return dateTimePeriod(
      props.period.start,
      hoveredDayDate.value
    ).withinPeriod(dayDate);
  }
  return false;
}

function createMonthTitle(date: DateTime) {
  const month = date.getMonthShortString();
  const year = date.date.getFullYear();
  return `${month} ${year}`;
}

function checkIsStartDay(date: DateTime) {
  const period = props.period;
  if (props.isPeriod) {
    if (period.isFullPeriod && period.isReversedPeriod) {
      return period.end.isSame?.(date);
    } else {
      return period.start.isSame?.(date);
    }
  } else {
    return startOfDate.value.isSame?.(date);
  }
}

function checkIsEndDay(date: DateTime) {
  const period = props.period;
  if (props.isPeriod) {
    if (period.isFullPeriod && period.isReversedPeriod) {
      return period.start.isSame?.(date);
    } else if (period.end.notEmpty) {
      return period.end.isSame?.(date);
    } else {
      return period.start.isSame?.(date);
    }
  } else {
    return startOfDate.value.isSame?.(date);
  }
}

const now = dateTime.now().resetDay();
function checkIsDayDisabled(date: DateTime) {
  if (props.fromNow) {
    return date < now;
  }

  return false;
}
</script>

<style lang="scss">
.DatePickerCalendar {
  position: relative;
  display: inline-flex;
  width: 100%;
  margin-top: 25px;

  &__prev-month,
  &__next-month {
    position: absolute;
    top: 3px;

    display: flex;
    padding: 8px;
    margin: -8px;

    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  &__prev-month {
    left: 0;
  }

  &__next-month {
    right: 0;
    transform: rotate(180deg);
  }

  &__month {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    & + & {
      margin-left: 28px;
    }

    &-title {
      margin-bottom: 20px;
      color: var(--text);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 4px 8px;

    width: 100%;
  }

  &__week-days {
    margin-bottom: 10px;
  }

  &__week-day-name {
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 14px;
    line-height: 20px;
    color: #b4bbc6;
  }

  &__days {
  }
}
</style>
