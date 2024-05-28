<template>
  <div class="BaseNumberCheckbox BaseCheckbox">
    <BaseCheckbox
      v-model="checked"
      v-bind="$attrs"
    />
    <BaseSelect
      v-model="number"
      :options="selectNumberOptions"
      :get-option-label="(n) => n"
      :get-value-label="(n) => `${n} ${measure ?? 'шт.'}`"
      :reduce="(n) => n"
      small
      without-border
      fit-width
    />
  </div>
</template>

<script setup lang="ts">
import BaseCheckbox from '~/bash-frontend-kit/components/form/BaseCheckbox.vue';
import BaseSelect from '~/bash-frontend-kit/components/form/BaseSelect.vue';

const props = defineProps<{
  modelValue?: number;
  measure?: string;
  min?: number;
  max?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', number: number);
}>();

const number = ref(props.modelValue ?? 1);
const checked = ref(!!props.modelValue);

watch([number, checked], updateModelValue);

const selectNumberOptions = computed(() => {
  const max = props.max ?? 50;
  const min = props.min ?? 1;

  return Array.from({ length: max - min + 1 }, (_, index) => index + min);
});

function updateModelValue() {
  if (checked.value) {
    emit('update:modelValue', number.value);
  } else if (props.modelValue != null) {
    emit('update:modelValue', null);
  }
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss">
.BaseNumberCheckbox {
  display: flex;
  align-items: center;

  .BaseSelect {
    margin-left: 10px;

    &__body {
      height: 100%;

      &:after {
        margin-left: 0;
      }
    }

    &__value {
      padding-right: 12px;
    }

    &__dropdown {
      padding: 20px 15px 20px 20px;
      max-height: 150px;

      border-radius: 10px;
    }

    &__option--active:before {
      left: -20px;
    }
  }
}
</style>
