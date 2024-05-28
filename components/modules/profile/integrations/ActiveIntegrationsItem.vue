<template>
  <div
    class="ActiveIntegrationsItem"
    @click="remove"
  >
    <div
      class="ActiveIntegrationsItem__icon"
      :style="{ 'background-image': toUrlCss(integration.bigIcon) }"
    />
    <div class="ActiveIntegrationsItem__content">
      <div class="ActiveIntegrationsItem__title">{{ integration.name }}</div>
      <div class="ActiveIntegrationsItem__subtitle">
        {{ account }}
      </div>
    </div>
    <div
      v-if="removeModal"
      class="ActiveIntegrationsItem__mobile-modal"
    >
      <div
        v-click-outside="close"
        class="ActiveIntegrationsItem__mobile-modal--content"
        @click="emit('remove')"
      >
        <div
          class="ActiveIntegrationsItem__remove-icon"
          @click="remove"
          v-html="RemoveIcon"
        />
        <span>Удалить интеграцию с {{ integration.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useMedia} from '~/bash-frontend-kit/composables/useMedia';
import {computed, ref} from '#imports';
import RemoveIcon from '~/bash-frontend-kit/icons/basket.svg';
import toUrlCss from '~/bash-frontend-kit/utils/format/toUrlCss';

const props = defineProps({
  integration: Object,
  value: {},
});

const account = computed(() => {
  return props.value?.username || props.value?.email || props.value;
});

const emit = defineEmits<{
  (e: 'remove'): void;
}>();

const media = useMedia();
const isMobile = media.md;
const removeModal = ref(false);

function remove() {
  if (isMobile) removeModal.value = true;
  else emit('remove');
}

function close() {
  removeModal.value = false;
}
</script>

<style lang="scss">
.ActiveIntegrationsItem {
  display: flex;
  cursor: pointer;

  &:hover {
    .ActiveIntegrationsItem__icon {
      background-image: url('~/bash-frontend-kit/icons/delete-int.svg') !important;
    }
  }

  & + & {
    margin-top: 25px;
  }

  &__mobile-modal {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    align-items: flex-end;
    z-index: var(--z-index-base);

    background: var(--full-darkening);

    &--content {
      display: flex;
      align-items: center;
      position: relative;
      box-shadow: -22px 1px 44px rgba(228, 228, 234, 0.65);
      border-radius: 28px 28px 0 0;
      background: #ffffff;
      padding: 42px 40px 30px 40px;
      width: 100%;

      &:before {
        content: '';
        position: absolute;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 5px;
        background: #f5f6fa;
        border-radius: 10px;
      }
    }
  }

  &__remove-icon {
    margin-right: 10px;

    &:hover {
      svg {
        path {
          stroke: #3c3c3c;
        }
      }
    }
  }

  &__icon {
    width: 35px;
    height: 43px;
    background-position: center;
    background-repeat: no-repeat;
  }

  &__content {
    margin-left: 11px;
  }

  &__subtitle {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #b4bbc6;
  }
}
</style>
