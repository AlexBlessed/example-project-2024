<template>
  <Modal
    title="Добавить клиента"
    modal-open
    medium
    @close="closeModal"
  >
    <div class="ManagerAddModal">
      <div class="ManagerAddModal__body">
        <BaseInput
          v-model="firstname"
          placeholder="Имя"
          v-bind="firstnameProps"
        />
        <BaseInput
          v-model="lastname"
          placeholder="Фамилия"
          v-bind="lastnameProps"
        />
        <BaseInput
          v-model="phone"
          v-maska="$maska.phoneNumber"
          placeholder="Телефон"
          v-bind="phoneProps"
        />
        <BaseInput
          v-model="email"
          placeholder="Эл. почта"
          v-bind="emailProps"
        />
      </div>
      <div class="ManagerAddModal__actions">
        <BaseButton
          :loading="pending"
          md-large
          @click="sendForm"
        >
          <img
            src="@/bash-frontend-kit/icons/create-plus-orange.svg"
            alt=""
          />
          Добавить клиента
        </BaseButton>
        <BaseButton
          white
          md-slim
          @click="closeModal"
        >
          Отмена
        </BaseButton>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { useForm } from '~/bash-frontend-kit/composables/form/useForm';
import validatorWord from '~/bash-frontend-kit/utils/validators/validatorWord';
import validatorPhone from '~/bash-frontend-kit/utils/validators/validatorPhone';
import validatorMail from '~/bash-frontend-kit/utils/validators/validatorMail';
import Modal from '~/bash-frontend-kit/components/global/Modal.vue';
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';
import userToInputOption from '~/bash-frontend-kit/utils/format/userToInputOption';
import { User, UserShort } from '~/bash-frontend-kit/types/models/User';

const emit = defineEmits<{
  (e: 'close');
  (e: 'added', user: UserShort);
}>();

const {
  useFormField,
  submit: sendForm,
  form,
  pending,
  valid,
  fillForm,
} = useForm(() => {
  return useHttp()
    .post<{ meta: { userId: number }; data: User }>(
      '/users/creator/basic',
      form
    ) //<UserWizard>
    .then((res) => {
      emit('added', {
        id: res.meta.userId,
        name: userToInputOption(res.data).text,
        ...res.data,
      });
    });
});
const [firstname, firstnameProps] = useFormField.required(
  'firstname',
  validatorWord
);
const [lastname, lastnameProps] = useFormField('lastname', validatorWord);
const [phone, phoneProps] = useFormField.required('phone', validatorPhone);
const [email, emailProps] = useFormField.required('email', validatorMail);

function closeModal() {
  emit('close');
}
</script>

<style lang="scss">
.ManagerAddModal {
  &__body {
    .BaseInput + .BaseInput {
      margin-top: 12px;
    }
  }

  &__actions {
    margin-top: 20px;
    display: flex;

    @include mobile {
      flex-direction: column;
    }

    .BaseButton + .BaseButton {
      margin-left: 10px;

      @include mobile {
        margin: 10px 0 0;
      }
    }
  }
}
</style>
