<template>
  <div
    class="FooterSimple"
    :class="{
      'FooterSimple--error': error,
      'FooterSimple--show-mobile': showMobile,
      'FooterSimple--small': small,
    }"
  >
    <div class="FooterSimple__container">
      <div class="FooterSimple__side">
        <div class="FooterSimple__text">Нужна помощь?</div>
        <div v-if="!small" class="FooterSimple__text">
          Напишите нам на почту <a :href="$site.emailLink">{{ $site.email }}</a>
        </div>
        <div class="FooterSimple__text">
          {{small ? 'Позвоните' : 'или позвоните'}}
           <a href="tel:+74954097873">+7 (495) 409-7873</a>
        </div>
      </div>
      <div class="FooterSimple__text">© «{{ $site.name }}», {{ $currentYear }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  error?: boolean;
  showMobile?: boolean;
  small?: boolean;
}>();
</script>

<style lang="scss">
.FooterSimple {
  border-top: 1px dashed #e4e4e4;

  @include tabletUp {
    padding-top: 26px;
    padding-bottom: 54px;
  }

  a:not(:hover) {
    text-decoration: none;
  }

  &--small {
    border: none;
  }

  &--error {
    position: absolute;
    left: 100px;
    right: 100px;
    padding-bottom: 50px;

    @include mobile {
      position: static;
      padding-bottom: 0;
      display: block !important;
      border-top: none;
    }
  }

  &:not(&--show-mobile) {
    @include mobile {
      display: none;
    }
  }

  &__side {
    @include mobile {
      margin-bottom: 20px;
    }
  }

  &__container {
    display: flex;
    justify-content: space-between;

    @include mobile {
      flex-direction: column;
      justify-content: unset;
    }

    .FooterSimple__text {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #a5aabe;
    }
  }
}
</style>
