<template>
  <div class="BooleanFilter">
    <div class="BooleanFilter__item">
      <BaseCheckbox
        v-if="filterMeta.single_true"
        v-model="singleCheckboxModel"
        :label="props.filterMeta.typeTrue || 'Есть'"
      />
      <template v-else>
        <BaseCheckbox
          label="Все"
          :model-value="allSelected"
          @update:modelValue="selectAll"
        />
        <BaseCheckbox
          v-for="(option, index) in options"
          :key="index"
          :label="option.label"
          :model-value="check(option)"
          @update:modelValue="select(option)"
        />
      </template>
    </div>
    <ShadowStickyActions v-if="$media.md" class="BooleanFilter__action">
      <BaseButton @click="$emit('accept')">Сохранить</BaseButton>
      <BaseButton gray @click="$emit('clear')">Очистить</BaseButton>
    </ShadowStickyActions>
  </div>
</template>

<script lang="ts" setup>
import BaseCheckbox from '~/bash-frontend-kit/components/form/BaseCheckbox.vue';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import { TableFilterBoolean } from '~/bash-frontend-kit/types/table/TableFilter';
import { useBooleanSelectList } from '~/bash-frontend-kit/composables/form/useBooleanSelectList';
import { FilterMeta } from '~/bash-frontend-kit/types/models/Filter';
import ShadowStickyActions from '~/bash-frontend-kit/components/global/ShadowStickyActions.vue';

const props = defineProps<{
  filter: TableFilterBoolean | null;
  filterMeta: FilterMeta;
}>();

const emit = defineEmits<{
  (e: 'update:filter', filter: TableFilterBoolean);
  (e: 'accept');
  (e: 'clear');
}>();

const selectOptions = computed(() => {
  return [
    { label: props.filterMeta.typeTrue || 'Есть', value: true },
    { label: props.filterMeta.typeFalse || 'Нет', value: false },
  ];
});

const { options, selectedList, check, select, allSelected, selectAll } =
  useBooleanSelectList(props.filter, selectOptions.value);

watch(
  selectedList,
  ([value]) => {
    emit('update:filter', value);
  },
  { deep: true }
);

const singleCheckboxModel = computed({
  get() {
    return selectedList.value[0] === true;
  },
  set(flag) {
    if (flag) {
      selectedList.value = [true];
    } else {
      selectedList.value = [];
    }
  },
});
</script>

<style lang="scss">
.BooleanFilter {
  & &__action {
    bottom: -40px;
    margin-bottom: -40px;
  }
}
</style>
