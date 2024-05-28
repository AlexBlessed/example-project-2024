<template>
  <BaseSelect
    v-model="model"
    v-bind="{ ...$props, ...$attrs }"
    class="SearchableSelect"
    :class="{ 'SearchableSelect--user': isUserType }"
    :get-option-label="
      (item) => item?.title ?? item?.text ?? item?.name ?? item?.value
    "
    :reduce="reduce"
    :options="optionsList"
    :option="optionSelected ?? option"
    :default-img="defaultImg"
    :img="isImgType"
    :notify="isImgType"
    :disabled="disabled"
    :empty-options="!isClient && emptyOptions"
    :add-modal="addModal"
    @open-modal-add="openModalAdd"
    @click-add="handleClickAdd"
    @select="select"
  >
    <template #dropdown>
      <div class="SearchableSelect__search">
        <BaseInput
          v-model="searchValue"
          :placeholder="placeholderSearchStr"
          :min-width="208"
          blue
        />
      </div>
    </template>
    <template #dropdown-footer>
      <IntersectionObserver @visible="onObserverVisible" />
    </template>
  </BaseSelect>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { useHttpPagination } from '~/bash-frontend-kit/composables/useHttpPagination';
import IntersectionObserver from '~/bash-frontend-kit/components/global/IntersectionObserver.vue';
import { GlossaryFilterItem } from '~/bash-frontend-kit/types/models/GlossaryFilterItem';
import avatarOrDefault from '~/bash-frontend-kit/utils/format/avatarOrDefault';
import defaultImageSpace from '~/bash-frontend-kit/icons/space-default-image.svg';
import BaseSelect from '~/bash-frontend-kit/components/form/BaseSelect.vue';
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import { computed, usePageVisibilityToState, watch } from '#imports';
import { useAuthStore } from '~/bash-frontend-kit/store/auth';
import userToInputOption from '~/bash-frontend-kit/utils/format/userToInputOption';
import { storeToRefs } from 'pinia';

const {isClient} = storeToRefs(useAuthStore());

enum TypeDataSearchable {
  MANAGER = 'manager',
  TAGS = 'tags',
  CLIENT = 'client',
  SPACE = 'space',
  ADDITIONAL_OPTIONS = 'additional_options',
  USERS = 'users',
  EVENT_TYPE = 'event_type',
  LEADS = 'leads',
}

interface Props {
  modelValue: any;
  typeData: TypeDataSearchable;
  placeholderSearch?: string;
  option?: object;
  disabled?: boolean;
  addModal?: boolean;
  filters?: object;
  reduce?: (item: object) => any;
  defaultCurrentUser?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  reduce: (item) => item?.id ?? item?.value,
});

function getCurrentUser() {
  return useAuthStore().user;
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'update:option', value: any): void;
  (e: 'open-modal-add'): void;
  (e: 'select', option: any);
}>();

function openModalAdd() {
  emit('open-modal-add');
}

function select(option) {
  emit('select', option);
}

const userType = [
  TypeDataSearchable.USERS,
  TypeDataSearchable.CLIENT,
  TypeDataSearchable.MANAGER,
];
const imgType = [
  TypeDataSearchable.USERS,
  TypeDataSearchable.CLIENT,
  TypeDataSearchable.MANAGER,
  TypeDataSearchable.SPACE,
];

const emptyOptions = computed(() => {
  if (userType.includes(props.typeData)) {
    return {
      add: 'Добавить контакт',
      description: 'У вас пока нет ни одного контакта',
      link: '/users/add',
      contact: true,
    };
  } else if (
    [TypeDataSearchable.SPACE, TypeDataSearchable.ADDITIONAL_OPTIONS].includes(
      props.typeData
    )
  ) {
    return {
      add: 'Добавить площадку',
      description: 'У вас пока нет ни одной площадки',
      link: '/spaces/wizard',
    };
  } else if (props.typeData === TypeDataSearchable.LEADS) {
    return {
      add: 'Добавить заявку',
      description: 'У вас пока нет ни одной заявки',
      link: '/leads/add',
    };
  }
});

const config = useRuntimeConfig();
const optionSelected = ref(props.option);

watch(
  () => props.option,
  () => {
    if (props.option?.id === props.modelValue) {
      optionSelected.value = props.option;
    }
  }
);

const isImgType = computed(() => imgType.includes(props.typeData));
const isUserType = computed(() => userType.includes(props.typeData));

const model = computed({
  get: () => props.modelValue,
  set: (id) => {
    if (props.reduce(optionSelected.value) !== id) {
      optionSelected.value = findOption(id);
    }
    emit('update:modelValue', id);
    emit('update:option', optionSelected.value);
  },
});

if (props.defaultCurrentUser && !props.option) {
  const user = getCurrentUser();
  optionSelected.value = userToInputOption(user);
  model.value = user?.id;
}

function findOption(id) {
  if (props.reduce(optionSelected.value) === id) return optionSelected.value;
  else {
    return optionsList.value.find((item) => props.reduce(item) === id);
  }
}

const searchValue = ref();

const urlSearch = computed(() => ({
  url: `${config.public.apiGlossarySearchPath}/${props.typeData}`,
  params: {
    search: searchValue.value,
    filter: props.filters,
  },
}));

const {
  data: optionsList,
  change,
  fetched,
  refresh,
  next,
  meta,
  done,
  pending,
} = useHttpPagination<GlossaryFilterItem>(urlSearch.value, true, 0, false);

watch(urlSearch, () => change(urlSearch.value));
watch(
  () => props.modelValue,
  () => {
    if (props.modelValue && !findOption(props.modelValue) && !fetched.value) {
      next();
    }
  },
  { immediate: true }
);

const placeholderSearchStr = computed(() => {
  const count = fetched.value ? meta.value?.total : props.option ? 1 : 0;

  return `${props.placeholderSearch ?? 'Поиск'} (${count ?? 0})`;
});

const defaultImg = computed(() => {
  if (isImgType.value) {
    if (props.typeData === TypeDataSearchable.SPACE) {
      return defaultImageSpace;
    } else {
      return (option) => {
        return avatarOrDefault(null, option?.sex);
      };
    }
  }
});

function onObserverVisible(entry: IntersectionObserverEntry, unobserve) {
  if (done.value && optionsList.value.length) {
    unobserve();
  } else if (
    entry.isIntersecting &&
    !pending.value &&
    (!meta.value || meta.value.current_page < meta.value.last_page)
  ) {
    next();
  }
}

function handleClickAdd() {
  usePageVisibilityToState(() => {
    refresh();
  });
}
</script>

<style lang="scss">
.SearchableSelect {
  &__search {
    margin: 0 -5px 15px;
  }

  &--user .BaseSelect__option-label {
    white-space: normal;
    width: min-content;
  }

  .BaseSelect {
    &__dropdown {
      width: 100%;
    }

    &__option-label {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
