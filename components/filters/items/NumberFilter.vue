<template>
  <div class="NumberFilter">
    <BaseInput
      gray-placeholder
      placeholder="100"
      type="number"
      :custom-icon="equalIcon"
      :model-value="filterModel.value"
      @update:modelValue="filterModel = { value: $event }"
    />
    <BaseInput
      gray-placeholder
      placeholder="100"
      type="number"
      :custom-icon="moreIcon"
      :model-value="filterModel.min"
      @update:modelValue="filterModel = { min: $event }"
    />
    <BaseInput
      gray-placeholder
      placeholder="100"
      type="number"
      :custom-icon="lessIcon"
      :model-value="filterModel.max"
      @update:modelValue="filterModel = { max: $event }"
    />
    <ShadowStickyActions v-if="$media.md" class="NumberFilter__action">
      <BaseButton @click="$emit('accept')">Сохранить</BaseButton>
      <BaseButton gray @click="$emit('clear')">Очистить</BaseButton>
    </ShadowStickyActions>
  </div>
</template>

<script lang="ts" setup>
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import moreIcon from '~/bash-frontend-kit/icons/greater-or-equal.svg';
import equalIcon from '~/bash-frontend-kit/icons/equally.svg';
import lessIcon from '~/bash-frontend-kit/icons/less-or-equal.svg';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import { TableFilterNumber } from '~/bash-frontend-kit/types/table/TableFilter';
import { objectOmitFalsy } from '~/bash-frontend-kit/utils/data/object/objectOmitFalsy';
import debounce from 'lodash.debounce';
import ShadowStickyActions from '~/bash-frontend-kit/components/global/ShadowStickyActions.vue';

const props = defineProps<{
  filter: TableFilterNumber | null;
}>();

const emit = defineEmits<{
  (e: 'update:filter', filter: TableFilterNumber);
  (e: 'accept');
  (e: 'clear');
}>();

const filterModel = computed({
  get() {
    return props.filter ?? {};
  },
  set(filterSlice) {
    debouncedFilterUpdate({
      ...filterModel.value,
      ...filterSlice,
    });
  },
});

const debouncedFilterUpdate = debounce((filter) => {
  emit('update:filter', objectOmitFalsy(filter));
}, 500);
</script>

<style lang="scss">
.NumberFilter {
  .BaseInput + .BaseInput {
    margin-top: 25px;
  }

  &__action {
    bottom: -40px;
    margin-bottom: -40px;
  }
}
</style>
