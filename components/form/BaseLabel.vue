<template>
  <label
    class="BaseLabel"
    :class="{
      'BaseLabel--gray': gray,
      'BaseLabel--inline': inline,
      'BaseLabel--focus-disabled': focusDisabled | disabled | readonly,
    }"
  >
    <span
      class="BaseLabel__placeholder"
      :class="{
        'BaseLabel__placeholder--show': value && label,
      }"
    >
      {{ label }}
    </span>
    <slot />
  </label>
</template>

<script setup lang="ts">
defineProps({
  label: String,
  value: {},
  readonly: Boolean,
  disabled: Boolean,
  gray: Boolean,
  inline: Boolean,
  focusDisabled: Boolean,
});
</script>

<style lang="scss">
.BaseLabel {
  display: flex;
  flex-direction: column;
  position: relative;

  &--gray {
    .BaseLabel__label {
      font-family: var(--mainFontFamaly);
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #a5aabe;
    }
  }

  &__placeholder {
    display: none;
    position: absolute;
    left: 16px;
    top: -7px;

    font-weight: 400;
    font-size: 14px;
    line-height: 1;
    color: #a5aabe;
    background: var(--bg-secondary);

    padding: 0 4px;
    overflow: hidden;
    z-index: 2;

    &--show {
      display: block;
    }
  }

  &:not(&--focus-disabled):focus-within &__placeholder {
    display: block;
  }

  &--inline {
    display: grid;
    grid-template-columns: 116px 1fr;
    grid-gap: 20px;
  }

  &__label {
    margin-bottom: 4px;
  }
}
</style>
