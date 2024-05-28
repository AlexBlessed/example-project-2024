import { AnyDate } from 'bash-frontend-kit/types/base/date';
import { Ref } from 'vue';
import { DateTimePeriod } from 'bash-frontend-kit/libs/date-time/dateTimePeriod';

export function useDateTimePeriod(from?: AnyDate, to?: AnyDate) {
  return ref(new DateTimePeriod(from, to)) as Ref<DateTimePeriod>;
}
