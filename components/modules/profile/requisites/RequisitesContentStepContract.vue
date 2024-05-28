<template>
  <div class="RequisitesStepContract">
    <div class="RequisitesStepContract__title">Ваш договор</div>
    <div class="RequisitesStepContract__subtitle">
      Скачайте сформированный договор, чтобы подписать его и отправить нам
    </div>
    <a
      class="RequisitesStepContract__link"
      href="#"
      @click.prevent="downloadTemplate"
    >
      Скачать
    </a>
    <div class="RequisitesStepContract__title">
      <span>{{ contractInfo.status.title }}</span>
      <img
        :src="contractInfo.status.icon"
        alt=""
      />
    </div>
    <div class="RequisitesStepContract__subtitle">
      {{ contractInfo.status.description }}
    </div>
    <DocumentInput
      class="RequisitesStepContract__picker"
      :model-value="file"
      v-bind="fileProps"
      @select="submit"
      @remove="remove"
    />
  </div>
</template>

<script lang="ts" setup>
import DocumentInput from '~/components/global/DocumentInput.vue';
import { useForm } from '~/bash-frontend-kit/composables/form/useForm';
import { PhotoUploadResponse } from '~/bash-frontend-kit/types/response/PhotoUploadResponse';
import { downloadBlob } from '~/bash-frontend-kit/utils/data/downloadBlob';
import { HTTPMethod } from '~/bash-frontend-kit/types/app/HTTPMethod';
import { ContractInfo } from '~/bash-frontend-kit/types/models/ContractInfo';

const props = defineProps<{
  loading: boolean;
  requisites: object;
  type: number;
  stepInfo: object;
}>();

const emit = defineEmits<{
  (e: 'change', form: any): void;
}>();

const http = useHttp();
const contractInfo = ref<ContractInfo>(null);
await fetchInfo();

const { useFormField, submit } = useForm((data) => {
  return http
    .postFormData(
      '/requisites/contract/upload',
      createFormData({ files: [data] })
    )
    .then(
      async (response) => {
        file.value = response.files[0];
        await fetchInfo();
      },
      (e) => {
        file.value = null;
        throw e;
      }
    );
});
const [file, fileProps] = useFormField<File | PhotoUploadResponse>(
  'files',
  contractInfo.value.files[0]
);

async function downloadTemplate() {
  const response = await http.raw<Blob>(
    `/requisites/contract/download?space_id=${props.stepInfo.spaceId}`,
    undefined,
    HTTPMethod.GET
  );

  downloadBlob(response);
}

function remove(info) {
  if (info?.id) {
    http.delete(`/requisites/contract/delete/file/${info.id}`);
    fetchInfo();
  }
  file.value = null;
}

async function fetchInfo() {
  contractInfo.value = await http.get<ContractInfo>('/requisites/contract');

  emit('change', {
    valid: contractInfo.value.files?.length,
  });
}
</script>

<style lang="scss">
.RequisitesStepContract {
  font-size: 16px;
  font-weight: 400;
  line-height: 23px;

  &__title {
    display: flex;
    align-items: center;
    font-weight: 700;
    margin-bottom: 12px;

    img {
      margin-left: 8px;
    }

    &:not(:first-child) {
      margin-top: 32px;
    }
  }

  &__subtitle {
    margin-bottom: 16px;
  }

  &__link {
    color: var(--primary);
    text-decoration: none;
    border-bottom: 1.5px dotted var(--primary);
    line-height: 20px;
  }

  &__picker {
    max-width: 430px;
  }
}
</style>
