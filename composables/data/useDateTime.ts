import { AnyDate } from 'bash-frontend-kit/types/base/date';
import { Ref } from 'vue';
import { DateTime } from 'bash-frontend-kit/libs/date-time/dateTime';

export function useDateTime(date?: AnyDate) {
  return ref(new DateTime(date)) as Ref<DateTime>;
}
