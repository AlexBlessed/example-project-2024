<template>
  <div
    class="TabSwitch"
    :class="{'TabSwitch--buttons-view': buttonsView}"
  >
    <div class="TabSwitch__list">
      <div
        v-for="({ title, value }, index) in tabs"
        :key="index"
        class="TabSwitch__tab"
        :class="{ 'TabSwitch__tab--active': modelValue === value }"
        @click="select(value)"
      >
        {{ title }}
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: any;
  tabs: { title: string; value: any }[];
  buttonsView?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

function select(value) {
  emit('update:modelValue', value);
}
</script>

<style lang="scss">
.TabSwitch {
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #edeef4;

  &--buttons-view {
    border: none;

    .TabSwitch__tab {
      padding: 9px 16px;
      margin: 0 !important;

      color: var(--text) !important;
      border-radius: 13px;

      &--active {
        background: var(--secondary-hover);
        font-weight: 700;
      }

      &::after {
        content: none  !important;
      }
    }
  }

  &__list {
    display: flex;
    align-items: center;

    overflow-x: auto;
  }

  &__tab {
    position: relative;
    padding: 14px 0;

    flex-shrink: 0;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: var(--text);

    cursor: pointer;

    &:hover {
      color: black;
    }

    &--active {
      color: black;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;

        border-top: 3px solid #3b4453;
      }
    }

    & + & {
      margin-left: 27px;

      @include mobile {
        margin-left: 25px;
      }
    }
  }
}
</style>
