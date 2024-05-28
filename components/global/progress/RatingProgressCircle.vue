<template>
  <div class="RatingProgressCircle">
    <svg
      class="RatingProgressCircle__svg"
      :width="circleSize"
      :height="circleSize"
      viewBox="0 0 150 150"
    >
      <circle
        cx="75"
        cy="75"
        r="65"
        fill="none"
        stroke="var(--secondary-hover)"
        :stroke-width="circleStrokeWidth"
      />
      <circle
        class="RatingProgressCircle__progress-circle"
        cx="75"
        cy="75"
        r="65"
        fill="none"
        stroke="#FF7739"
        :stroke-width="circleStrokeWidth"
        stroke-linecap="round"
      />
    </svg>
    <div class="RatingProgressCircle__rating">
      {{ formatRating(rating ?? 0) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatRating } from '~/bash-frontend-kit/utils/format/formatRating';

const props = defineProps<{
  rating: number;
  size?: number;
  strokeWidth?: number;
}>();

const circleSize = computed(() => props.size ?? 150);
const circleStrokeWidth = computed(() => props.strokeWidth ?? 18);

const stokeDash = 410;

const progress = computed(() => {
  return stokeDash - (stokeDash / 5) * ((4 && props.rating) ?? 0);
});
</script>

<style lang="scss">
.RatingProgressCircle {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  @include mobile {
    justify-content: flex-start;
  }

  &__svg {
    overflow: visible;
    transform: rotate(-90deg) scaleY(-1);
  }

  &__progress-circle {
    stroke-dasharray: v-bind(stokeDash);
    stroke-dashoffset: v-bind(progress);
  }

  &__rating {
    position: absolute;
    z-index: 1;

    font-weight: 700;
    font-size: 20px;
    line-height: 20px;

    @include mobile {
      left: 60px;
    }
  }
}
</style>
