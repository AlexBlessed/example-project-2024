<template>
  <div class="DateTimePeriodPicker">
    <DateTimeQuickFilter
      v-model:filter="filterModel"
      :filter-meta="{title: label}"
      :relative="relative"
      :from-now="fromNow"
      disable-remove
    >
      <template #input="{value}">
        <div
          class="DateTimePeriodPicker__input"
          :class="{'DateTimePeriodPicker__input--error': error}"
        >
          {{ value ?? label }}
        </div>
        <InputError
          class="DateTimePeriodPicker__error"
          :error="error"
        />
      </template>
    </DateTimeQuickFilter>
  </div>
</template>

<script setup lang="ts">
import DateTimeQuickFilter from '~/bash-frontend-kit/components/filters/quick-filters/DateTimeQuickFilter.vue';
import { AnyDate } from '~/bash-frontend-kit/types/base/date';
import InputError from '~/bash-frontend-kit/components/form/sub-elements/InputError.vue';

const props = withDefaults(defineProps<{
  label: string;
  from: AnyDate;
  to: AnyDate;
  relative?: boolean;
  fromNow?: boolean;
  error: any;
}>(), {
  label: 'Дата и время',
});

const emit = defineEmits<{
  (e: 'update:from', date: AnyDate);
  (e: 'update:to', date: AnyDate);
}>();

const filterModel = computed({
  get() {
    return {
      min: props.from,
      max: props.to,
    }
  },
  set({min, max}) {
    emit('update:from', min);
    emit('update:to', max);
  },
});
</script>

<style lang="scss">
.DateTimePeriodPicker {

  &__input {
    @include baseInputBlock;

    &--error {
      border: 1px solid #ff5101;
    }
  }

  &__error {
    margin-top: 10px;
  }
}
</style>