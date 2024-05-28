<template>
  <div class="BaseColorPicker">
    <label
      class="BaseColorPicker__color"
      :style="style"
    >
      <input
        class="BaseColorPicker__input"
        type="color"
        @change="onChange"
      />
    </label>
  </div>
</template>

<script setup lang="ts">


const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

function onChange(e) {
  emit('update:modelValue', e.target.value);
}

const style = computed(() => ({
  backgroundColor: props.modelValue,
}));
</script>

<style lang="scss">
.BaseColorPicker {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;

  &__color {
    display: block;
    width: 35px;
    height: 15px;

    background: #5984d8;
    border: 1px solid #edeef4;
    border-radius: 25px;

    cursor: pointer;
  }

  &__input {
    width: 0;
    height: 0;
    position: absolute;
    opacity: 0;
  }
}
</style>
