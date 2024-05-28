<template>
  <div class="step2">
    <BaseInput
      v-model="fullName"
      v-bind="fullNameProps"
      :pending="loading"
      loading-con
      placeholder="Название организации"
    />
    <BaseInput
      v-model="address"
      v-bind="addressProps"
      :pending="loading"
      loading-con
      placeholder="Адрес для корреспонденции"
    />
    <BaseInput
      v-model="ogrn"
      v-bind="ogrnProps"
      :pending="loading"
      loading-con
      placeholder="ОГРН"
    />
    <BaseInput
      v-model="kpp"
      v-bind="kppProps"
      :pending="loading"
      loading-con
      placeholder="КПП"
    />
    <BaseInput
      v-model="bank"
      v-bind="bankProps"
      :pending="loading"
      loading-con
      placeholder="Наименование банка"
    />
    <BaseInput
      v-model="bik"
      v-bind="bikProps"
      :pending="loading"
      loading-con
      placeholder="БИК"
    />

    <BaseInput
      v-model="corrAcc"
      v-bind="corrAccProps"
      :pending="loading"
      loading-con
      placeholder="К/С"
    />

    <BaseInput
      v-model="acc"
      v-bind="accProps"
      :pending="loading"
      loading-con
      placeholder="Р/С"
    />

    <BaseInput
      v-model="ceoFio"
      v-bind="ceoFioProps"
      :pending="loading"
      loading-con
      placeholder="Подписант (ФИО)"
    />

    <BaseInput
      v-model="ceoPosition"
      v-bind="ceoPositionProps"
      :pending="loading"
      loading-con
      placeholder="Должность подписанта"
    />
  </div>
</template>

<script lang="ts" setup>
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import { useForm } from '~/bash-frontend-kit/composables/form/useForm';
import { watch } from 'vue';
import validatorBik from '~/bash-frontend-kit/utils/validators/requisites/validatorBik';
import validatorOgrn from '~/bash-frontend-kit/utils/validators/requisites/validatorOgrn';
import { validatorRsDependent } from '~/bash-frontend-kit/utils/validators/requisites/validatorRs';
import validatorKpp from '~/bash-frontend-kit/utils/validators/requisites/validatorKpp';
import { validatorKsDependent } from '~/bash-frontend-kit/utils/validators/requisites/validatorKs';
import validatorOr from '~/bash-frontend-kit/utils/validators/validatorOr';
import validatorOgrnip from '~/bash-frontend-kit/utils/validators/requisites/validatorOgrnip';
import { TypeOrg } from '~/bash-frontend-kit/utils/data/_consts';

const props = defineProps({
  loading: Boolean,
  requisites: {
    type: Object,
    default: null,
  },
  type: {
    type: Number,
    default: TypeOrg.LEGAL,
  },
});

const emit = defineEmits<{
  (e: 'change', form: any): void;
}>();

const { form, formValid, validate, fillForm, resetForm, useFormField } =
  useForm();

const [fullName, fullNameProps] = useFormField.required('fullname');
const [bik, bikProps] = useFormField.required<string>('bik', validatorBik);
const [address, addressProps] = useFormField.required('address');
const [corrAcc, corrAccProps] = useFormField.required(
  'corr_acc',
  validatorKsDependent(bik)
);
const [ogrn, ogrnProps] = useFormField.required(
  'ogrn',
  validatorOr(validatorOgrn, validatorOgrnip)
);
const [acc, accProps] = useFormField.required('acc', validatorRsDependent(bik));
const [kpp, kppProps] = useFormField(
  'kpp',
  validatorKpp,
  null,
  props.type === TypeOrg.LEGAL
);
const [ceoFio, ceoFioProps] = useFormField.required('ceo_fio');
const [bank, bankProps] = useFormField.required('bank');
const [ceoPosition, ceoPositionProps] = useFormField.required('ceo_position');

watch(
  formValid,
  (valid) => {
    emit('change', {
      form: valid ? form : null,
      valid,
    });
  },
  { immediate: true }
);

watch(
  () => props.requisites,
  (requisites: any) => {
    if (requisites) {
      fillForm(requisites);
      validate();
    } else {
      resetForm();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style lang="scss">
.step2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(5, 1fr);
  grid-auto-flow: column;
  grid-gap: 25px 18px;

  @include mobile {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(10, 1fr);
    margin-bottom: 25px;
  }
}
</style>
