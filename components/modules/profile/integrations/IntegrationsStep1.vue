<template>
  <div class="IntegrationsStep1">
    <IntegrationsItem
      v-for="item in integrations"
      checkbox
      class="IntegrationsContent__item"
      :integration="item"
      :active="item.alias === activeIntegration.alias"
      @change="emit('setActive', item)"
    />
  </div>
</template>

<script lang="ts" setup>
import IntegrationsItem from '~/bash-frontend-kit/components/modules/profile/integrations/IntegrationsItem.vue';

defineProps({
  integrations: Array,
  activeIntegration: Object,
});

const emit = defineEmits<{
  (e: 'setActive', value: number): void;
}>();
</script>

<style lang="scss">
.IntegrationsStep1 {
}
</style>
