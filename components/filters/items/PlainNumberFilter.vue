<template>
  <div class="PlainNumberFilter">
    <BaseInput
      gray-placeholder
      type="number"
      :model-value="filter"
      @update:modelValue="debouncedFilterUpdate"
    />
    <ShadowStickyActions v-if="$media.md" class="PlainNumberFilter__action">
      <BaseButton @click="$emit('accept')">Сохранить</BaseButton>
      <BaseButton gray @click="$emit('clear')">Очистить</BaseButton>
    </ShadowStickyActions>
  </div>
</template>

<script lang="ts" setup>
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import { TableFilterNumber } from '~/bash-frontend-kit/types/table/TableFilter';
import debounce from 'lodash.debounce';
import ShadowStickyActions from '~/bash-frontend-kit/components/global/ShadowStickyActions.vue';

const props = defineProps<{
  filter: number | null;
}>();

const emit = defineEmits<{
  (e: 'update:filter', filter: TableFilterNumber);
  (e: 'accept');
  (e: 'clear');
}>();

const debouncedFilterUpdate = debounce((filter) => {
  emit('update:filter', filter);
}, 500);
</script>

<style lang="scss">
.PlainNumberFilter {

  & &__action {
    bottom: -40px;
    margin-bottom: -40px;
  }
}
</style>
