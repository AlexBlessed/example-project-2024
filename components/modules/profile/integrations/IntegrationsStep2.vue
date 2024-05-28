<template>
  <div class="IntegrationsStep2">
    <div class="IntegrationsStep2__content">
      <slot />
    </div>
    <div class="IntegrationsStep2__actions">
      <slot name="actions" />

      <BaseButton
        white
        md-slim
        @click="$emit('back')"
      >
        <img src="@/bash-frontend-kit/icons/left-arrow-gray.svg" />
        Назад
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';

const emit = defineEmits<{
  (e: 'back'): void;
}>();
</script>

<style lang="scss">
.IntegrationsStep2 {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  a {
    text-decoration: none;
  }

  &__content {
    > * {
      position: relative;
      margin-bottom: 15px;
    }
    a.link::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      margin-top: 1px;
      margin-left: 8px;
      background-image: url('~/bash-frontend-kit/icons/link-away.svg');
      background-repeat: no-repeat;
      cursor: pointer;
    }
  }

  &__actions {
    display: flex;
    margin-top: auto;
    text-align: center;

    > * + * {
      margin-left: 10px;

      @include mobile {
        margin-top: 20px;
        margin-left: 0;
      }
    }

    @include mobile {
      width: 100%;
      flex-direction: column;
    }
  }
}
</style>
