<template>
  <TopWideNotification
    v-if="queryStatusPay === 'success'"
    query="status"
    title="Оплата прошла успешно"
  />
  <TopWideNotification
    v-else-if="queryStatusPay === 'error'"
    query="status"
    title="Оплата не прошла"
    error
  />
</template>

<script setup lang="ts">
import TopWideNotification from '~/bash-frontend-kit/components/global/TopWideNotification.vue';
import { computed, useRoute } from '#imports';

const route = useRoute();
const queryStatusPay = computed(() => route.query.status);
</script>

<style lang="scss">
.PayNotification {
}
</style>
