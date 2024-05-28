<template>
  <div class="profile-notifications">
    <div class="profile-notifications__block">
      <div class="profile-notifications__title">Информационные письма</div>
      <BaseRadioInput
          v-model="email"
          v-bind="emailProps"
          :value="true"
          label="Получать"
      />
      <BaseRadioInput
          v-model="email"
          v-bind="emailProps"
          :value="false"
          label="Не получать"
      />
    </div>

    <div class="profile-notifications__block">
      <div class="profile-notifications__title">Уведомления по заявкам</div>
      <BaseCheckbox
          v-model="sms"
          v-bind="smsProps"
          label="По SMS"
      />
      <BaseCheckbox
          v-model="telegram"
          v-bind="telegramProps"
          label="В Telegram"
      />
    </div>

    <BaseButton
        :loading="pending"
        large
        @click="submit"
    >
      Сохранить
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useHttp } from '#imports';
import BaseRadioInput from '~/bash-frontend-kit/components/form/BaseRadioInput.vue';
import BaseCheckbox from '~/bash-frontend-kit/components/form/BaseCheckbox.vue';
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import { useForm } from '~/bash-frontend-kit/composables/form/useForm';
import { Lead } from '~/bash-frontend-kit/types/models/Lead';
import { useNotify } from '~/bash-frontend-kit/composables/notify/useNotify';

const http = useHttp();
const data = await http.get<{
  email: boolean;
  sms: boolean;
  telegram: boolean;
}>('/profile/settings/notifications');

const { useFormField, submit, form, pending, valid, resetErrors, fillForm } =
    useForm(() => {
      return http.post<Lead>('/profile/settings/notifications', form).then(() => {
        useNotify().notifySuccess({
          title: 'Успешно сохранено',
        });
      });
    });

const [email, emailProps] = useFormField.required('email');
const [sms, smsProps] = useFormField.required('sms');
const [telegram, telegramProps] = useFormField.required('telegram');

fillForm(data);
</script>

<style lang="scss">
.profile-notifications {
  &__title {
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #b4bbc6;

    margin-bottom: 25px;
  }

  &__block {
    margin-bottom: 40px;
  }
}
</style>
