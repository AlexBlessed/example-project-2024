<template>
  <div
    class="BaseBadge"
    :class="{
    'BaseBadge--danger': danger,
    'BaseBadge--primary': primary,
    'BaseBadge--small': small,
    'BaseBadge--bordered': bordered,
  }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  danger?: boolean;
  primary?: boolean;
  bordered?: boolean;
  small?: boolean;
}>();
</script>

<style lang="scss">
.BaseBadge {
  padding: 3px 10px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 700;
  line-height: 23px;

  &--danger {
    color: #f35f48;
    background: #f35f481f;
  }

  &--primary {
    color: #FFFFFF;
    background: #FF7739;
  }

  &--small {
    font-size: 14px;
    font-weight: 800;
    line-height: 10px;
    padding: 5px 8px;
  }

  &--bordered {
    border: 1px solid var(--text);
    background: #f35f481f;
    background: none;
    border-radius: 6px;
  }

  &--bordered#{&}--primary {
    border-color: var(--primary);
    color: var(--primary);
  }
}
</style>
