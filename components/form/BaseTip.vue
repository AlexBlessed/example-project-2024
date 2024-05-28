<template>
  <div class="BaseTip">
    <div
      class="BaseTip__icon"
      v-html="InfoIcon"
    />
    <div
      class="BaseTip__text"
      :style="{ 'max-width': maxWidth && `${maxWidth}px` }"
    >
      <div v-html="tooltip" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import InfoIcon from '~/bash-frontend-kit/icons/info.svg?raw';

defineProps<{
  tooltip: string;
  maxWidth?: number;
}>();
</script>

<style lang="scss">
.BaseTip {
  position: relative;

  &:hover {
    .BaseTip__text {
      display: flex;
    }
  }

  &__text {
    position: absolute;
    bottom: calc(100% + 24px);
    left: -30px;
    z-index: 88888;

    font-family: var(--mainFontFamaly);
    color: #3b4453;
    font-weight: 400;
    font-size: 16px;
    line-height: 23px;

    padding: 15px 25px;
    box-shadow: 0px 3px 40px rgba(225, 225, 235, 0.5);
    border-radius: 13px;
    background: #ffffff;

    max-width: 410px;
    min-width: 200px;
    width: max-content;
    display: none;

    @include mobile {
      max-width: 80vw !important;
      left: -200px;
    }

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 44px;
      width: 16px;
      height: 10px;

      background-image: url('@/bash-frontend-kit/icons/tooltip-tail.svg');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: top center;

      @include mobile {
        right: 70px;
        left: unset;
      }
    }
  }

  &__icon {
    display: flex;

    margin-top: 2px;
    margin-left: 10px;
    height: 24px;
    cursor: pointer;

    &:hover {
      svg {
        path {
          fill: #3b4453;
        }
      }
    }
  }
}
</style>
