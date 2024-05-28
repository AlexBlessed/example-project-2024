<template>
  <form
    class="change-password-form"
    @submit.prevent="submit"
  >
    <BaseInput
      v-if="isPasswordSet"
      v-model="currentPassword"
      v-bind="currentPasswordProps"
      placeholder="Старый пароль"
    />
    <BaseInput
      v-model="password"
      v-bind="passwordProps"
      placeholder="Новый пароль"
    />
    <BaseInput
      v-model="passwordConfirmation"
      v-bind="passwordConfirmationProps"
      placeholder="Повторите пароль"
    />
    <BaseButton
      class="change-password-form__confirm"
      :disabled="!valid"
      :loading="pending"
    >
      Сохранить
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import { useForm } from '~/bash-frontend-kit/composables/form/useForm';
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';
import { useNotify } from '~/bash-frontend-kit/composables/notify/useNotify';

import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/bash-frontend-kit/store/auth';

const { notifySuccess } = useNotify();

const http = useHttp();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const isPasswordSet = computed(() => user.value.password_status);

const { form, pending, valid, submit, resetForm, useFormField } =
  useForm(updatePassword);

const [currentPassword, currentPasswordProps] = useFormField(
  'current_password',
  null,
  null,
  isPasswordSet.value
);
const [password, passwordProps] = useFormField.required('password');
const [passwordConfirmation, passwordConfirmationProps] = useFormField.required(
  'password_confirmation'
);

async function updatePassword() {
  await http.post('/profile/password', form);
  notifySuccess({
    title: 'Пароль успешно изменен',
  });
  authStore.changeUser({ password_status: true });
  resetForm();
}
</script>

<style lang="scss">
.change-password-form {
  display: grid;
  grid-gap: 25px;

  &__confirm {
    margin-top: 15px;
  }
}
</style>
