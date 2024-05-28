<template>
  <div
    class="MainLayout"
    :class="{
    'MainLayout--gradient': gradient,
    'MainLayout--gray-gradient': grayGradient,
    'MainLayout--full': containerFull
  }"
  >
    <slot name="top" />
    <header>
      <div
        class="container"
        :class="{'container--full': containerFull}"
      >
        <TheHeader
          :wishlist-count="wishlistCount"
        />
      </div>
    </header>
    <div class="MainLayout__content">
      <div class="MainLayout__head">
        <div
          v-if="title || breadcrumbs"
          class="container"
          :class="{'container--full': containerFull}"
        >
          <div class="MainLayout__head-inner">
            <PageTitle
              :title="title"
              :meta-title="metaTitle"
              :subtitle="subtitle"
              :description="description"
              :link="subtitleLink"
              :breadcrumbs="breadcrumbs"
            >
              <template v-if="$slots.action" #action>
                <slot name="action" />
              </template>
            </PageTitle>
            <Component
              :is="headerAction"
              v-if="headerAction"
              class="MainLayout__head-action"
            />
          </div>
        </div>
      </div>
      <div class="MainLayout__body">
        <slot />
      </div>
    </div>
    <footer>
      <div class="container">
        <TheFooter v-if="!$site.filteredSiteMode" />
        <TheFooterSimple show-mobile small v-else />
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import TheHeader from '~/components/TheHeader.vue';
import PageTitle from '~/bash-frontend-kit/components/global/PageTitle.vue';
import { RouteLocationRaw } from 'vue-router';
import { watch } from '#imports';
import { useGlobalStore } from '~/bash-frontend-kit/store/global';
import TheFooter from '~/components/TheFooter.vue';
import TheFooterSimple from '~/bash-frontend-kit/components/TheFooterSimple.vue';

const props = defineProps<{
  title?: string;
  metaTitle?: string;
  description?: string;
  subtitle?: string;
  subtitleLink?: RouteLocationRaw;
  breadcrumbs?: { label: string, link?: any }[];
  headerAction?: any;
  wishlistCount?: number;
  containerFull?: boolean,
  gradient?: boolean,
  grayGradient?: boolean,
}>();

const globalStore = useGlobalStore();
watch(() => props.gradient || props.grayGradient, (isGray) => {
  globalStore.setBackground(isGray ? '#F7F8FB' : '#FFFFFF');
}, {immediate: true});
</script>

<style lang="scss">
.MainLayout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &--full {
    .TopWideNotification {
      margin-left: 0;

      .container {
        min-width: 100%;
      }
    }
  }

  &--gradient {
    background: #F7F8FB;
    background: linear-gradient(182.28deg, #F7F8FB 0vh, #FFFFFF 100vh), #FFFFFF;
  }

  &--gray-gradient {
    background: linear-gradient(235deg, #F7F8FB 0%, #FFF 100%);
  }

  &__head {

    &-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;

      @include mobile {
        display: block;
      }
    }

    &-action {
      display: block;
      justify-self: flex-end;
      text-decoration: none;

      @include mobile {
        margin-top: 30px;
      }
    }
  }

  &__body {

  }

  header {
    padding: 30px 0;
    margin-bottom: 30px;

    @include mobile {
      padding: 20px 0;
      margin-bottom: 30px;
    }
  }

  footer {
    margin-top: 110px - 46px;
    padding: 50px 0;

    background: #F9FAFC;

    @include mobile {
      margin-top: 100px - 20px;
    }
  }
}
</style>
