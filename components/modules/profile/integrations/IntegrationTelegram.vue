<template>
  <IntegrationsStep2>
    <template #default>
      <div>
        Для подключения нажмите на кнопку «Подключить» Можно добавлять
        неограниченное количество аккаунтов.
      </div>
      <div>
        Если ссылка не открывается, откройте Telegram, найдите в нем бота
        <a
          :href="linkBot"
          target="_blank"
        >
          @{{ bot }}
        </a>
        и напишите:
      </div>
      <BaseInput
        :model-value="message"
        readonly
        copy
      />
    </template>
    <template #actions>
      <a
        :href="url"
        target="_blank"
      >
        <BaseButton md-large> Подключить</BaseButton>
      </a>
    </template>
  </IntegrationsStep2>
</template>

<script lang="ts" setup>
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import { computed } from '#imports';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import IntegrationsStep2 from '~/bash-frontend-kit/components/modules/profile/integrations/IntegrationsStep2.vue';
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';

const http = useHttp();
const { bot, message, url } = await http.get('/bind/telegram');

const props = defineProps({
  integration: Object,
});

const linkBot = computed(() => `//t.me/${bot}`);
</script>
