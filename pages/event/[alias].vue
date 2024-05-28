<template>
  <div class="EventPage">
    <PayNotification />
    <div class="EventPage__content">
      <EventIllustrationBlock :event="event" @updated="updateEvent" />
      <EventContent :event="event" @updated="updateEvent" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import EventIllustrationBlock from '~/components/event/EventIllustrationBlock.vue';
import EventContent from '~/components/event/EventContent.vue';
import { onMounted, onUnmounted, ref, useHttp, useRoute, useSeoMeta } from '#imports';
import { EventSpace } from '~/bash-frontend-kit/types/models/Event';
import PayNotification from '~/bash-frontend-kit/components/modules/notifications/PayNotification.vue';
import { AuthEvents, useAuthStore } from '~/bash-frontend-kit/store/auth';

definePageMeta({
  middleware: 'redirect-html',
});

const alias = useRoute().params.alias;
const authStore = useAuthStore();

const event = ref<EventSpace>(null);
const meta = ref<{ metaDescription: string; metaTitle: string;}>(null);
await fetchEvent();

function updateEvent(newEvent) {
  event.value = newEvent;
}

async function fetchEvent() {
  const { data, ...metaData } = await useHttp().get<{ data: EventSpace; metaDescription: string; metaTitle: string; }>(
    `/events/${alias}`,
  );
  event.value = data;
  meta.value = metaData;
}

onMounted(() => {
  authStore.emitter.addEventListener(AuthEvents.authorized, fetchEvent);
});
onUnmounted(() => {
  authStore.emitter.removeEventListener(AuthEvents.authorized, fetchEvent);
});


useSeoMeta({
  title: meta.value.metaTitle || event.value.title,
  description: meta.value.metaDescription,
})
</script>

<style lang="scss">
.EventPage {
  margin: 0 auto;

  @include mobileUp {
    .TopWideNotification {
      margin-left: 0;

      .container {
        max-width: 100%;
        padding: 0 60px;
      }
    }
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;

    @include mobile {
      display: flex;
      flex-direction: column;
      height: unset;
    }
  }
}
</style>
