<template>
  <BaseInput
    class="RatingInput"
    v-bind="$attrs"
    min="0"
    max="5"
    type="number"
  />
</template>

<script setup lang="ts">
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
</script>

<style lang="scss">
.RatingInput {
}
</style>
