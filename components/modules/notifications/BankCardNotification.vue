<template>
  <TopWideNotification
    v-if="queryCardStatus === 'success'"
    :query="cardQueryKey"
    title="Карта успешно добавлена"
  />
  <TopWideNotification
    v-else-if="queryCardStatus === 'error'"
    :query="cardQueryKey"
    title="Произошла ошибка при добавлении карты"
    error
  />
</template>

<script setup lang="ts">
import TopWideNotification from '~/bash-frontend-kit/components/global/TopWideNotification.vue';
import { computed, useRoute } from '#imports';

const route = useRoute();

const cardQueryKey = 'card-status';

const queryCardStatus = computed(() => route.query[cardQueryKey]);
</script>

<style lang="scss">
.BankCardNotification {
}
</style>
