<template>
  <div class="step1">
    <SearchInput
      v-model="innModel"
      v-maska="$maska.inn"
      no-action
      class="step1__input"
      placeholder="ИНН"
      v-bind="innProps"
      :results="innSearchResults"
      :get-title="getINNTitle"
      :reduce="(item) => item.data.inn"
      @select="handleINNSelect"
      @change="handleINNChange"
    />
  </div>
</template>

<script lang="ts" setup>
import SearchInput from '~/bash-frontend-kit/components/global/SearchInput.vue';
import { useForm } from '~/bash-frontend-kit/composables/form/useForm';
import debounce from 'lodash.debounce';
import validatorInn from '~/bash-frontend-kit/utils/validators/requisites/validatorInn';
import { watch } from 'vue';
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';

const http = useHttp();

const props = defineProps({
  inn: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  (e: 'change', value: any): void;
}>();

const { form, formValid, fillForm, useFormField } = useForm();
const [innModel, innProps] = useFormField.required(
  'inn',
  props.inn,
  validatorInn
);
const innSearchResults = ref([]);

const debouncedFindINN = debounce(findINN, 500);

watch(
  () => props.inn,
  (inn) => {
    fillForm({ inn });
  }
);
watch(formValid, handleINNChange, { immediate: true });

function handleINNChange() {
  emit('change', {
    form,
    valid: formValid.value,
    requisites: null,
  });
  debouncedFindINN(form.inn);
}

function handleINNSelect({ item }) {
  emit('change', {
    form,
    valid: !!item || formValid.value,
    requisites: item,
  });
}

function getINNTitle({ data: { inn }, value }) {
  return `${inn} (${value})`;
}

async function findINN(inn) {
  const { data: searchResult } = await http.post('/requisites/find/inn', {
    query: inn,
    branch_type: 'MAIN',
  });

  innSearchResults.value = searchResult;
}
</script>

<style lang="scss">
.step1 {
  &__input {
    grid-column: 1/3;
  }
}
</style>
