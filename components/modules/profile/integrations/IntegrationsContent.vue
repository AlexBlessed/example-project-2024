<template>
  <div
    class="IntegrationsContent"
    :class="{ 'IntegrationsContent--vertical': vertical }"
  >
    <DataLoading v-if="!dataIntegration && pending" />
    <template v-else>
      <div
        v-if="activeIntegration.length"
        class="IntegrationsContent__active"
      >
        <ActiveIntegrationsItem
          v-for="(item, i) in activeIntegration"
          :key="i"
          :integration="item"
          :value="item.value"
          @remove="removeActiveIntegration(item)"
        />
        <BaseButton
          v-if="activeIntegration.length"
          class="IntegrationsContent__button"
          md-slim
          remove
          @click="openModal"
        >
          <img src="@/bash-frontend-kit/icons/plus-accent.svg" />
          Добавить интеграцию
        </BaseButton>
      </div>
      <div
        class="IntegrationsContent__side"
        :class="{ 'IntegrationsContent__side--open': available }"
      >
        <div
          class="IntegrationsContent__title"
          @click="openAvailable"
        >
          Доступные интеграции
        </div>
        <div class="IntegrationsContent__text">
          Вы можете добавить интеграции к различным сервисам для лучшего
          взаимодействия с сервисом.
          <br />
          <br />
          На данный момент доступны следующие интеграции:
        </div>
        <div class="IntegrationsContent__available">
          <div class="IntegrationsContent__list">
            <IntegrationsItem
              v-for="(item, i) in integrations"
              :key="i"
              class="IntegrationsContent__item"
              :integration="item"
            />
          </div>
          <BaseButton
            v-if="!activeIntegration.length"
            class="IntegrationsContent__button"
            md-slim
            remove
            @click="openModal"
          >
            <img src="@/bash-frontend-kit/icons/plus-accent.svg" />
            Добавить интеграцию
          </BaseButton>
        </div>
      </div>
      <IntegrationsSelectModal
        :modal-open="modalOpen"
        :integrations="integrations"
        @close="closeModal"
        @confirm="setIntegration"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import GrayTelegramIcon from '~/bash-frontend-kit/icons/social/telegram-gray.svg';
import GrayGoogleIcon from '~/bash-frontend-kit/icons/social/google-gray.svg';
import TelegramIcon from '~/bash-frontend-kit/icons/social/telegram.svg';
import GoogleIcon from '~/bash-frontend-kit/icons/social/google.svg';
import GrayWhatsAppIcon from '~/bash-frontend-kit/icons/social/whatsapp-gray.svg';
import WhatsAppIcon from '~/bash-frontend-kit/icons/social/whatsapp.svg';
import GrayVKIcon from '~/bash-frontend-kit/icons/social/vk-gray.svg';
import VKIcon from '~/bash-frontend-kit/icons/social/vk.svg';
import GrayTrelloIcon from '~/bash-frontend-kit/icons/social/trello-gray.svg';
import TrelloIcon from '~/bash-frontend-kit/icons/social/trello.svg';
import { computed, nextTick, ref, watch } from '#imports';
import IntegrationsItem from '~/bash-frontend-kit/components/modules/profile/integrations/IntegrationsItem.vue';
import IntegrationsSelectModal from '~/bash-frontend-kit/components/global/IntegrationsSelectModal.vue';
import ActiveIntegrationsItem from '~/bash-frontend-kit/components/modules/profile/integrations/ActiveIntegrationsItem.vue';
import IntegrationTelegram from '~/bash-frontend-kit/components/modules/profile/integrations/IntegrationTelegram.vue';
import IntegrationGoogle from '~/bash-frontend-kit/components/modules/profile/integrations/IntegrationGoogle.vue';
import DataLoading from '~/bash-frontend-kit/components/global/DataLoading.vue';
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';
import { useNotify } from '~/bash-frontend-kit/composables/notify/useNotify';
import { useAuthStore } from '~/bash-frontend-kit/store/auth';

defineProps<{
  vertical?: boolean;
}>();

const http = useHttp();
const authStore = useAuthStore();

const dataIntegration = ref(null);
const pending = ref(false);

async function fetchIntegration() {
  pending.value = true;
  dataIntegration.value = await http.get('/bind');
  await nextTick();
  pending.value = false;
}

