<template>
  <div
    class="BaseTagsInput"
    :class="{
      'BaseTagsInput--tooltip': tooltip,
      'BaseTagsInput--valid': valid,
    }"
  >
    <div
      v-if="!viewOnly"
      class="BaseTagsInput__input"
    >
      <BaseInput
        v-model="inputText"
        v-bind="$attrs"
        :placeholder="placeholder"
        :tooltip="tooltip"
        @keydown.enter="addTag"
      />
      <img
        v-if="!viewOnly"
        class="BaseTagsInput__icon"
        src="@/bash-frontend-kit/icons/enter.svg"
        alt=""
      />
    </div>
    <TagsList
      v-if="modelValue?.length"
      :model-value="modelValue"
      :get-label="(tag) => tag"
      :reduce="(tag) => tag"
      :white="whiteTag"
      :disabled="viewOnly"
      @update:modelValue="emit('update:modelValue', $event)"
    />
    <div
      v-else-if="viewOnly"
      class="BaseTagsInput__empty"
    >
      Нет данных
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import TagsList from '~/bash-frontend-kit/components/form/sub-elements/TagsList.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: null,
  },
  placeholder: {
    type: String,
    default: '',
  },
  reduce: {
    type: Function,
    default: (option) => option.value,
  },
  valid: Boolean,
  viewOnly: Boolean,
  whiteTag: Boolean,
  tooltip: String,
});

const inputText = ref('');

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

function addTag() {
  if (!inputText.value) {
    return;
  }

  const newTags = inputText.value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  if (newTags.length) {
    const tags = props.modelValue || [];
    emit('update:modelValue', [...tags, ...newTags]);
  }
  inputText.value = '';
}

function remove(index) {
  const tags = Array.from(props.modelValue || []);
  tags.splice(index, 1);
  emit('update:modelValue', tags);
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss">
.BaseTagsInput {
  position: relative;

  &__input {
    position: relative;
    margin-bottom: 15px;
  }

  .BaseInput__input {
    padding-right: 40px;
  }

  &--tooltip & {
    &__icon {
      right: 32px + 8px;
    }
  }

  &__icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }

  &--valid::after {
    display: none;
  }
}
</style>
