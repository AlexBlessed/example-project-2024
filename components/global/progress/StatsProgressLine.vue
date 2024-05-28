<template>
  <div
    class="StatsProgressLine"
    :class="{
    'StatsProgressLine--contrast': contrast,
    'StatsProgressLine--decrease': decreasing,
    }"
  >
    <div class="StatsProgressLine__progress StatsProgressLine__progress--total" />
    <div
      class="StatsProgressLine__progress StatsProgressLine__progress--from"
      :style="getProgressSizeStyle(from)"
      :title="`${from}%`"
    />
    <div
      class="StatsProgressLine__progress StatsProgressLine__progress--to"
      :style="getProgressSizeStyle(to)"
      :title="`${to}%`"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  from: number;
  to: number;
  decreasing: boolean;
  contrast?: boolean;
}>();

function getProgressSizeStyle(size) {
  return {
    width: `${Math.min(size, 100)}%`
  };
}
</script>

<style lang="scss">
.StatsProgressLine {
  position: relative;

  &--decrease & {
    &__difference-percent {
      background: rgba(#FF7739, 0.1);
      color: #FF7739;
    }

    &__progress {
      &--to {
        background: #FF7739;
      }

      &--from {
        background: #FFCFB9;
      }
    }
  }

  &--contrast & {
    &__progress {
      height: 8px;

      &--to {
        background: var(--bg);
      }

      &--from {
        background: rgba(#FFFFFF, 0.6);
      }

      &--total {
        background: rgba(#FFFFFF, 0.3);
      }
    }
  }

  &__progress {
    height: 6px;
    border-radius: 12px;

    &--total {
      width: 100%;
      background: #F3F5F9;
    }

    &--from {
      position: absolute;
      top: 0;
      left: 0;

      background: rgba(#3B4453, 0.6);
    }

    &--to {
      position: absolute;
      top: 0;
      left: 0;

      background: #3B4453;
    }
  }
}
</style>