fetchIntegration();

const modalOpen = ref(false);
const available = ref(false);
const timerChecker = ref(null);

const integrations = [
  {
    title: 'Telegram - для уведомлений',
    name: 'Telegram',
    icon: GrayTelegramIcon,
    bigIcon: TelegramIcon,
    alias: 'telegram',
    component: IntegrationTelegram,
  },
  {
    title: 'Google - для заявок на свободное время',
    name: 'Google',
    icon: GrayGoogleIcon,
    bigIcon: GoogleIcon,
    alias: authStore.isClient ? '' : 'google',
    component: IntegrationGoogle,
  },
  {
    title: 'WhatsApp',
    icon: GrayWhatsAppIcon,
    bigIcon: WhatsAppIcon,
    alias: '',
  },
  {
    title: 'ВКонтакте',
    icon: GrayVKIcon,
    bigIcon: VKIcon,
    alias: '',
  },
  {
    title: 'Trello',
    icon: GrayTrelloIcon,
    bigIcon: TrelloIcon,
    alias: '',
  },
].filter(({ alias }) => alias);

const _isEmpty = (val) => val == null || val?.length === 0;

const activeIntegration = computed(() => {
  if (!dataIntegration.value) {
    return [];
  }

  return integrations.reduce((tmp, item) => {
    const alias = item.alias;
    const value = dataIntegration.value[alias];
    if (!_isEmpty(value)) {
      if (Array.isArray(value)) {
        value?.forEach?.((value) => {
          tmp.push({ ...item, value });
        });
      } else {
        tmp.push({ ...item, value });
      }
    }
    return tmp;
  }, []);
});

const activeIntegrationValues = computed(() => {
  return activeIntegration.value
    .map(({ value }) => Object.values(value)[0])
    .join(',');
});

watch(activeIntegrationValues, (val, oldVal) => {
  if (!pending.value && val !== oldVal && val.length > oldVal.length) {
    useNotify().notifySuccess({
      title: 'Интеграция успешно добавлена',
    });
    closeModal();
  }
});

function openModal() {
  window.scrollTo(0, 0);
  modalOpen.value = true;
  clearInterval(timerChecker.value);
  timerChecker.value = setInterval(refresh, 1000 * 10);
}

async function refresh() {
  dataIntegration.value = await http.get('/bind');
}

function closeModal() {
  modalOpen.value = false;
  clearInterval(timerChecker.value);
}

function setIntegration(item) {
  integrations[item.i].alias = item.alias;
  activeIntegration.value.push(integrations[item.i]);
}

async function removeActiveIntegration({ alias, value }) {
  if (alias === 'telegram') {
    await http.delete(`/bind/telegram/${value.chat_id}`);
  } else if (alias === 'google') {
    await http.delete(`/bind/google/${value.id}/delete`);
  }
  await refresh();
}

function openAvailable() {
  available.value = !available.value;
}
</script>

<style lang="scss">
.IntegrationsContent {
  display: grid;
  grid-template-columns: 1fr 217px;
  grid-gap: 40px;

  @include mobileUp {
    &--vertical {
      display: flex;
      flex-direction: column-reverse;
      grid-gap: unset;
    }
    &--vertical & {
      &__available {
        margin-bottom: 40px;
      }
    }
  }

  @include mobile {
    grid-template-columns: 1fr;
  }

  .Modal__mobile-close {
    display: none;
  }

  &__active {
    @include mobile {
      order: 2;
    }
  }

  &__side--open {
    .IntegrationsContent__text {
      display: none;
    }

    .IntegrationsContent__list {
      display: none;
    }

    .IntegrationsContent__title:after {
      transform: rotate(180deg);
    }
  }

  &__title {
    display: none;
    position: relative;
    margin-bottom: 15px;

    &:after {
      content: '';
      width: 8px;
      height: 5px;
      margin-top: 9px;
      margin-left: 10px;
      background-image: url('../../../../icons/arrow-hide.svg');
    }

    @include mobile {
      display: flex;
    }
  }

  &__text {
    max-width: 490px;
    margin-bottom: 20px;
    transition: all $transition-duration;
  }

  &__list {
    transition: all $transition-duration;
  }

  &__button {
    margin-top: 40px;
  }
}
</style>
