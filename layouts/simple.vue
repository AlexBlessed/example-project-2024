<template>
  <div class="SimpleLayout">
    <div class="SimpleLayout__header">
      <div class="container">
        <LogoWithLocation />
      </div>
    </div>
    <div class="SimpleLayout__content">
      <slot />
    </div>
    <div class="SimpleLayout__footer">
      <div class="container">
        <div class="SimpleLayout__footer-block">
          «Bash Today» — сервис бронирования лофтов и студий для мероприятий. Через наш сайт вы найдёте площадку под
          любой тип мероприятия быстрее, чем номер в отеле или товар в интернет-магазине.
        </div>
        <div class="SimpleLayout__footer-block">
          © ООО «Бэш-Тудэй», 2015 · {{ $currentYear }}
          Все права защищены.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoWithLocation from '~/components/LogoWithLocation.vue';
</script>

<style lang="scss">
.SimpleLayout {
  &__header {
    padding-top: 30px;
    margin-bottom: 50px;

    @include mobile {
      padding-top: 20px;
      margin-top: 35px;
    }
  }

  &__footer {
    margin-top: 162px;
    margin-bottom: 64px;

    font-size: 14px;
    font-weight: 400;
    line-height: 149%;
    color: var(--gray);

    &-block {
      max-width: 496px;

      & + & {
        margin-top: 25px;
      }
    }

    @include mobile {
      margin-top: 35px;
      margin-bottom: 42px;
    }
  }
}
</style>
