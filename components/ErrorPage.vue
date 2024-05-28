<template>
  <div class="errorPage">
    <slot/>

    <div class="errorPage__content">
      <div class="errorPage__text-block">
        <div
          class="errorPage__title"
          v-html="errorTitle"
        />
        <div
          v-if="errorText"
          class="errorPage__text"
          v-html="errorText"
        />
        <RouterLink
          v-if="error.statusCode === 404"
          class="errorPage__action"
          to="/"
        >
          <BaseButton large> На главную</BaseButton>
        </RouterLink>
      </div>
      <img
        class="errorPage__image"
        :src="errorImage"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '#imports';
import error404 from '~/bash-frontend-kit/assets/illustrations/errors/404.svg';
import error403 from '~/bash-frontend-kit/assets/illustrations/errors/403.svg';
import error500 from '~/bash-frontend-kit/assets/illustrations/errors/500.svg';
import error504 from '~/bash-frontend-kit/assets/illustrations/errors/504.svg';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import { useNuxtApp } from '#app/nuxt';

const props = defineProps({
  error: {
    type: Object,
    default: () => ({
      statusCode: 404,
    }),
  },
});

const nuxt = useNuxtApp();

const errorTitle = computed(() => {
  if (props.error.statusCode === 404) {
    return 'Ошибка 404: страница не найдена…';
  } else if (props.error.statusCode === 403) {
    return 'Ошибка 403: доступ запрещён…';
  } else if (props.error.statusCode === 500) {
    return 'Ошибка 500: сайт временно не активен…';
  } else if (props.error.statusCode === 504) {
    return 'Ошибка 504: сайт не успел отреагировать…';
  }
  else {
    return 'Ошибка'
  }
});

const errorText = computed(() => {
  if (props.error.statusCode === 404) {
    return (
      'Страница, которую вы ищете, не существует или была перемещена. Если вы уверены, ' +
      `что тут должна быть страница, пожалуйста, напишите нам: <a href="${nuxt.$site.emailLink}">${nuxt.$site.email}</a> `
    );
  } else if (props.error.statusCode === 403) {
    return (
      'К сожалению, вам запрещён доступ. Вероятно, вы не знаете, почему это произошло. ' +
      `Напишите нам, и мы откроем вам доступ: <a href="${nuxt.$site.emailLink}">${nuxt.$site.email}</a> `
    );
  } else if (props.error.statusCode === 500) {
    return (
      'Мы приносим извинения за приостановку работы сайта. Попробуйте зайти чуть позже.' +
      ' Мы уверены, к тому моменту сайт вернётся в эфир'
    );
  } else if (props.error.statusCode === 504) {
    return (
      'Произошёл сбой: вы оказались проворнее нашего сайта, и он не успел вовремя ответить на ваше действие.' +
      ' Перезагрузите страницу'
    );
  }
  else {
    return props.error.message;
  }
});

const errorImage = computed(() => {
  if (props.error.statusCode === 404) {
    return error404;
  } else if (props.error.statusCode === 403) {
    return error403;
  } else if (props.error.statusCode === 504) {
    return error504;
  } else /*if (props.error.statusCode === 500)*/ {
    return error500;
  }
});
</script>

<style lang="scss">
.errorPage {
  margin: 0 auto;
  max-width: 1360px;
  padding: 50px 100px;

  @include mobile {
    padding: 30px 40px;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 128px;
    align-items: center;

    @include mobile {
      grid-template-columns: 1fr;
      grid-gap: 0;
      margin-top: 12px;
    }
  }

  &__action {
    text-decoration: none;

    .BaseButton {
      margin-top: 50px;
      @include mobile {
        margin-top: 38px;
      }
    }
  }

  &__text-block {
    max-width: 370px;

    @include mobile {
      max-width: unset;
      order: 2;
      margin-bottom: 12px;
    }
  }

  &__title {
    font-family: var(--accentFontFamaly);
    font-weight: 800;
    font-size: 30px;
    line-height: 34px;
    letter-spacing: -0.01em;
    color: #3b4453;
    margin-bottom: 30px;
    max-width: 230px;

    @include mobile {
      max-width: unset;
      font-size: 22px;
      line-height: 30px;
      margin-bottom: 20px;
    }
  }

  &__text {
    font-weight: 400;
    font-size: 16px;
    line-height: 145%;
    color: #3b4453;
  }

  &__image {
    @include mobile {
      width: 75vw;
      margin-top: -28px;
    }
  }
}
</style>
