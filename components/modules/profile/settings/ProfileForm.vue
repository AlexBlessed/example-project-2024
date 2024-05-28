<template>
  <div class="ProfileForm">
    <div class="ProfileForm__form">
      <BaseInput
        v-model="firstname"
        placeholder="Имя"
        v-bind="firstnameProps"
      />
      <BaseInput
        v-model="patronymic"
        placeholder="Отчество"
        v-bind="patronymicProps"
      />
      <BaseInput
        v-model="lastname"
        placeholder="Фамилия"
        v-bind="lastnameProps"
      />
      <BaseInput
        v-if="!formWithoutCompanyName"
        v-model="company"
        placeholder="ООО «Открытые лофты»"
        label="Название компании"
        v-bind="companyProps"
      />
      <DateInput
        v-model="birthday"
        placeholder="Дата рождения"
        v-bind="birthdayProps"
      />
      <BaseInput
        v-model="email"
        placeholder="Email"
        v-bind="emailProps"
      />
      <BaseInput
        v-model="phone"
        v-maska="$maska.phoneNumber"
        placeholder="Введите номер"
        label="Номер телефона"
        v-bind="phoneProps"
      />
      <BaseSelect
        v-model="sex"
        placeholder="Выбрать пол"
        label="Пол"
        :options="SexOptions"
        v-bind="sexProps"
      />
      <BaseSelect
        v-model="timezone"
        placeholder="Часовой пояс"
        :options="timezones"
        v-bind="timezoneProps"
      />
    </div>
    <BaseButton
      class="ProfileForm__confirm"
      md-large
      :disabled="!valid"
      :loading="pending"
      @click="submit"
    >
      Сохранить
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import { useForm } from '~/bash-frontend-kit/composables/form/useForm';
import validatorPhone from '~/bash-frontend-kit/utils/validators/validatorPhone';
import validatorMail from '~/bash-frontend-kit/utils/validators/validatorMail';
import validatorEnum from '~/bash-frontend-kit/utils/validators/validatorEnum';
import { SexOptions, SexUser } from '~/bash-frontend-kit/utils/data/_consts';
import BaseSelect from '~/bash-frontend-kit/components/form/BaseSelect.vue';
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';
import { useAuthStore } from '~/bash-frontend-kit/store/auth';
import { parseUnixFromDate } from '~/bash-frontend-kit/utils/parse/parseUnixFromDate';
import { User } from '~/bash-frontend-kit/types/models/User';
import { useNotify } from '~/bash-frontend-kit/composables/notify/useNotify';
import validatorWorkspace from '~/bash-frontend-kit/utils/validators/validatorWorkspace';
import { validatorDate } from '~/bash-frontend-kit/utils/validators/validateDate';
import DateInput from '~/bash-frontend-kit/components/form/DateInput.vue';
import { InputOption } from '~/bash-frontend-kit/types/form/InputOption';

const props = defineProps<{
  formWithoutCompanyName?: boolean;
}>();

const { useFormField, submit, form, pending, valid, fillForm, ...other } =
  useForm(send);

const [firstname, firstnameProps] = useFormField('firstname');
const [lastname, lastnameProps] = useFormField('lastname');
const [patronymic, patronymicProps] = useFormField('patronymic');
const [company, companyProps] = useFormField(
  'company_name',
  undefined,
  validatorWorkspace,
  computed(() => !props.formWithoutCompanyName)
);
const [birthday, birthdayProps] = useFormField('birthday_date', validatorDate);
const [phone, phoneProps] = useFormField('phone', validatorPhone);
const [email, emailProps] = useFormField('email', validatorMail);
const [sex, sexProps] = useFormField<SexUser>('sex', validatorEnum(SexUser));
const [timezone, timezoneProps] = useFormField<string>('timezone');

const emit = defineEmits<{
  (e: 'change-sex', value: SexUser): void;
}>();

watch(
  sex,
  (value) => {
    emit('change-sex', value);
  },
  { immediate: true }
);

const authStore = await useAuthStore();
if (authStore.user) {
  fillForm(authStore.user, false, false);
}

const http = useHttp();
const { notifySuccess } = useNotify();

const { timezones } = await http.get<{ timezones: InputOption[] }>(
  '/profile/edit'
);

const sendUrl = computed(() => {
  return props.formWithoutCompanyName
    ? '/marketplace/profile/save'
    : '/profile/save';
});

async function send() {
  if (props.formWithoutCompanyName) {
    const user = await http.post<User>(sendUrl.value, {
      ...form,
      company_name: undefined,
      birthday: parseUnixFromDate(form.birthday_date),
    });
    onUserUpdated(user);
  } else {
    const user = await http.put<User>(sendUrl.value, {
      ...form,
      birthday: parseUnixFromDate(form.birthday_date),
    });
    onUserUpdated(user);
  }
}

function onUserUpdated(user) {
  authStore.setUser(user);
  notifySuccess({
    title: 'Данные успешно сохранены',
  });
}
</script>

<style lang="scss">
.ProfileForm {
  @include mobile {
    grid-template-columns: 1fr;
  }

  &__form {
    display: grid;
    grid-gap: 25px 116px;

    margin-bottom: 40px;

    @include laptop {
      grid-gap: 25px 50px;
    }

    @include mobileUp {
      grid-template-rows: repeat(4, auto);
      grid-auto-flow: column;

      &:has(:nth-child(9)) {
        grid-template-rows: repeat(5, auto);
      }
    }

    @include mobile {
      grid-template-columns: 1fr;
    }
  }

  &__confirm {
    margin-top: 15px;
  }
}
</style>
