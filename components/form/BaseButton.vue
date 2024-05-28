<template>
  <button
    class="BaseButton"
    :disabled="disabled"
    :type="type"
    :class="{
      'BaseButton--white': white,
      'BaseButton--gray': gray,
      'BaseButton--bordered': bordered,
      'BaseButton--transparent': transparent,
      'BaseButton--slim': slim,
      'BaseButton--low': low,
      'BaseButton--dotted': dotted,
      'BaseButton--dotted-orange': dottedOrange,
      'BaseButton--mdSlim': mdSlim,
      'BaseButton--mdLarge': mdLarge,
      'BaseButton--large': large,
      'BaseButton--remove': remove,
      'BaseButton--loading': debouncedLoading,
      'BaseButton--square': square,
      'BaseButton--for-map': forMap,
      'BaseButton--fullWidth': fullWidth,
    }"
    @click="onClick"
  >
    <span class="BaseButton__content">
      <TransitionGroup name="BaseButton__text-transition">
        <span
          v-if="!debouncedLoading"
          class="BaseButton__text"
        >
          <slot />
        </span>
      </TransitionGroup>
      <Transition name="BaseButton__loading-transition">
        <ShortLoading
          v-if="debouncedLoading"
          class="BaseButton__loading"
          :dark="dotted"
          :primary="transparent || remove"
        />
      </Transition>
    </span>
  </button>
</template>

<script setup lang="ts">
import ShortLoading from '~/bash-frontend-kit/components/global/ShortLoading.vue';

