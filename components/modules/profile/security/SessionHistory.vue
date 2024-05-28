<template>
  <div class="session-history">
    <DataLoading
      v-if="loading && !historyToShow?.length"
      class="session-history__loading"
      compact
    />
    <template v-else>
      <SessionHistoryItem
        v-for="session in historyToShow"
        :key="session.id"
        class="session-history__item"
        :session="session"
      />
    </template>

    <div
      v-if="!onePage"
      class="session-history__show-all"
      @click="toggleFullHistory"
    >
      <div v-if="!showFullHistory">Показать всю историю</div>
      <div v-else>Скрыть всю историю</div>
      <img
        class="arrow-icon"
        :class="{ 'arrow-icon--open': showFullHistory }"
        src="@/bash-frontend-kit/icons/arrow-hide.svg"
        alt=""
      />
    </div>
    <IntersectionObserver
      v-if="showFullHistory"
      @visible="onObserverVisible"
    >
      <BaseButton
        class="session-history__action"
        @click="openModal"
      >
        Завершить все сеансы
      </BaseButton>
    </IntersectionObserver>

    <DropSessionHistoryModal
      :open="modalShow"
      @close="closeModal"
      @confirm="removeSessions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from '#imports';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import { AuthSession } from '~/bash-frontend-kit/types/models/AuthSession';
import SessionHistoryItem from '~/bash-frontend-kit/components/modules/profile/security/SessionHistoryItem.vue';
import IntersectionObserver from '~/bash-frontend-kit/components/global/IntersectionObserver.vue';
import DropSessionHistoryModal from '~/bash-frontend-kit/components/modules/profile/security/DropSessionHistoryModal.vue';
import DataLoading from '~/bash-frontend-kit/components/global/DataLoading.vue';

const props = defineProps<{
  history: AuthSession[];
  onePage: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'next-page', unobserve: () => void): void;
  (e: 'remove-sessions'): void;
}>();

const showFullHistory = ref(props.onePage);
const modalShow = ref(false);

watch(
  () => props.onePage,
  () => {
    showFullHistory.value = props.onePage;
  }
);

function onObserverVisible(_, unobserve) {
  emit('next-page', unobserve);
}

function toggleFullHistory() {
  showFullHistory.value = !showFullHistory.value;
}

function openModal() {
  modalShow.value = true;
}

function closeModal() {
  modalShow.value = false;
}

function removeSessions() {
  showFullHistory.value = props.onePage;
  emit('remove-sessions');
  closeModal();
}

const historyToShow = computed(() => {
  if (showFullHistory.value) {
    return props.history;
  } else {
    return props.history.slice(0, 4);
  }
});
</script>

<style lang="scss">
.session-history {
  display: grid;
  grid-gap: 20px;

  &__loading {
    height: 200px !important;
  }

  &__item {
    max-width: 310px;

    @include mobile {
      max-width: 75vw;
    }
  }

  &__action {
    margin-top: 20px;

    @include mobile {
      margin-top: 15px;
    }
  }

  &__show-all {
    display: flex;
    margin-top: 11px;
    font-weight: 400;
    font-size: 16px;
    line-height: 23px;
    cursor: pointer;

    &:hover {
      color: black;
    }

    .arrow-icon {
      margin-left: 10px;
      transition: transform 0.25s;

      &--open {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
