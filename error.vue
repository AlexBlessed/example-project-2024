<template>
  <div class="app app-bash">
    <ClientOnly>
      <AppNotifications />
    </ClientOnly>
    <MainLayout>
      <div class="ErrorPageWrapper">
        <ErrorPage :error="error" />
      </div>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import AppNotifications from '~/bash-frontend-kit/components/global/AppNotifications.vue';
import ErrorPage from '~/bash-frontend-kit/components/ErrorPage.vue';

defineProps<{
  error: object;
}>();
</script>
