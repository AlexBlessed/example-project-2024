<template>
  <div
    class="BaseSelectPlaceholder"
    :class="{ 'BaseSelectPlaceholder--opened': modelValue }"
    @click="toggle"
  >
    <slot>{{ text }}</slot>
    <div
      v-if="count"
      class="BaseSelectPlaceholder__count"
    >
      {{ count }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean;
  text?: string;
  count?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', status: boolean);
}>();

function toggle() {
  emit('update:modelValue', !props.modelValue);
}
</script>

<style lang="scss">
.BaseSelectPlaceholder {
  position: relative;
  padding-right: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &--opened {
    &::after {
      transform: rotate(180deg) translateY(50%) !important;
    }
  }

  &__count {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 5px;

    background: #ff7739;
    border-radius: 50%;

    font-weight: 700;
    font-size: 12px;
    line-height: 122.34%;
    color: #ffffff;
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    width: 8px;
    height: 5px;
    transform: translateY(-50%);

    background-image: url('~/bash-frontend-kit/icons/arrow-hide.svg');
    background-repeat: no-repeat;

    transition: transform $transition;
  }

  &--dropdown-opened::after {
    transform: rotate(180deg) translateY(50%) !important;
  }
}
</style>
