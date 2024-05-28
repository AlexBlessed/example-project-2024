<template>
  <div class="RequisitesContent">
    <DataLoading v-if="pending" />
    <template v-else>
      <div class="RequisitesContent__mobile-progress">
        <div
          class="RequisitesContent__progress-item"
          :class="{ 'RequisitesContent__progress-item--active': steps[0].done }"
        />
        <div
          class="RequisitesContent__progress-item"
          :class="{ 'RequisitesContent__progress-item--active': steps[1].done }"
        />
      </div>
      <div class="RequisitesContent__progress">
        <ProgressStepIndicator
          v-for="(step, i) in steps"
          :key="i"
          :step="step"
          :number="i + 1"
          :last="steps.length === i + 1"
        >
          <Component
            :is="components[i]"
            :loading="requisitesLoading"
            :inn="selectedINN"
            :requisites="normalizedRequisites"
            :type="type"
            :step-info="step"
            @change="handleFormChange(i, $event)"
          />
        </ProgressStepIndicator>
      </div>
      <slot
        name="actions"
        :disabled="!doneAll"
        :loading="formPending"
        :submit="submitForm"
      >
        <div class="RequisitesContent__action">
          <BaseButton
            :disabled="!doneAll"
            :loading="formPending"
            md-large
            @click="submitForm"
          >
            Сохранить
          </BaseButton>
        </div>
      </slot>
    </template>
  </div>
</template>

<script lang="ts" setup>
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton.vue';
import { computed, ref } from '#imports';
import Step1 from '~/bash-frontend-kit/components/modules/profile/requisites/RequisitesContentStep1.vue';
import Step2 from '~/bash-frontend-kit/components/modules/profile/requisites/RequisitesContentStep2.vue';
import ProgressStepIndicator from '~/bash-frontend-kit/components/global/ProgressStepIndicator.vue';
import { TypeOrg } from '~/bash-frontend-kit/utils/data/_consts';
import validatorOgrnip from '~/bash-frontend-kit/utils/validators/requisites/validatorOgrnip';
import DataLoading from '~/bash-frontend-kit/components/global/DataLoading.vue';
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';
import { useNotify } from '~/bash-frontend-kit/composables/notify/useNotify';

interface Props {
  additionalComponents: object[];
  additionalSteps: object[];
}

const props = withDefaults(defineProps<Props>(), {
  additionalComponents: () => [],
  additionalSteps: () => [],
});

const http = useHttp();

const steps = ref([
  {
    title: 'Введите ИНН',
    active: true,
    done: false,
  },
  {
    title: 'Введите данные об организации',
    active: false,
    done: false,
  },
  ...props.additionalSteps,
]);

const selectedINN = ref('');
const requisitesForm = ref(null);
const updatedRequisitesForm = ref(null);
const profileRequisites = ref(null);
const requisitesLoading = ref(false);
const formPending = ref(false);
const pending = ref(false);

const doneAll = computed(() => steps.value.every(({ done }) => done));

const components = [Step1, Step2, ...props.additionalComponents];

const normalizedRequisites = computed(() => {
  if (requisitesForm.value) {
    const { data } = requisitesForm.value;
    return {
      fullname: data.name?.full,
      bik: null,
      address: data.address?.value,
      corr_acc: null,
      ogrn: data.ogrn,
      acc: null,
      kpp: data.kpp,
      ceo_fio: null,
      bank: null,
      ceo_position: null,
    };
  } else {
    return profileRequisites.value;
  }
});

async function getProfileRequisites() {
  pending.value = true;
  const requisites = await http.get('/requisites');
  selectedINN.value = requisites.inn;
  profileRequisites.value = requisites;
  pending.value = false;
}

getProfileRequisites();

async function handleFormChange(step, { valid, form, requisites }) {
  if (step === 0) {
    requisitesForm.value = requisites;
    selectedINN.value = valid ? form.inn : '';
    steps.value[0].done = valid;
    steps.value[1].active = valid;
  } else {
    steps.value[step].done = valid;
    updatedRequisitesForm.value = {
      ...(updatedRequisitesForm.value ?? {}),
      ...form,
    };
  }
}

const type = computed(() => {
  const type = requisitesForm.value?.data?.type;
  if (type) {
    return TypeOrg[type] ?? TypeOrg.LEGAL;
  } else {
    if (validatorOgrnip(profileRequisites.value?.ogrn)) {
      return TypeOrg.INDIVIDUAL;
    } else return TypeOrg.LEGAL;
  }
});

function submitForm() {
  if (updatedRequisitesForm.value) {
    formPending.value = true;

    // TODO: required user_id ?;
    return http
      .put('/requisites/save', {
        ...updatedRequisitesForm.value,
        inn: selectedINN.value,
        dadata: requisitesForm.value,
        type: type.value,
      })
      .then(() => {
        useNotify().notifySuccess({
          title: 'Успешно сохранено',
        });
      })
      .finally(() => {
        formPending.value = false;
      });
  }
}
</script>

<style lang="scss">
.RequisitesContent {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @include mobile {
    padding-top: 0;
    margin-top: -25px;
  }

  .ProgressStepIndicator + .ProgressStepIndicator {
    margin-top: 10px;

    @include mobile {
      margin-top: 25px;
    }
  }

  &__mobile-progress {
    display: none;
    margin-bottom: 25px;

    @include mobile {
      display: flex;
    }
  }

  &__progress-item {
    width: 46px;
    height: 8px;
    background: var(--border-light-color);
    border-radius: 4px;

    &--active {
      background: #ff7739;
    }

    & + & {
      margin-left: 10px;
    }
  }

  &__action {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    flex-grow: 1;
    margin-left: 32px;

    @include mobile {
      padding-top: 25px;
      margin-left: 0;
    }
  }
}
</style>
