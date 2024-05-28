import { RU_WEEK_DAYS } from '~/bash-frontend-kit/consts/date';

function isSequenceSimple(arr) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const normalLen = max-min+1;
  return arr.length === normalLen;
}

export default function formatWeekdaysList(weekdays: number[]) {
  if(weekdays?.length) {
    if (weekdays.length > 1 && isSequenceSimple(weekdays)) {
      const min = Math.min(...weekdays);
      const max = Math.max(...weekdays);
      return `${RU_WEEK_DAYS[min]} - ${RU_WEEK_DAYS[max]}`
    }
    else {
      return weekdays.reduce((result, el) => {
        result += `${RU_WEEK_DAYS[el]}, `
        return result
      }, '').slice(0, -2)
    }
  }
}
