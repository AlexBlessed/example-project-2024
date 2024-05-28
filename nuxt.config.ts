import { defineNuxtConfig, NuxtConfig } from 'nuxt/config';
import { UserRoleType } from './bash-frontend-kit/types/models/UserRoleType';
import fontsPreload from './utils/fontsPreload';
import { NuxtPage } from '@nuxt/schema';

const isDev = process.env.NUXT_MODE === 'development';
const favicon = process.env.NUXT_SITE_FAVICON || 'favicon.svg';
const gtmId = process.env.NUXT_GTM_ID;

export default defineNuxtConfig({
  extends: './bash-frontend-kit',
  ssr: true,
  components: {
    global: true,
    dirs: ['~/components-global'],
  },
  modules: [
    '~/modules/device',
    'nuxt-schema-org',
  ],
  typescript: {
    strict: false,
  },
  css: [
    'bash-frontend-kit/assets/styles/main.scss',
    '/assets/styles/bash.scss',
  ],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['noindex'].includes(tag),
    },
  },
  dir: {},
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@import "@/bash-frontend-kit/assets/styles/global/elements.scss"; @import "@/bash-frontend-kit/assets/styles/global/adaptive.scss"; @import "@/bash-frontend-kit/assets/styles/global/helpers.scss";',
        },
      },
    },
  },
  app: {
    head: {
      title: process.env.NUXT_PUBLIC_SITE_NAME || 'BASH',
      meta: isDev ? [
        { hid: 'robots', name: 'robots', content: 'noindex, nofollow' },
        { hid: 'referrer', name: 'referrer', content: 'unsafe-url' },
      ] : [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { hid: 'theme-color', name: 'theme-color', content: '#FFFFFF' },
        { hid: 'referrer', name: 'referrer', content: 'unsafe-url' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `/${favicon}` },
        ...fontsPreload,
      ],
      noscript: [
        `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
      ],
    },
  },
  experimental: {
    asyncEntry: false,
  },
  runtimeConfig: {
    public: {

    },
  },
  hooks: {
    ready({ options }) {
      const _isDev = process.env.NUXT_MODE === 'development';
      if (process.env.NODE_ENV === 'production') {
        if (JSON.stringify(options.app.head).includes('robots') !== _isDev) {
          throw 'nuxt.config robots';
        }
        if (_isDev !== isDev) {
          throw 'nuxt.config isDev';
        }
        const _isDevApi = process.env.NUXT_API_BASE_URL.includes('apicrm');
        if (isDev !== _isDevApi) {
          throw 'nuxt.config isDevApi';
        }
      }
    },

    'pages:extend' (pages: NuxtPage[]) {
      const mpName = process.env.NUXT_ROUTES_MP_NAME;
      replaceRoute(pages, '/marketplace-:city()/:filters(.*)*', 'marketplace', mpName);

      const spacePageName = process.env.NUXT_ROUTES_SPACE_PAGE_NAME;
      replaceRoute(pages, '/platforms/:id()', 'platforms', spacePageName);
    }

  },
} as NuxtConfig);


function replaceRoute(pages: NuxtPage[], oldPath: string, nameOld: string, nameNew: string) {
  if(nameNew) {
    const newPath = oldPath.replace(nameOld, nameNew);
    const pageOld = pages.find(({path}) => path === oldPath);
    pages[pages.indexOf(pageOld)].path = newPath;
  }
}
