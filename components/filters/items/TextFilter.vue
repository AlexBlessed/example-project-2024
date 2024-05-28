<template>
  <div class="TextFilter">
    <BaseInput
      v-model="searchModel"
      placeholder="Поиск"
    />
    <div class="TextFilter__history">
      <template v-if="historyList.length">
        <div class="TextFilter__title">Последние запросы</div>
        <div class="TextFilter__list">
          <div
            v-for="(item, i) in historyList"
            :key="i"
            class="TextFilter__item"
          >
            {{ item }}
          </div>
        </div>
      </template>
      <ShadowStickyActions v-if="$media.md" class="TextFilter__action">
        <BaseButton @click="$emit('accept')">Сохранить</BaseButton>
        <BaseButton gray @click="$emit('clear')">Очистить</BaseButton>
      </ShadowStickyActions>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import { TableFilterText } from '~/bash-frontend-kit/types/table/TableFilter';
import debounce from 'lodash.debounce';
import ShadowStickyActions from '~/bash-frontend-kit/components/global/ShadowStickyActions.vue';

const props = defineProps<{
  filter: TableFilterText | null;
}>();

const emit = defineEmits<{
  (e: 'update:filter', filter: TableFilterText);
  (e: 'accept');
  (e: 'clear');
}>();

const historyList = ref([]);

const searchModel = computed({
  get() {
    return props.filter;
  },
  set(text) {
    debouncedFilterUpdate(text);
  },
});

const debouncedFilterUpdate = debounce((text) => {
  emit('update:filter', text);
  historyList.value.push(text);
}, 500);
</script>

<style lang="scss">
.TextFilter {
  &__history {
    margin-top: 20px;

    &:empty {
      margin: 0;
    }
  }

  &__title {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #a5aabe;
    margin-bottom: 10px;
  }

  &__item {
    cursor: pointer;

    &:hover {
      color: black;
    }

    & + & {
      margin-top: 5px;
    }
  }

  & &__action {
    bottom: -40px;
    margin-bottom: -40px;
  }
}
</style>
