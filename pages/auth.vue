<template>
  <MainLayout>
    <div class="AuthPage">
      <form @submit.prevent="submit">
        <BaseInput
          v-model="login"
          placeholder="E-mail или телефон"
          v-bind="loginProps"
        />
        <BaseInput
          v-model="password"
          placeholder="Пароль"
          type="password"
          v-bind="passwordProps"
        />
        <BaseButton
          type="submit"
          :disabled="!valid"
          :loading="pending"
          large
        >
          Войти
        </BaseButton>
      </form>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';
import { AuthEvents, useAuthStore } from '~/bash-frontend-kit/store/auth';
import validatorPhoneOrMail from '~/bash-frontend-kit/utils/validators/validatorPhoneOrMail';
import { useForm } from '~/bash-frontend-kit/composables/form/useForm';
import { useRouter } from 'vue-router';
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';

const router = useRouter();
const http = useHttp();
const authStore = useAuthStore();

authStore.emitter.emit(AuthEvents.authorization);

const {useFormField, submit, form, pending, valid} = useForm(auth);
const [login, loginProps] = useFormField.required(
    'login',
    validatorPhoneOrMail
);
const [password, passwordProps] = useFormField.required('password');

function auth() {
  return http
      .post('/auth/password', form)
      .then(({token, user}) => {
        authStore.setToken(token);
        authStore.setUser(user);
        if(authStore.fromAuthRoute) {
          router.replace(authStore.fromAuthRoute);
          authStore.setRouteFromAuth(null);
        }
        else {
          router.back();
        }
      });
}
</script>

<style lang="scss">
.AuthPage {
  padding: 100px;

  form {
    max-width: 400px;
  }

  form {
    .BaseInput {
      margin-bottom: 20px;
    }

    .BaseButton {
      margin-top: 30px;
    }
  }
}
</style>
