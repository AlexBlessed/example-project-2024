<template>
  <div class="DateFilter">
    <div
      class="DateFilter__content"
      :class="{ 'DateFilter__content--compact': compact }"
    >
      <BaseSelect
        hover
        v-if="!noPeriod"
        :model-value="activePreset"
        :options="options"
        placeholder="Выбрать"
        @update:modelValue="selectCalendarPreset"
      />
      <br v-if="!noPeriod" />
      <DateInput
        v-model="dateStartModel"
        placeholder="От"
      />
      <DateInput
        v-model="dateEndModel"
        placeholder="До"
      />
    </div>
    <DatePickerCalendar
      v-model:period="datePeriodModel"
      is-period
      :months-number="compact ? 1 : 2"
      @change="resetPreset"
    />
    <ShadowStickyActions
      v-if="$media.md"
      class="DateFilter__action"
    >
      <BaseButton @click="$emit('accept')">Сохранить</BaseButton>
      <BaseButton
        gray
        @click="$emit('clear')"
        >Очистить</BaseButton
      >
    </ShadowStickyActions>
  </div>
</template>

<script lang="ts" setup>
import DatePickerCalendar from '~/bash-frontend-kit/components/global/date-picker/DatePickerCalendar.vue';
import BaseSelect from '~/bash-frontend-kit/components/form/BaseSelect.vue';
import {
  DateTime,
  dateTime,
} from '~/bash-frontend-kit/libs/date-time/dateTime';
import {
  dateTimePeriod,
  DateTimePeriod,
} from '~/bash-frontend-kit/libs/date-time/dateTimePeriod';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import DateInput from '~/bash-frontend-kit/components/form/DateInput.vue';
import { TableFilterDatePeriod } from '~/bash-frontend-kit/types/table/TableFilter';
import ShadowStickyActions from '~/bash-frontend-kit/components/global/ShadowStickyActions.vue';

const props = defineProps<{
  filter: TableFilterDatePeriod | null;
  compact?: boolean;
  noPeriod?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:filter', filter: TableFilterDatePeriod);
  (e: 'accept');
  (e: 'clear');
}>();

const datePeriodModel = computed({
  get() {
    const { min, max } = props.filter ?? {};
    return dateTimePeriod(min, max);
  },
  set(datePeriod: DateTimePeriod) {
    const filter: TableFilterDatePeriod = {};

    if (datePeriod.start.notEmpty) {
      filter.min = datePeriod.start;
    }
    if (datePeriod.end.notEmpty) {
      filter.max = datePeriod.end;
    }

    emit('update:filter', filter);
  },
});

const dateStartModel = computed({
  get() {
    return datePeriodModel.value.start;
  },
  set(dateTime: DateTime) {
    datePeriodModel.value = dateTimePeriod(dateTime, datePeriodModel.value.end);
  },
});

const dateEndModel = computed({
  get() {
    return datePeriodModel.value.end;
  },
  set(dateTime: DateTime) {
    datePeriodModel.value = dateTimePeriod(
      datePeriodModel.value.start,
      dateTime
    );
  },
});

const calendarPresets = {
  LAST_30_DAYS: 'last-30-days',
  CURRENT_MONTH: 'current-month',
  LAST_MONTH: 'last-month',
  CURRENT_YEAR: 'current-year',
  LAST_YEAR: 'last-year',
};

const calendarPresetsList = Object.values(calendarPresets);

const activePreset = ref(getActivePreset());

const options = [
  {
    label: 'Всё время',
    value: null,
  },
  {
    label: 'Последние 30 дней',
    value: calendarPresets.LAST_30_DAYS,
  },
  {
    label: 'Этот месяц',
    value: calendarPresets.CURRENT_MONTH,
  },
  {
    label: 'Последний месяц',
    value: calendarPresets.LAST_MONTH,
  },
  {
    label: 'Этот год',
    value: calendarPresets.CURRENT_YEAR,
  },
  {
    label: 'Последний год',
    value: calendarPresets.LAST_YEAR,
  },
];

function selectCalendarPreset(preset) {
  activePreset.value = preset;
  datePeriodModel.value = getDateTimeByPreset(preset);
}

function resetPreset() {
  activePreset.value = null;
}

function getDateTimeByPreset(preset): DateTimePeriod {
  const now = dateTime.now().resetDay();

  switch (preset) {
    case calendarPresets.LAST_30_DAYS:
      return dateTimePeriod(+now - DateTime.DAY * 30, now);
    case calendarPresets.CURRENT_MONTH:
      return dateTimePeriod(
        now.copy.resetMonth(),
        now.copy.setDay(now.daysInMonth)
      );
    case calendarPresets.LAST_MONTH:
      const lastMonth = now.copy.setMonth(now.month - 1).resetMonth();
      return dateTimePeriod(
        lastMonth,
        lastMonth.copy.setDay(lastMonth.daysInMonth)
      );
    case calendarPresets.CURRENT_YEAR:
      const startOfYear = now.copy.resetYear();
      return dateTimePeriod(
        startOfYear,
        +startOfYear + DateTime.YEAR - DateTime.DAY
      );
    case calendarPresets.LAST_YEAR:
      const lastYear = now.copy.setYear(now.year - 1).resetYear();
      return dateTimePeriod(lastYear, +lastYear + DateTime.YEAR - DateTime.DAY);
    default:
      return dateTimePeriod();
  }
}

function getActivePreset() {
  const period = datePeriodModel.value;
  if (!period.isFullPeriod) {
    return null;
  }

  return calendarPresetsList.find((preset) => {
    const presetPeriod = getDateTimeByPreset(preset);
    if (presetPeriod.isSame(period)) {
      return preset;
    }
  });
}
</script>

<style lang="scss">
.DateFilter {
  @include mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__content {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 26px;
    margin-bottom: 35px;

    &--compact {
      grid-template-columns: 1fr;
      grid-gap: 20px;
      margin-bottom: 25px;

      br {
        display: none;
      }
    }

    @include mobile {
      grid-template-columns: 1fr;
      margin-bottom: 0;

      br {
        display: none;
      }
    }
  }

  & &__action {
    bottom: -40px;
    margin-bottom: -40px;
  }
}
</style>
