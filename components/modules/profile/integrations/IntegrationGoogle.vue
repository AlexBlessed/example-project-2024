<template>
  <IntegrationsStep2>
    <template #default>
      Для подключения нажмите на кнопку «Подключить» Для подключения
      <br /><br />
      <a
        class="link"
        href="https://welcome.bash.today/how_to_attach_calendar"
        target="_blank"
      >
        Как подключить Google-календарь?
      </a>
    </template>
    <template #actions>
      <a
        :href="url"
        target="_blank"
      >
        <BaseButton md-large>Подключить</BaseButton>
      </a>
    </template>
  </IntegrationsStep2>
</template>

<script lang="ts" setup>
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import IntegrationsStep2 from '~/bash-frontend-kit/components/modules/profile/integrations/IntegrationsStep2.vue';
import {useHttp} from '~/bash-frontend-kit/composables/useHttp';

const http = useHttp();
const { bot, message, url } = await http.get('/bind/google');

const props = defineProps({
  integration: Object,
});
</script>
