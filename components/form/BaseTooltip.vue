<template>
  <div
    class="BaseTooltip"
    :class="{
      'BaseTooltip--disabled': disabled,
      'BaseTooltip--solid': solid,
      'BaseTooltip--active': opened || openedPermanent,
      'BaseTooltip--right': right,
      'BaseTooltip--bottom': bottom,
      'BaseTooltip--center': center,
      'BaseTooltip--mobile-center': mobileCenter,
      'BaseTooltip--opened-permanent': openedPermanent,
    }"
  >
    <div
      v-if="!openedPermanent"
      class="BaseTooltip__icon"
    >
      <slot name="icon">
        <span
          class="BaseTooltip__icon-holder"
          v-html="solid ? TooltipSolidIcon : TooltipIcon"
        />
      </slot>
    </div>
    <div
      v-if="!disabled"
      class="BaseTooltip__content"
    >
      <div class="BaseTooltip__content-body">
        <slot>
          <div v-html="tooltip" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TooltipIcon from '~/bash-frontend-kit/icons/tooltip.svg?raw';
import TooltipSolidIcon from '~/bash-frontend-kit/icons/tooltip-solid.svg?raw';
import { useToggle } from '~/bash-frontend-kit/composables/form/useToggle';

defineProps<{
  tooltip?: string;
  disabled?: boolean;
  solid?: boolean;
  right?: boolean;
  bottom?: boolean;
  center?: boolean;
  mobileCenter?: boolean;
  openedPermanent?: boolean;
}>();

const [opened, toggle, close] = useToggle();
</script>

<style lang="scss">
.BaseTooltip {
  position: relative;

  &:not(:hover) &__content {
    display: none;
  }

  &--opened-permanent &__content {
    display: block !important;
  }

  &--disabled & {
    &__icon {
      cursor: default;
    }
  }

  &__icon {
    display: flex;
    flex-shrink: 0;
    cursor: pointer;
  }

  &__icon-holder {
    display: flex;
  }

  &__content {
    position: absolute;
    bottom: 100%;
    right: -12px;
    z-index: var(--z-index-dropdown);

    max-width: min(640px, 90vw);
    width: max-content;
    margin-bottom: 14px;

    background: #ffffff;
    box-shadow: 5px 0 44px rgba(228, 228, 234, 0.4);
    border-radius: 20px;
    color: #3b4453;

    img {
      max-width: 100%;
    }

    &::before {
      content: '';
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      height: 40px;
    }

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      right: 16px;

      width: 16px;
      height: 10px;

      background-image: url('~/bash-frontend-kit/icons/tooltip-tail.svg');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: top center;
    }
  }

  &__content-body {
    width: fit-content;
    padding: 24px;

    @include mobile {
      max-width: 85vw;
      overflow-x: auto;
    }
  }

  &--right &__content {
    right: unset;
    left: -12px;

    &::after {
      right: unset;
      left: 26px;
    }
  }

  &--bottom &__content {
    top: 100%;
    bottom: unset;
    left: -22px;
    margin-top: 16px;

    &::after {
      bottom: 100%;
      top: unset;

      transform: rotate(180deg);
    }
  }

  @mixin centerContent {
    right: unset;
    left: 50%;
    transform: translateX(-50%);

    &::after {
      right: unset;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &--center &__content {
    @include centerContent;
  }
}
</style>
