<template>
  <div
    class="FormGroupLabel"
    :class="{ 'FormGroupLabel--grid': grid }"
  >
    <div
      v-if="label"
      class="FormGroupLabel__header"
    >
      <div class="FormGroupLabel__label">
        {{ label }}
      </div>
      <div class="FormGroupLabel__tooltip">
        <BaseTooltip
          v-if="$slots.tooltip || tooltip"
          :tooltip="tooltip"
        >
          <slot name="tooltip" />
        </BaseTooltip>
      </div>
    </div>
    <div class="FormGroupLabel__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseTooltip from '~/bash-frontend-kit/components/form/BaseTooltip.vue';

defineProps<{
  label?: string;
  tooltip?: string;
  grid?: boolean;
}>();
</script>

<style lang="scss">
.FormGroupLabel {
  &--grid & {
    &__body {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 25px;

      > * {
        min-width: 0;
      }
    }
  }

  &__body {
  }

  &__header {
    position: relative;

    display: flex;
    align-items: center;

    margin-bottom: 24px;
  }

  &__label {
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #b4bbc6;
  }

  &__tooltip {
    margin-left: 6px;

    .BaseTooltip {
      position: static;
      transform: none;

      &__content {
        right: unset;
        left: 0;

        @include mobile {
          max-width: 90vw;
          left: 50%;
          right: unset;
          transform: translateX(-50%);
        }

        &::after {
          right: unset;
          left: 103px;
        }
      }
    }
  }
}
</style>