const props = defineProps({
  disabled: Boolean,
  loading: Boolean,
  loadingThrottle: {
    type: Number,
    default: 1875,
  },
  white: Boolean,
  gray: Boolean,
  bordered: Boolean,
  transparent: Boolean,
  slim: Boolean,
  mdSlim: Boolean,
  mdLarge: Boolean,
  large: Boolean,
  low: Boolean,
  remove: Boolean,
  dotted: Boolean,
  dottedOrange: Boolean,
  square: Boolean,
  forMap: Boolean,
  fullWidth: Boolean,
  type: String,
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();

function onClick() {
  if (!props.disabled && !debouncedLoading.value) {
    emit('click');
  }
}

let loadingAnimationTimeout = null;
const debouncedLoading = ref(props.loading);

watch(
  () => props.loading,
  (loading) => {
    if (loading) {
      debouncedLoading.value = true;
      clearTimeout(loadingAnimationTimeout);
      loadingAnimationTimeout = setTimeout(() => {
        loadingAnimationTimeout = null;
        if (!props.loading) {
          debouncedLoading.value = false;
        }
      }, props.loadingThrottle);
    } else if (!loadingAnimationTimeout) {
      debouncedLoading.value = false;
    }
  }
);

onUnmounted(() => {
  clearTimeout(loadingAnimationTimeout);
});
</script>

<style lang="scss">
.BaseButton {
  position: relative;
  z-index: 1;

  justify-content: center;
  align-items: center;
  display: flex;

  width: 100%;
  height: 50px;

  cursor: pointer;
  transition: width $transition-slow;

  &__content {
    position: relative;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    padding: 0 42px;

    transition: padding $transition-slow;
  }

  &__text {
    display: inline-flex;
    align-items: center;

    white-space: nowrap;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    color: #ffffff;

    transition: color $transition;
  }

  &::before {
    content: '';
    position: absolute;
    @include inset;
    z-index: -1;

    background: #ff7739;
    border-radius: 100px;

    transition: $transition;
  }

  &:not(:disabled, &--loading, &--square) {
    &:hover {
      &::before {
        right: -5px;
        left: -5px;
      }
    }

    &:active,
    &:focus {
      &::before {
        background: #ff6c29;
      }
    }
  }

  &:disabled {
    cursor: default;

    .BaseButton__text {
      color: #a5aabe;
    }

    &::before {
      background: #f5f6fa;
      border-color: #f5f6fa;
    }
  }

  &--fullWidth {
    width: 100% !important;
  }

  &--loading {
    width: 50px;
    min-width: 50px;
    cursor: default;

    .BaseButton__content {
      padding: 0;
    }

    &::before {
      background: #ff6c29;
    }
  }

  &--slim {
    width: fit-content;

    .BaseButton__content {
      padding: 0 18px;
    }
  }

  &--low {
    height: 45px;
  }

  &--transparent {
    width: fit-content;
    height: 30px;

    .BaseButton__content {
      padding: 0 10px;

      @include mobile {
        padding: 0 10px;
      }
    }

    &::before {
      border: none;
      background: none !important;
    }

    .BaseButton__text {
      color: #b4bbc6;
    }
  }

  &--dotted-orange {
    .BaseButton__text {
      color: #ff7739;
    }

    &::before {
      border: 2px dotted rgba(255, 119, 57, 0.4);
      border-radius: 13px;
      background: transparent !important;
    }

    &:hover {
      &::before {
        border-color: rgba(255, 119, 57, 0.8);
      }
    }
  }

  &--dotted {
    .BaseButton__text {
      color: #a5aabe;
    }

    &::before {
      border: 2px dotted rgba(180, 187, 198, 0.4);
      border-radius: 13px;
      background: transparent !important;
    }

    &:hover {
      &::before {
        border-color: rgba(180, 187, 198, 0.8);
      }
    }
  }

  &--for-map {

    .BaseButton {
      &__text {
        font-size: 16px;
        font-weight: 700;
        line-height: 20px;
        color: #3b4453;
      }

      &__content {
        padding: 7px 54px;
      }
    }

    &:active,
    &:focus {
      &::before {
        background: #ffffff !important;

        @include mobile {
          background: none !important;
        }
      }
    }

    &::before {
      background: #ffffff;
      box-shadow: 0 14px 42px -7px rgba(228, 228, 234, 0.4);
      border-radius: 13px;

      @include mobile {
        background: none;
      }
    }
  }

  &--square {
    height: auto;

    .BaseButton {
      &__text {
        font-weight: 700;
        font-size: 14px;
        line-height: 20px;
        color: #3b4453;
      }

      &__content {
        padding: 7px 14px;
      }
    }

    &:hover {
      .BaseButton__text {
        color: #ffffff;
      }

      &::before {
        background: #ff7739;
      }
    }

    &::before {
      background: #ffffff;
      box-shadow: 0 14px 42px -7px rgba(228, 228, 234, 0.4);
      border-radius: 5px;
    }
  }

  &--mdSlim {
    width: fit-content;

    @include mobile {
      width: 100%;
    }

    .BaseButton__content {
      padding: 0 28px;

      @include mobile {
        padding: 0 22px;
      }
    }
  }

  &--mdLarge {
    width: fit-content;

    @include mobile {
      width: 100%;
    }

    .BaseButton__content {
      padding: 0 42px;

      @include mobile {
        padding: 0 30px;
      }
    }
  }

  &--large {
    width: fit-content;

    @include mobile {
      width: 100%;
    }

    .BaseButton__content {
      padding: 0 68px;

      @include mobile {
        padding: 0 42px;
      }
    }
  }

  &--remove {
    .BaseButton__text {
      color: #ff7739;
    }

    &::before {
      background: transparent !important;
      border: 2px solid #ff7739;
    }

    &:active,
    &:focus {
      &::before {
        border-color: #ff7739;
      }
    }

    &:hover::before {
      background: #e5e5e5;
    }
  }

  &--white {
    .BaseButton__text {
      color: #b4bbc6;
    }

    &::before {
      border: 1px solid var(--border-light-color);
      background: var(--bg-secondary) !important;
    }

    &:active,
    &:focus {
      &::before {
        border-color: #a5aabe80;
      }
    }

    &:hover::before {
      background: #e5e5e5;
    }
  }

  &--gray {
    .BaseButton__text {
      color: #b4bbc6;
    }

    &::before {
      border: 1px solid #e2e4ec;
      background: transparent !important;
    }
  }

  &--bordered {
    .BaseButton__text {
      color: var(--text);
    }

    &::before {
      border: 1px solid var(--border-color);
      background: transparent !important;
    }
  }

  &__loading {
    position: absolute;
  }

  img {
    margin-right: 10px;
  }

  &__loading,
  &__text {
    &-transition {
      &-enter-active,
      &-leave-active {
        transition: $transition-slow;
      }

      &-enter-from,
      &-leave-to {
        opacity: 0;
      }

      &-enter-from {
        transform: translateY(-40px);
      }

      &-leave-to {
        opacity: 0;
        transform: translateY(40px);
      }
    }
  }
}
</style>
