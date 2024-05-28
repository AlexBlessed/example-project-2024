import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';

export default defineNuxtModule<null>({
  setup() {
    const resolver = createResolver(import.meta.url);
    addPlugin({
      src: resolver.resolve('./plugin'),
      mode: 'server',
    });
  },
});
