<template>
  <div
    class="TextEditor"
    :class="{ 'TextEditor--error': error }"
  >
    <div class="TextEditor__body">
      <div
        v-click-outside="closeVariablesSelect"
        class="TextEditor__panel"
      >
        <div
          class="TextEditor__panel-button"
          :class="{ 'TextEditor__panel-button--opened': variablesSelectOpened }"
          @click="toggleVariablesSelect"
        >
          <div class="TextEditor__panel-button-icon">
            <img
              src="@/bash-frontend-kit/icons/text-edit-add-variable.svg"
              alt=""
            />
          </div>
          <div class="TextEditor__panel-button-arrow">
            <img
              src="@/bash-frontend-kit/icons/arrow-hide-small.svg"
              alt=""
            />
          </div>
        </div>
        <TextEditorVariablesSelect
          v-model:variable="variableModel"
          v-model:opened="variablesSelectOpened"
          :variables="variables"
        />
      </div>
      <div class="TextEditor__input-wrap">
        <div
          ref="input"
          :contenteditable="true"
          class="TextEditor__input"
          @input="handleInputChange"
          @click="handleInputClick"
        />
        <div
          v-if="!modelValue"
          class="TextEditor__placeholder"
        >
          {{ placeholder || 'Введите текст…' }}
        </div>
      </div>
    </div>
    <InputError
      class="TextEditor__error"
      :error="error"
    />
  </div>
</template>

<script lang="ts" setup>
import TextEditorVariablesSelect from '~/bash-frontend-kit/components/form/sub-elements/TextEditorVariablesSelect.vue';
import { useToggle } from '~/bash-frontend-kit/composables/form/useToggle';
import { InputOptionsGroup } from '~/bash-frontend-kit/types/form/InputOptionsGroup';
import InputError from '~/bash-frontend-kit/components/form/sub-elements/InputError.vue';

const props = defineProps<{
  modelValue: string;
  variables: InputOptionsGroup[];
  placeholder?: string;
  error?: string | string[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', text: string);
}>();

onMounted(() => {
  setInputContent(parseContent(props.modelValue ?? ''));
});

const input = ref<HTMLDivElement>(null);
const [variablesSelectOpened, toggleVariablesSelect, closeVariablesSelect] =
  useToggle();
const variableOffset = ref<number>(null);

watchEffect(() => {
  if (!variablesSelectOpened.value) {
    variableOffset.value = null;
  }
});

const variableModel = computed<string>({
  get() {
    // TODO: For change selected variable
    return null;
  },
  set(value: string) {
    addVariable(value);
  },
});

function openVariablesSelect() {
  const selection = document.getSelection();
  if (selection.anchorNode.parentElement === input.value) {
    variableOffset.value = selection.anchorOffset;
  }

  variablesSelectOpened.value = true;
}

function handleInputChange(event) {
  updateContent(normalizeContent(event.target.innerHTML));
}

function handleInputClick(event) {
  if (event.target.localName === 'span') {
    const id = event.target.parentElement.id;
    const content = input.value.innerHTML.replace(
      new RegExp(`<var ${varStaticAttrs} id="${id}">(.*?)</var>`),
      ''
    );
    updateContent(normalizeContent(content));
    setInputContent(content);
    input.value.blur();
  }
  // const variableValue = event.target.innerText;
}

function setInputContent(content: string) {
  input.value.innerHTML = content;
}

const varStaticAttrs = 'contenteditable="false"';
const varInnerTags = '<span></span>';

function parseContent(content: string) {
  return content.replaceAll(
    /\${(\S*)}/g,
    (_, name, index) =>
      `<var ${varStaticAttrs} id="${index}">${name}${varInnerTags}</var>`
  );
}

function normalizeContent(content: string) {
  return content.replaceAll(
    new RegExp(
      `<var ${varStaticAttrs} id="[0-9]+">(.*?)${varInnerTags}</var>`,
      'g'
    ),
    '${$1}'
  );
}

function addVariable(value: string) {
  const text = props.modelValue;
  const variableTag = `\$\{${value}\}`;

  const offset = variableOffset.value;
  if (offset != null) {
    const content = `${text.slice(0, offset)} ${variableTag} ${text.slice(
      offset
    )}`;
    updateContent(content);
    setInputContent(parseContent(content));
  } else {
    const content = `${text} ${variableTag}`;
    updateContent(content);
    setInputContent(parseContent(content));
  }
}

function updateContent(content: string) {
  emit('update:modelValue', content);
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss">
.TextEditor {
  &--error & {
    &__body {
      border-color: #ff5101;
    }
  }

  &__body {
    position: relative;
    border: 1px solid #edeef4;
    border-radius: 5px;
  }

  &__input-wrap {
    position: relative;
  }

  &__panel {
    position: relative;

    display: flex;
    align-items: center;
    height: 48px;
    padding: 8px 20px;

    background: #f9fafc;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }

  &__panel-button {
    display: flex;
    align-items: center;

    cursor: pointer;

    &--opened & {
      &-arrow {
        transform: rotate(-180deg);
      }
    }

    &-icon {
      display: flex;
    }

    &-arrow {
      display: flex;
      margin-left: 8px;

      transition: transform $transition;
    }
  }

  &__placeholder {
    position: absolute;
    top: 13px;
    left: 15px;

    user-select: none;
    pointer-events: none;
  }

  &__input {
    padding: 10px 15px;
    height: auto;
    min-height: 105px;

    resize: vertical;

    border-radius: 13px;
    outline: none;

    line-height: 32px;

    user-modify: read-write-plaintext-only;
    -moz-user-modify: read-write-plaintext-only;
    -webkit-user-modify: read-write-plaintext-only;

    @include mobile {
      min-height: 80px;
    }

    var {
      display: inline-flex;
      align-items: center;
      padding: 0 10px;
      height: 29px;

      background: #f5f6fa;
      border-radius: 5px;

      font-style: normal;
      line-height: 35px;
      //caret-color: transparent;

      &::before {
        content: '#';
      }

      span {
        display: flex;
        width: 12px;
        height: 12px;
        margin-left: 8px;

        background-image: url('~/bash-frontend-kit/icons/remove.svg');
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;

        cursor: pointer;
      }
    }
  }

  &__error {
    margin-top: 10px;
  }
}
</style>
