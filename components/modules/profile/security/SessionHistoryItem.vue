<template>
  <div class="SessionHistoryItem">
    <div class="SessionHistoryItem__title" :title="title">
      {{ title }}
    </div>
    <div class="SessionHistoryItem__subtitle" :title="subtitle">
      {{ subtitle }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AuthSession } from '~/bash-frontend-kit/types/models/AuthSession';
import { dateTime } from '~/bash-frontend-kit/libs/date-time/dateTime';

const props = defineProps<{ session: AuthSession }>();

const title = computed(() => {
  const { os, ip, country, city } = props.session;
  const locationTitle = [country, city].filter((v) => v).join(', ');

  let title = `${os} ∙ IP ${ip}`;
  if (locationTitle) {
    title += ` (${locationTitle})`;
  }
  return title;
});

const subtitle = computed(() => {
  const { created_at, browser, device } = props.session;
  const date = dateTime(created_at).toCalendarString();
  return `${date} ∙ ${browser} (${device})`;
});

/*  {
    title: 'OS ∙ IP 217.12.60.123 (Россия, Москва)',
    subtitle: 'сегодня в 14:42 ∙ Safari (mobile)',
  },*/
</script>

<style lang="scss">
.SessionHistoryItem {
  max-width: 420px;

  &__title {
    font-weight: 400;
    font-size: 16px;
    line-height: 23px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__subtitle {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #b4bbc6;
  }
}
</style>
