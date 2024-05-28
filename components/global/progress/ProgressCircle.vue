<template>
  <div
    class="ProgressCircle"
    :class="{
      'ProgressCircle--animated': animated,
      'ProgressCircle--selected': selected,
    }"
  >
    <svg
      class="ProgressCircle__svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
    >
      <circle
        class="ProgressCircle__main-circle"
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke="#F5F6FA"
        stroke-width="4"
      />
      <circle
        class="ProgressCircle__progress-circle"
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke="#FF7739"
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
    <div
      v-if="$slots.default"
      class="ProgressCircle__content"
    >
      <slot />
    </div>
    <div class="ProgressCircle__tip">
      {{ tipText }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { clampNumber } from '~/bash-frontend-kit/utils/data/number/clampNumber';
import { computed } from '#imports';
import declension from '~/bash-frontend-kit/utils/declension';

const props = defineProps<{
  progress: number; // 0 - 100
  count: number; // h
  max: number; // h
  animated: boolean;
  selected?: boolean;
}>();

const progress = computed(() => {
  return 100 - clampNumber(props.progress || 0, 0, 100);
});

const tipText = computed(() => {
  let text = declension.hours(props.count);
  if (props.progress >= 100) return 'Всё занято';
  else if (props.progress <= 0) return 'Всё свободно';
  else {
    return `Занято ${text}`;
  }
});
</script>

<style lang="scss">
.ProgressCircle {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  &--animated & {
    &__progress-circle {
      transition: stroke-dashoffset $transition-slow;
    }
  }

  &__tip {
    display: none;

    position: absolute;
    bottom: calc(100% + 23px);
    left: -28px;
    z-index: 999;

    border-radius: 13px;
    background: #ffffff;
    box-shadow: 0 3px 40px 0 rgba(225, 225, 235, 0.5);
    padding: 15px 30px 17px 25px;

    white-space: nowrap;
    color: #3b4453;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 38px;
      width: 16px;
      height: 10px;

      background-image: url('@/bash-frontend-kit/icons/tooltip-tail.svg');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: top center;
    }
  }

  &:focus-within::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 23px;
    height: 23px;
    border-radius: 50%;
    background: #ff7739;
  }

  &:hover:after {
    content: '';
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #ff7739;
  }

  &--selected::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 23px;
    height: 23px;
    border-radius: 50%;
    background: #ff7739;
  }

  &--selected & {
    &__content {
      color: #ffffff;
    }
  }

  &:hover {
    .ProgressCircle__main-circle {
      stroke: #edeef4;
    }

    .ProgressCircle__content {
      color: #000000;
    }

    .ProgressCircle__tip {
      display: block;
    }
  }

  &__svg {
    transform: rotate(-90deg);
  }

  &__progress-circle {
    stroke-dasharray: 100;
    stroke-dashoffset: v-bind(progress);
  }

  &__content {
    position: absolute;
    z-index: 1;
  }
}
</style>
