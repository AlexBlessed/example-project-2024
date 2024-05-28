<template>
  <div class="SelectFilter">
    <BaseSelect
      ref="select"
      only-dropdown
      :options="options"
      :model-value="filter"
      @update:modelValue="updateFilter"
    />
    <ShadowStickyActions v-if="$media.md" class="SelectFilter__action">
      <BaseButton @click="$emit('accept')">Сохранить</BaseButton>
      <BaseButton gray @click="$emit('clear')">Очистить</BaseButton>
    </ShadowStickyActions>
  </div>
</template>

<script setup lang="ts">
import { FilterMeta, FilterMetaOption } from '~/bash-frontend-kit/types/models/Filter';
import BaseSelect from '~/bash-frontend-kit/components/form/BaseSelect.vue';
import { InputOption } from '~/bash-frontend-kit/types/form/InputOption';
import { TableFilterStatus } from '~/bash-frontend-kit/types/table/TableFilter';
import ShadowStickyActions from '~/bash-frontend-kit/components/global/ShadowStickyActions.vue';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';

defineProps<{
  filterMeta: FilterMeta;
  options: InputOption[];
  filter: FilterMetaOption['value'];
}>();

const emit = defineEmits<{
  (e: 'update:filter', filter: TableFilterStatus);
  (e: 'accept');
  (e: 'clear');
}>();

const select = ref(null);

function updateFilter(filter) {
  emit('update:filter', filter);
}

defineExpose({select});
</script>

<style lang="scss">
.SelectFilter {
  .BaseSelect__dropdown {
    position: static;
    margin: 0;
    overflow: visible;
    max-height: unset;
    height: auto;

    background: transparent;
    border-radius: 0;
    box-shadow: none;

    @include mobile {
      padding: 0;
    }
  }


  & &__action {
    bottom: -40px;
    margin-bottom: -40px;
  }
}
</style>
