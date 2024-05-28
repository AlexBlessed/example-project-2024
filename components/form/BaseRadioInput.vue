<template>
  <BaseCheckbox
    class="BaseRadioInput"
    round
    :model-value="checked"
    @update:modelValue="toggle"
  >
    <slot />
  </BaseCheckbox>
</template>

<script setup lang="ts">
import BaseCheckbox from '~/bash-frontend-kit/components/form/BaseCheckbox.vue';

const props = defineProps<{
  modelValue: any;
  value: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any);
}>();

const checked = computed(() => props.modelValue === props.value);

function toggle() {
  const value = checked.value ? null : props.value;
  emit('update:modelValue', value);
}
</script>

<style lang="scss">
.BaseRadioInput {
}
</style>
