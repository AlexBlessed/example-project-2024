<template>
  <div
    class="BaseCheckbox"
    :class="{
      'BaseCheckbox--round': round,
      'BaseCheckbox--acute ': acute,
      'BaseCheckbox--error': error,
    }"
  >
    <div class="BaseCheckbox__label-wrapper">
      <label class="BaseCheckbox__label">
        <input
          v-model="modelActive"
          class="BaseCheckbox__checkbox"
          type="checkbox"
        />
        <div
          class="BaseCheckbox__input"
          :class="{
            'BaseCheckbox__input--active': modelActive,
            'BaseCheckbox--disabled': disabled,
          }"
        >
          <img
            class="BaseCheckbox__checkmark"
            src="@/bash-frontend-kit/icons/checkmark.svg"
            alt="link"
            loading="lazy"
          />
        </div>
        <div
          v-if="label || $slots.default"
          class="BaseCheckbox__text"
        >
          <slot>
            {{ label }}
            <img
              v-if="footnote"
              class="BaseCheckbox__footnote"
              src="@/bash-frontend-kit/icons/footnote.svg"
              alt=""
            />
          </slot>
        </div>
      </label>
    </div>
    <div v-if="description" class="BaseCheckbox__description">
      {{ description }}
    </div>
    <InputError
      class="BaseInput__error"
      :error="error"
    />
  </div>
</template>

<script setup lang="ts">
import InputError from '~/bash-frontend-kit/components/form/sub-elements/InputError.vue';

const props = defineProps<{
  modelValue?: boolean | number | string | any;
  label?: string;
  disabled?: boolean;
  footnote?: boolean;
  round?: boolean;
  acute?: boolean;
  error?: string | string[];
  description?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const modelActive = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<style lang="scss">
.BaseCheckbox {
  &--round {
    .BaseCheckbox__input {
      border-radius: 50%;
    }
  }

  &--acute {
    .BaseCheckbox {
      &__input {
        border-radius: 3px;
      }

      &__text {
        margin-left: 15px;
      }
    }
  }

  &--error & {
    &__input {
      @keyframes error {
        from {
          border-color: #ff7739;
        }
        to {
          border-color: rgba(180, 187, 198, 0.5);
        }
      }

      animation: error 2s;
    }
  }

  & + & {
    margin-top: 16px;
  }

  &__footnote {
    margin-left: 5px;
    margin-bottom: 5px;
  }

  &__checkmark {
    display: block;
    transform: translateY(100%);
    opacity: 0;
    user-select: none;
    transition: 250ms;
  }

  &__label-wrapper {
    display: flex;
    align-items: center;
  }

  &__label {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__text {
    position: relative;
    padding-top: 1px;
    margin-left: 12px;
    font-weight: 400;
    font-size: 16px;
    line-height: 125%;
    color: var(--text);

    a {
      color: var(--border-color);
      text-decoration: underline;
    }
  }

  &__error {
    padding-top: 12px;
    display: flex;
    align-items: flex-start;
  }

  &__error-text {
    padding-left: 12px;
    font-weight: normal;
    font-size: 13px;
    line-height: 20px;
    color: #3b4453;
  }

  &__input {
    height: 20px;
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 7px;
    transition: 250ms;
    border: 1px solid rgba(180, 187, 198, 0.5);
  }

  &__checkbox {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
    appearance: none;
  }

  &__description {
    margin-top: 4px;
    padding-left: 32px;
    color: #707783;
  }
}

.BaseCheckbox__input--active {
  border-color: #ff7739;
  background-color: #ff7739;

  &.BaseCheckbox--disabled {
    border-color: #ededed;
    background-color: #ededed;
  }

  .BaseCheckbox__checkmark {
    transform: translateY(0);
    opacity: 1;
  }
}

.BaseCheckbox__link {
  display: inline-block;
  margin-left: 10px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  > img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
}
</style>
