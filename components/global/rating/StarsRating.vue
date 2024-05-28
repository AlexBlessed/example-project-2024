<template>
  <div
    class="StarsRating"
    :class="{
      'StarsRating--empty': !rating,
      'StarsRating--small': small,
    }"
  >
    <Stars
      v-if="long"
      :value="rating"
      :small="small"
    />
    <div
      v-else
      class="StarsRating__star"
      v-html="StarIcon"
    />
    <div class="StarsRating__value">
      {{ isNotData ? '-' : formatRating(rating) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatRating } from '~/bash-frontend-kit/utils/format/formatRating';
import Stars from '~/bash-frontend-kit/components/global/rating/Stars.vue';
import StarIcon from '~/bash-frontend-kit/icons/rating-star.svg?raw';
import { computed } from '#imports';

const props = defineProps<{
  rating?: number;
  long?: boolean;
  small?: boolean;
}>();

const isNotData = computed(() => props.rating == null);
</script>

<style lang="scss">
.StarsRating {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;

  &--empty & {
    &__star {
      path {
        fill: #edeef4;
      }
    }
  }

  &--small &__star {
    svg {
      width: 15px;
      height: 15px;
    }
  }

  &__star {
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      max-width: 100%;
    }
  }

  &__value {
    margin-left: 8px;
    line-height: 22px;
  }
}
</style>
