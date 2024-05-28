<template>
  <div
    class="BaseToggle"
    @click="toggle"
  >
    <div
      class="BaseToggle__body"
      :class="{
        'BaseToggle__body--active': modelActive,
        'BaseToggle__body--disabled': disabled,
      }"
    >
      <div class="BaseToggle__button" />
    </div>
    <div
      v-if="label"
      class="BaseToggle__label"
    >
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">


const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: String,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

function toggle() {
  modelActive.value = !modelActive.value;
}

const modelActive = computed({
  get: () => props.modelValue,
  set: (val) => {
    if (!props.disabled) {
      emit('update:modelValue', val);
    }
  },
});
</script>

<style lang="scss">
.BaseToggle {
  display: flex;
  cursor: pointer;

  &__body {
    width: 35px;
    height: 20px;
    padding: 2px;

    background: var(--border-light-color);
    border-radius: 18px;

    transition: background-color $transition;

    &--disabled {
      cursor: default;
    }

    &--active {
      background: #ff7739;

      .BaseToggle__button {
        margin-left: 15px;
      }
    }
  }

  &__label {
    margin-left: 10px;
  }

  &__button {
    width: 16px;
    height: 16px;

    background: #ffffff;
    border-radius: 18px;

    transition: margin-left $transition;
  }
}
</style>
