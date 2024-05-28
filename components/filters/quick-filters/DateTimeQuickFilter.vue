<template>
  <QuickFilterInput
    class="DateTimeQuickFilter"
    :label="filterMeta.title"
    :value="value"
    large
    mobile-bottom
    :white-mobile="whiteMobile"
    :hide-label-mobile="hideLabelMobile"
    :persist="disableRemove"
    @remove="emit('remove-filter')"
  >
    <template #default="{close}">
      <div class="DateTimeQuickFilter__dropdown">
        <DateTimeFilter
          :filter="filter"
          :from-now="fromNow"
          :rent="rent"
          :relative="relative"
          stepper
          @update:filter="emit('update:filter', $event)"
          @accept="close"
          @clear="clearFilter(close)"
        />
      </div>
    </template>
    <template v-if="$slots.input" #input-block>
      <slot name="input" :value="value"/>
    </template>
    <template #arrow="{opened}">
      <div
        class="DateTimeQuickFilter__icon"
        :class="{'DateTimeQuickFilter__icon--active': opened}"
        v-html="CalendarIcon"
      />
    </template>
  </QuickFilterInput>
</template>

<script setup lang="ts">
import QuickFilterInput from '~/bash-frontend-kit/components/filters/QuickFilterInput.vue';
import DateTimeFilter from '~/bash-frontend-kit/components/filters/items/DateTimeFilter.vue';
import { TableFilterDatePeriod } from '~/bash-frontend-kit/types/table/TableFilter';
import { dateTimePeriod } from '~/bash-frontend-kit/libs/date-time/dateTimePeriod';
import { FilterMeta } from '~/bash-frontend-kit/types/models/Filter';
import { DateTime } from '~/bash-frontend-kit/libs/date-time/dateTime';
import CalendarIcon from '~/bash-frontend-kit/icons/calendar.svg?raw';

const props = defineProps<{
  filterMeta: FilterMeta;
  filter: TableFilterDatePeriod | null;
  whiteMobile?: boolean;
  fromNow?: boolean;
  rent?: boolean;
  hideLabelMobile?: boolean;
  disableRemove?: boolean;
  relative?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:filter', filter: TableFilterDatePeriod);
  (e: 'remove-filter');
}>();

function clearFilter(close) {
  emit('remove-filter');
  close();
}

const value = computed(() => {
  const datePeriod = dateTimePeriod(props.filter?.min, props.filter?.max);

  if (datePeriod.start.notEmpty) {
    let value = datePeriod.start.formatFullDate(false);

    if (+datePeriod.end - +datePeriod.start === DateTime.DAY) {
      return datePeriod.formatFullDatePeriod()
    } else {
      if (datePeriod.end.notEmpty) {
        value += ` • ${datePeriod.start.formatTime()}…${datePeriod.end.formatTime()}`;
      }
    }

    return value;
  }
});
</script>

<style lang="scss">
.DateTimeQuickFilter {

  .PopUpModal {
    overflow: visible;
  }

  &__dropdown {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 35px 45px 25px;

    @include mobile {
      padding: 42px 40px 45px 40px;

      .DateTimeFilter__action {
        bottom: 0;
      }
    }
  }

  .QuickFilterInput__dropdown {
    max-height: unset;

    @include mobile {
      width: auto;
    }
  }

  &__icon {
    display: flex;

    &--active {
      path {
        stroke: #3B4453;
      }
    }
  }
}
</style>
