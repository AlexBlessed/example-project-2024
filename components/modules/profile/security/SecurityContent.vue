<template>
  <div class="security-content">
    <div class="security-content__password">
      <div class="security-content__title">Изменить пароль</div>
      <ChangePasswordForm />
    </div>
    <div
      v-show="authSessionsHistory.length || pending"
      class="security-content__history"
    >
      <div class="security-content__title">История входов {{ page }}</div>
      <SessionHistory
        :history="authSessionsHistory"
        :one-page="done && page === 1"
        :loading="pending"
        @next-page="fetchNextSessionsPage"
        @remove-sessions="removeSessions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChangePasswordForm from '~/bash-frontend-kit/components/modules/profile/security/ChangePasswordForm.vue';
import SessionHistory from '~/bash-frontend-kit/components/modules/profile/security/SessionHistory.vue';
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';
import { AuthSession } from '~/bash-frontend-kit/types/models/AuthSession';
import { useNotify } from '~/bash-frontend-kit/composables/notify/useNotify';
import { useHttpPagination } from '~/bash-frontend-kit/composables/useHttpPagination';
import { useRouter } from '#imports';

const { notifySuccess } = useNotify();
const http = useHttp();

const {
  data: authSessionsHistory,
  done,
  next,
  page,
  pending,
  stream,
} = useHttpPagination<AuthSession>('/profile/sessions', true);
await stream;

function fetchNextSessionsPage(unobserve) {
  if (done.value) {
    unobserve();
  } else {
    next();
  }
}

async function removeSessions() {
  await http.delete('/profile/sessions/drop');
  authSessionsHistory.value = [];
  page.value = 1;
  notifySuccess({
    title: 'История входов успешно удалена',
  });
  await useRouter().push('/');
}
</script>

<style lang="scss">
.security-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 102px;
  max-width: 664px;

  @include mobile {
    display: block;
  }

  &__password {
    @include mobile {
      margin-bottom: 50px;
    }
  }

  &__title {
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #b4bbc6;

    margin-bottom: 25px;
  }
}
</style>
