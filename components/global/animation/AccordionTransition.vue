<template>
  <Transition
    name="AccordionTransition--transition"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
  >
    <div
      v-if="opened"
      class="AccordionTransition"
    >
      <slot />
    </div>
  </Transition>
</template>

<script lang="ts" setup>
defineProps<{
  opened?: boolean;
}>();

function enter(element) {
  element.style.visibility = 'hidden';
  element.style.height = 'auto';

  const { height } = getComputedStyle(element);

  element.style.visibility = null;
  element.style.height = 0;

  getComputedStyle(element).height;
  requestAnimationFrame(() => {
    element.style.height = height;
  });
}

function afterEnter(element) {
  element.style.height = 'auto';
}

function leave(element) {
  const { height } = getComputedStyle(element);
  element.style.height = height;

  getComputedStyle(element).height;
  requestAnimationFrame(() => {
    element.style.height = 0;
  });
}
</script>

<style lang="scss">
.AccordionTransition {
  &--transition {
    &-enter-active,
    &-leave-active {
      overflow: hidden;

      transition: $transition-slow;
      transition-property: height, opacity;
    }

    &-enter-from,
    &-leave-to {
      height: 0;
      opacity: 0;
    }
  }
}
</style>
