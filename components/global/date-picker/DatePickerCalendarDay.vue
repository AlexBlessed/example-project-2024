<template>
  <div
    class="DatePickerCalendarDay"
    :class="{
      'DatePickerCalendarDay--selected': selected,
      'DatePickerCalendarDay--highlighted': highlighted,
      'DatePickerCalendarDay--start': isStart,
      'DatePickerCalendarDay--end': isEnd,
      'DatePickerCalendarDay--today': today,
      'DatePickerCalendarDay--disabled': disabled,
    }"
    :title="date.toDateString()"
  >
    <div
      class="DatePickerCalendarDay__number"
      @click="select"
    >
      {{ number }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from '~/bash-frontend-kit/libs/date-time/dateTime';

const props = defineProps<{
  date: DateTime;
  number: number;
  selected?: boolean;
  highlighted?: boolean;
  today?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{ (e: 'select', date: DateTime) }>();

function select() {
  emit('select', props.date);
}
</script>

<style lang="scss">
.DatePickerCalendarDay {
  position: relative;

  color: var(--text);

  @mixin borderLeft($radius: 0) {
    border-top-left-radius: $radius;
    border-bottom-left-radius: $radius;
  }

  @mixin borderRight($radius: 0) {
    border-top-right-radius: $radius;
    border-bottom-right-radius: $radius;
  }

  @mixin setColor($background, $color) {
    color: $color;
    &::before {
      background: $background;
    }
  }

  &::before {
    content: '';
    position: absolute;
    @include inset;

    border-radius: 7px;
  }

  &__number {
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 34px;
    height: 34px;
    line-height: 34px;

    border-radius: 7px;
    color: inherit;
    cursor: pointer;

    @include mobile {
      width: auto;
    }
  }

  &--today {
    color: #ff7739;
  }

  &--disabled {
    cursor: default;
    pointer-events: none;

    .DatePickerCalendarDay__number {
      color: #b4bbc6;
    }
  }

  &:not(&--selected) {
    &:hover {
      @include setColor(#f5f6fa, #3b4453);
    }
  }

  &--highlighted {
    @include setColor(#f5f6fa, #3b4453);
  }

  &--selected {
    @include setColor(#ff7739, #ffffff);

    & + & {
      &::before {
        @include borderLeft();
        @include borderRight();
        margin-left: -8px;
      }
    }

    &:first-child::before {
      @include borderRight();
    }

    &:nth-child(7n + 1) {
      &::before {
        @include borderLeft(7px);
        margin-left: 0;
      }
    }

    &:nth-child(7n),
    &:last-child {
      &::before {
        @include borderRight(7px);
      }
    }

    .DatePickerCalendar__empty-day + &:not(:nth-child(7n)) {
      &::before {
        @include borderRight();
      }
    }
  }

  &--start::before {
    @include borderRight();
  }

  &--end::before {
    border-top-right-radius: 7px !important;
    border-bottom-right-radius: 7px !important;
  }
}
</style>
