<template>
  <MainLayout :title="title">
    <div class="container">
      <div class="ProfileLayout">
        <div class="ProfileLayout__content">
          <div class="ProfileLayout__panel">
            <ProfileNavPanel/>
          </div>
          <div class="ProfileLayout__body">
            <slot/>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/layouts/main';
import ProfileNavPanel from '~/components/profile/ProfileNavPanel.vue';

defineProps<{
  title: string;
}>();
</script>

<style lang="scss">
.ProfileLayout {
  position: relative;

  @include mobile {
    padding-top: 80px;
  }

  &__title {
    margin-bottom: 50px;

    @include mobile {
      margin-bottom: 24px;
    }
  }

  &__marker {
    margin-bottom: 20px;
    margin-top: 0 !important;
  }

  &__content {
    display: grid;
    grid-template-columns: 310px 1fr;
    grid-gap: 100px;

    @include mobile {
      display: flex;
      flex-direction: column;
      grid-gap: unset;
    }
  }

  &__panel {
    @include mobile {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      margin: 0 var(--container-p-m) 40px;
      overflow-x: auto;
    }

    .profile-menu-list {
      @include mobile {
        margin: 0;
      }
    }
  }

  &__body {

  }
}
</style>
