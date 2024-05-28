<template>
  <div class="RatingCompact">
    <div class="RatingCompact__star">
      <Stars :value="Math.ceil(rating)" :count="1" />
    </div>
    <div class="RatingCompact__value">
      {{ rating.toFixed(1) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import Stars from '~/bash-frontend-kit/components/global/rating/Stars.vue';

interface Props {
  rating?: number;
}

withDefaults(defineProps<Props>(), {
  rating: 0,
});

</script>

<style lang="scss">
.RatingCompact {
  position: relative;
  text-align: center;

  &__star {
    border-radius: 50%;
    background: var(--bg);
    padding: 8px;
  }

  .Stars {
    margin: 0;
  }

  &__value {
    position: absolute;
    margin-top: 2px;
    font-size: 14px;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: -2px;
  }
}
</style>
