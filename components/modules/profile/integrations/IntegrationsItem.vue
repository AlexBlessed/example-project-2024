<template>
  <label
    class="IntegrationsItem"
    :class="{ 'IntegrationsItem--checkbox': checkbox }"
  >
    <BaseCheckbox
      v-if="checkbox"
      v-model="model"
      round
      class="IntegrationsItem__checkbox"
    />
    <div class="IntegrationsItem__icon">
      <img
        :src="integration.icon"
        alt=""
      />
    </div>
    <div class="IntegrationsItem__title">{{ integration.title }}</div>
  </label>
</template>

<script lang="ts" setup>
import BaseCheckbox from '~/bash-frontend-kit/components/form/BaseCheckbox.vue';

const props = defineProps({
  integration: Object,
  checkbox: Boolean,
  active: Boolean,
});

const emit = defineEmits<{
  (e: 'change', value: boolean): void;
}>();

const model = computed({
  get: () => props.active,
  set: (val) => emit('change', val),
});
</script>

<style lang="scss">
.IntegrationsItem {
  display: flex;
  cursor: pointer;

  &__icon {
    width: 20px;
  }

  &--checkbox .IntegrationsItem__title {
    margin-left: 10px;
  }

  &__checkbox {
    margin-right: 22px;
  }

  & + & {
    margin-top: 10px;
  }

  &__title {
    margin-left: 16px;
  }
}
</style>
