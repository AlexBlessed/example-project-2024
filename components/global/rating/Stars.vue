<template>
  <div
    class="Stars"
    :class="{ 'Stars--small': small }"
  >
    <svg
      class="Stars__template"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
    >
      <defs>
        <linearGradient
          v-if="percent"
          :id="idHalf"
          x1="0"
          x2="100%"
          y1="0"
          y2="0"
        >
          <stop
            :offset="percentStr"
            stop-color="#FF7739"
          />
          <stop
            :offset="percentStr"
            stop-color="#EDEEF4"
          />
        </linearGradient>

        <symbol
          id="rating-star"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 18 18"
        >
          <path
            d="M8.13163 1.52052C8.51547 0.848415 9.48453 0.848416 9.86837 1.52052L11.6542 4.64753C11.7964 4.89648 12.0386 5.07243 12.3193 5.13072L15.8451 5.86285C16.6029 6.02021 16.9023 6.94184 16.3818 7.51458L13.9596 10.1793C13.7668 10.3914 13.6743 10.6762 13.7056 10.9611L14.0989 14.5406C14.1834 15.31 13.3994 15.8796 12.6938 15.5614L9.41103 14.0813C9.14968 13.9635 8.85032 13.9635 8.58897 14.0813L5.30619 15.5614C4.60061 15.8796 3.81663 15.31 3.90115 14.5406L4.29439 10.9611C4.3257 10.6762 4.23319 10.3914 4.04036 10.1793L1.61825 7.51458C1.09766 6.94184 1.39711 6.02021 2.15493 5.86285L5.68075 5.13072C5.96145 5.07243 6.20363 4.89648 6.3458 4.64753L8.13163 1.52052Z"
          />
        </symbol>
      </defs>
    </svg>
    <svg
      v-for="number in count"
      :key="number"
      class="Stars__star"
      viewBox="0 0 18 18"
    >
      <use
        xlink:href="#rating-star"
        :fill="getFill(number)"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from '#imports';

interface Props {
  value?: number;
  small?: boolean;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 5,
});

const remainder = computed(() => props.value % 1);
const percent = computed(() => Math.round(remainder.value * 100));
const percentStr = computed(() => `${percent.value}%`);
const idHalf = computed(() => `rating-star-half-${percent.value}`);

function getFill(number) {
  const v = Math.ceil(props.value);
  if (number < v) {
    return '#FF7739';
  } else if (number === v) {
    if (remainder.value) {
      return `url(#${idHalf.value})`;
    } else {
      return '#FF7739';
    }
  } else {
    return 'var(--secondary-hover)';
  }
}
</script>

<style lang="scss">
.Stars {
  display: grid;
  grid-template-columns: repeat(v-bind(count), auto);
  grid-gap: 3px;

  margin-right: 2px;

  &__template {
    width: 0;
    height: 0;
    position: absolute;
  }

  &__star {
    display: block;
    width: 18px;
    height: 18px;
  }

  &--small &__star {
    width: 15px;
    height: 15px;
  }
}
</style>
