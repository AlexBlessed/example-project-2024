<template>
  <div
    v-if="priority || $slots.default"
    class="BadgePriority"
    :class="{ 'BadgePriority--empty': !priority }"
    :style="styleObj"
  >
    <slot :color="colorText">
      <span>{{ priority.text }}</span>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { PriorityTask } from '~/bash-frontend-kit/types/models/Task';
import { computed } from '#imports';

const props = defineProps<{
  priority: PriorityTask;
}>();

const colorText = computed(() => props.priority?.style?.color);

const styleObj = computed(() => {
  if (props.priority) {
    return {
      color: colorText.value,
      background: props.priority.style.backgroundColor,
    };
  }
});
</script>

<style lang="scss">
.BadgePriority {
  min-width: 89px;
  max-width: 100px;
  border-radius: 5px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;
  font-size: 14px;
  line-height: 26px;
  font-family: var(--mainFontFamaly);

  &--empty {
    font-size: 16px;
    font-weight: 400;
    justify-content: flex-start;
    min-width: 0;
  }
}
</style>
