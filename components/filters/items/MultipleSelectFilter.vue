<template>
  <div class="MultipleSelectFilter">
    <div
      v-if="filterMeta.isSearch"
      class="MultipleSelectFilter__search"
    >
      <BaseInput
        v-model="searchText"
        placeholder="Поиск"
      />
    </div>
    <TransitionGroup name="list" tag="div" class="MultipleSelectFilter__options">
      <div
        v-if="hasSelectAllCheckbox"
        v-show="activeOptions.length > 1"
        :key="-1"
        class="MultipleSelectFilter__item"
        @click="selectAll"
      >
        <BaseCheckbox
          :model-value="allSelected"
          @click.prevent
        />
        <div class="MultipleSelectFilter__content">
          <div class="MultipleSelectFilter__title">Все</div>
        </div>
      </div>
      <div
        v-for="option in activeOptions"
        :key="option.value"
        class="MultipleSelectFilter__item"
        :class="{ 'MultipleSelectFilter__item--active': check(option) }"
        @click="selectOption(option)"
      >
        <BaseCheckbox
          :model-value="check(option)"
          @click.prevent
        />
        <div class="MultipleSelectFilter__content">
          <div
            v-if="option.color"
            class="MultipleSelectFilter__color"
            :style="{background: option.color}"
          />
          <div class="MultipleSelectFilter__title">{{ option.text }}</div>
        </div>
      </div>
    </TransitionGroup>
    <ShadowStickyActions v-if="$media.md" class="MultipleSelectFilter__action">
      <BaseButton @click="$emit('accept')">Сохранить</BaseButton>
      <BaseButton gray @click="$emit('clear')">Очистить</BaseButton>
    </ShadowStickyActions>
  </div>
</template>

<script lang="ts" setup>
import BaseCheckbox from '~/bash-frontend-kit/components/form/BaseCheckbox.vue';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import { FilterMeta, FilterMetaOption } from '~/bash-frontend-kit/types/models/Filter';
import { useSelectableList } from '~/bash-frontend-kit/composables/form/useSelectableList';
import { TableFilterStatus } from '~/bash-frontend-kit/types/table/TableFilter';
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';
import ShadowStickyActions from '~/bash-frontend-kit/components/global/ShadowStickyActions.vue';

const props = defineProps<{
  filterMeta: FilterMeta;
  options: FilterMetaOption[];
  persistFilterOptions: FilterMetaOption[];
  filter: FilterMetaOption['value'];
  searchParams?: object;
}>();

const emit = defineEmits<{
  (e: 'update:filter', filter: TableFilterStatus);
  (e: 'update:persist-filter-options', filter: FilterMetaOption[]);
  (e: 'accept');
  (e: 'clear');
}>();

const http = useHttp();

const hasSelectAllCheckbox = computed(() => {
  return !!props.filterMeta.data;
});

const { selectedList, select, check, allSelected, selectAll } =
  useSelectableList<FilterMetaOption>(
    props.options ?? [],
    props.filter,
    (status) => status.value,
    hasSelectAllCheckbox.value
  );

function selectOption(option: FilterMetaOption) {
  if (searchedOptions.value) {
    updatePersistFilterOptions(option);
  }

  select(option);
}

function updatePersistFilterOptions(option: FilterMetaOption) {
  const optionIndex = props.persistFilterOptions.findIndex(
    ({ value }) => option.value === value
  );

  if (optionIndex === -1) {
    emit('update:persist-filter-options', [
      ...props.persistFilterOptions,
      option,
    ]);
  } else {
    const [...optionsCopy] = props.persistFilterOptions;
    optionsCopy.splice(optionIndex, 1);
    emit('update:persist-filter-options', optionsCopy);
  }
}

watch(
  selectedList,
  (values) => {
    emit('update:filter', values);
  },
  { deep: true }
);

const searchedOptions = ref<FilterMetaOption[]>(null);

const searchText = ref('');
const normalizedSearchText = computed(() => {
  return searchText.value.trim().toLowerCase();
});

const activeOptions = computed(() => {
  if (searchedOptions.value) {
    return searchedOptions.value;
  }

  if (props.options) {
    if(props.persistFilterOptions) {
      const values = props.options.map(el => el.value);
      const persist = props.persistFilterOptions.filter(({value}) => !values.includes(value));
      return [...persist, ...props.options];
    }
    else {
      return props.options;
    }
  }

  return [];
});

watch(normalizedSearchText, async (searchText) => {
  if (searchText) {
    searchedOptions.value = await http.get<FilterMetaOption[]>({
      url: '/glossary/filter/search',
      params: {
        search: searchText,
        key: props.filterMeta.searchType,
        ...(props.searchParams ?? {}),
      },
    });
  } else {
    searchedOptions.value = null;
  }
});
</script>

<style lang="scss">
.MultipleSelectFilter {
  &__options {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }

  &__item {
    display: flex;
    align-items: flex-start;

    cursor: pointer;

    &--active {
      order: -1;
    }
  }

  &__search {
    margin-bottom: 30px;
  }

  &__content {
    display: flex;
    align-items: center;

    margin-left: 15px;
  }

  &__title {
    line-height: 20px;
  }

  &__description {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #a5aabe;
  }

  & &__action {
    bottom: -40px;
    margin-bottom: -40px;
  }

  &__color {
    width: 10px;
    height: 10px;
    margin-right: 10px;
    flex-shrink: 0;

    border-radius: 50%;
  }

  .list-move {
    transition: all $transition;
  }

}
</style>
