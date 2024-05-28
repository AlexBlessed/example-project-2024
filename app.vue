<template>
  <div class="app app-bash">
    <NuxtLoadingIndicator color="#FF7739" />
    <NuxtPage />
    <ClientOnly>
      <AppNotifications />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import AppNotifications from 'bash-frontend-kit/components/global/AppNotifications';
import { onMounted, useHead, useRoute, useRuntimeConfig, watch } from '#imports';
import { defineWebPage, defineWebSite, useSchemaOrg } from '@unhead/schema-org-vue';
import { useGlobalStore } from '~/bash-frontend-kit/store/global';
import {useNuxtApp} from "#app/nuxt";

const nuxt = useNuxtApp();

const route = useRoute();
const globalStore = useGlobalStore();

const domain = useRuntimeConfig().public.siteUrl;
useHead({
  link: [
    {rel: 'canonical', href: `${domain}${route.path}`},
  ]
});

useSchemaOrg([
  defineWebSite(),
  defineWebPage(),
]);

const config = useRuntimeConfig();
const devMode = config.public.devMode;

onMounted(() => {
  if(!devMode && !route.query.nogtm) {
    useHead({
      script: [
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\': new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src= \'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f); })(window,document,\'script\',\'dataLayer\',\'${nuxt.$site.gtmId}\');`,
      ]
    });
  }
});

watch(() => globalStore.background, (background) => {
  useHead({
    meta: [
      {hid: 'theme-color', name: 'theme-color', content: background},
    ]
  });
}, {immediate: true});
</script>

<style lang="scss">
.app {
  .container {
    @include mobileUp {
      --container-p: 100px;
      --container-p-m: calc(var(--container-p) * -1);
    }

    max-width: 1360px;
    margin: 0 auto;

    &--full {
      min-width: 100%;
    }
  }
}
</style>
