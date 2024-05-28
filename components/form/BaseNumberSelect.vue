<template>
  <div class="BaseNumberSelect__wrapper">
    <div
      v-if="label"
      class="BaseNumberSelect__label"
    >
      {{ label }}
    </div>
    <div
      class="BaseNumberSelect"
      :class="{
        'BaseNumberSelect--md': md,
        'BaseNumberSelect--lg': lg,
        'BaseNumberSelect--huge': huge,
        'BaseNumberSelect--error': error,
        'BaseNumberSelect--compact': compactWidth,
      }"
      :style="{ height: height && `${height}px` }"
    >
      <div
        class="BaseNumberSelect__action"
        :class="{ 'BaseNumberSelect__action--disabled': decreaseDisabled }"
        @click="decrease"
      >
        -
      </div>
      <BaseInput
        :key="forceUpdateKey"
        v-model="model"
        opacity
        number
        small
        :lg="lg || huge"
        :mini-md="md"
        type="number"
      />
      <div
        class="BaseNumberSelect__action"
        :class="{ 'BaseNumberSelect__action--disabled': increaseDisabled }"
        @click="increase"
      >
        +
      </div>
    </div>
    <InputError
      class="BaseNumberSelect__error"
      :error="error"
    />
  </div>
</template>

<script lang="ts" setup>
import BaseInput from '~/bash-frontend-kit/components/form/BaseInput.vue';
import InputError from '~/bash-frontend-kit/components/form/sub-elements/InputError.vue';

const props = defineProps({
  modelValue: [Number, String],
  label: String,
  height: Number,
  md: Boolean,
  lg: Boolean,
  huge: Boolean,
  compactWidth: Boolean,
  min: Number,
  max: Number,
  error: {
    type: [String, Array],
    default: '',
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const forceUpdateKey = ref(false);

function forceUpdate() {
  forceUpdateKey.value = !forceUpdateKey.value;
}

const input = ref<HTMLInputElement>(null);

const model = computed<number | null>({
  get() {
    const n = parseInt(props.modelValue as string);
    return isNaN(n) ? null : n;
  },
  async set(val) {
    if (props.min != null && val < props.min) {
      update(props.min);
      forceUpdate();
      return;
    }

    if (props.max != null && val > props.max) {
      update(props.max);
      forceUpdate();
      return;
    }

    update(val);
  },
});

function decrease() {
  if (!decreaseDisabled.value) {
    update(model.value - 1);
  }
}

function increase() {
  if (!increaseDisabled.value) {
    update(model.value + 1);
  }
}

function update(value) {
  emit('update:modelValue', value);
}

const decreaseDisabled = computed(() => {
  if (props.min !== null) {
    return props.modelValue <= props.min;
  }
  return false;
});

const increaseDisabled = computed(() => {
  if (props.max !== null) {
    return props.modelValue >= props.max;
  }
  return false;
});
</script>

<style lang="scss">
.BaseNumberSelect {
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 40px;
  width: 110px;
  border: 1px solid var(--border-light-color);
  border-radius: 5px;

  &--md {
    max-width: 130px;
    width: unset;
  }

  &--lg {
    max-width: 310px;
    width: unset;
  }

  &--huge#{&}--error {
    border: 1px solid #ff5101;
  }

  &--huge {
    width: 100%;
    height: 50px;

    .BaseNumberSelect {
      &__action {
        padding: 8px 40px;

        font-weight: 400;
        font-size: 24px;
        line-height: 23px;
        color: #b4bbc6;

        transition: color $transition;

        &:hover {
          color: #3b4453;
        }

        &--disabled:hover {
          color: #b4bbc6;
          cursor: default;
        }
      }
    }
  }

  &--compact {
    @include mobileUp {
      max-width: 310px;
      width: 100%;
    }
  }

  &__action {
    padding: 8px 14px;
    cursor: pointer;
    user-select: none;

    &--disabled {
      cursor: default;
    }
  }

  &__error {
    margin-top: 10px;
  }

  &__label {
    margin-bottom: 10px;
  }
}
</style>
