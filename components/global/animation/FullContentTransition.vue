<template>
  <div
    class="FullContentTransition"
    :class="{
      'FullContentTransition--hide': lines && lineHide,
    }"
  >
    <div
      ref="el"
      class="FullContentTransition__content"
    >
      <slot />
    </div>
    <slot v-if="isOverflow" name="more" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from '#imports';

const props = defineProps<{
  opened: boolean;
  height: number;
  lines?: number;
}>();

const el = ref(null);
const lineHide = ref(!props.opened);
const height = ref(!props.opened && props.height);
const heightCss = computed(() =>
  height.value ? `${height.value}px` : 'unset',
);
const isOverflow = ref(false);

watch(
  () => props.opened,
  (opened) => {
    if (opened) {
      lineHide.value = false;
    }
    height.value = opened ? el.value?.scrollHeight : props.height;
  },
);

function handleTransitionEnd() {
  if (!props.opened) {
    lineHide.value = true;
  }
}

onMounted(() => {
  el.value.addEventListener('transitionend', handleTransitionEnd);
  isOverflow.value = el.value?.scrollHeight > props.height + 12;
});
onBeforeUnmount(() => {
  el.value.removeEventListener('transitionend', handleTransitionEnd);
});
</script>

<style lang="scss">
.FullContentTransition {

  &__content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    max-height: v-bind(heightCss);
    overflow: hidden;
    transition: $transition-slow max-height;
  }

  &--hide &__content {
    -webkit-line-clamp: v-bind(lines);
  }
}
</style>
