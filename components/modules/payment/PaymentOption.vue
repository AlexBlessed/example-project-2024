<template>
  <div class="PaymentOption">
    <div class="PaymentOption__info">
      <div class="PaymentOption__title">{{ option.title }}</div>
      <div class="PaymentOption__description">{{ option.description }}</div>
      <div class="PaymentOption__footer">
        <div class="PaymentOption__price">{{ formattedPrice }}</div>
        <BaseNumberSelect v-if="option.is_many" v-model="count" v-bind="countProps" />
      </div>
    </div>
    <BaseToggle
      v-model="checked"
      v-bind="checkedProps"
    />
  </div>
</template>

<script setup lang="ts">
import { PaymentInfoOption } from '~/bash-frontend-kit/types/payment/PaymentInfo';
import { formatPrice } from '~/bash-frontend-kit/utils/format/formatPrice';
import BaseToggle from '~/bash-frontend-kit/components/form/BaseToggle.vue';
import { useForm } from '~/bash-frontend-kit/composables/form/useForm';
import BaseNumberSelect from '~/bash-frontend-kit/components/form/BaseNumberSelect.vue';

const props = defineProps<{
  option: PaymentInfoOption;
}>();

const emit = defineEmits<{
  (e: 'change', form: object): void;
}>();

const { formGroupData, form, fillForm, useFormField } = useForm();

useFormField('id', props.option.id);

const isCheckedInit = props.option.checked;
const [checked, checkedProps] = useFormField('checked', isCheckedInit);

const initCount = props.option.is_many ? (props.option.count || (isCheckedInit ? 1 : 0)) : 1;
const [count, countProps] = useFormField('count', initCount);

watch(checked, (value, oldValue) => {
  if (value != oldValue) {
    if (props.option.is_many) {

      count.value = value ? 1 : 0;
    } else {
      emit('change', form);
    }
  }
});

watch(count, (value, oldValue) => {
  if (value != oldValue) {
    if (!!value != checked.value) {
      checked.value = !!value;
      emit('change', form);
    }
  }
});

const formattedPrice = computed(() => formatPrice(props.option.amount));


defineExpose({ formGroupData });
</script>

<style lang="scss">
.PaymentOption {
  display: flex;
  align-items: flex-start;
  gap: 40px;

  border-radius: 16px;
  background: #FAFAFA;
  padding: 20px;
  font-size: 16px;
  font-weight: 400;
  line-height: 23px;

  &__title {
  }

  &__description {
    color: var(--gray);
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }

  &__footer {
    display: flex;
    align-items: center;
    margin-top: 16px;
  }

  &__price {
    margin-right: 12px;
  }
}
</style>
