<template>
  <div
    class="ImagePicker"
    :class="{ 'ImagePicker--disabled': disabled }"
  >
    <div
      class="ImagePicker__content"
      :class="{ 'ImagePicker__content--multiple': multiple }"
    >
      <template v-if="multiple">
        <div
          v-for="image in modelValue"
          class="ImagePicker__image-wrapper"
        >
          <img
            :src="getImageUrl(image)"
            alt=""
            class="ImagePicker__image-item"
          />
        </div>
      </template>
      <label class="ImagePicker__body">
        <input
          v-if="!disabled"
          class="ImagePicker__input"
          type="file"
          :multiple="multiple"
          @change="selectFile"
        />
        <span class="ImagePicker__image-holder">
          <span
            v-if="empty || multiple"
            class="ImagePicker__empty-placeholder"
            v-html="ImagePlaceholder"
          />
          <img
            v-else
            class="ImagePicker__image"
            alt=""
            :src="imageUrl"
          />
        </span>
        <span
          v-if="!multiple || empty"
          class="ImagePicker__info"
        >
          <span class="ImagePicker__title">
            <span>{{ empty ? placeholder : imageName }}</span>
            <span
              v-if="!empty"
              class="ImagePicker__remove"
              @click.prevent="removeImage"
              v-html="RemoveIcon"
            />
          </span>
          <span class="ImagePicker__description">
            <span v-if="empty && description">{{ description }} <br /></span>
            {{ imageDescription }}
          </span>
        </span>
      </label>
    </div>
    <AddPhotoModal
      :title="placeholder || 'Редактирование'"
      :file="editingImage"
      @select="emitImage"
      @close="editingImage = null"
    >
      <template #description>
        <ul>
          <li>Вес фото не должен быть > 4 Мб</li>
          <li>Формат JPEG, PNG, SVG</li>
        </ul>
      </template>
    </AddPhotoModal>
  </div>
</template>

<script setup lang="ts">
import { getImageUrl } from '~/bash-frontend-kit/utils/getImageUrl';
import { sizeToString } from '~/bash-frontend-kit/utils/format/sizeToString';
import { getFileExtension } from '~/bash-frontend-kit/utils/getFileExtension';
import { AnyImage } from '~/bash-frontend-kit/types/base/AnyImage';
import { PhotoUploadResponse } from '~/bash-frontend-kit/types/response/PhotoUploadResponse';
import AddPhotoModal from '~/bash-frontend-kit/components/global/AddPhotoModal.vue';
import RemoveIcon from '~/bash-frontend-kit/icons/basket.svg?raw';
import ImagePlaceholder from '~/bash-frontend-kit/icons/empty-avatar-hover.svg?raw';
import { isFile } from '~/bash-frontend-kit/utils/isFile';

const props = defineProps<{
  modelValue: AnyImage | AnyImage[]; // image
  placeholder: string;
  disabled?: boolean;
  description?: string;
  multiple?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', image: File | File[] | null);
  (e: 'remove');
}>();

const editingImage = ref<File>(null);

const imageUrl = computed(() => {
  if (!props.multiple) {
    return getImageUrl(props.modelValue as AnyImage);
  }
});

const empty = computed(() => {
  if (props.multiple) {
    return !(props.modelValue as AnyImage[])?.length;
  } else {
    return !props.modelValue;
  }
});

const imageDescription = computed(() => {
  if (!props.multiple) {
    const type = getFileExtension(props.modelValue as AnyImage)?.toUpperCase();
    const size = sizeToString((props.modelValue as File)?.size);

    if (type || size) {
      return [type, size].filter((n) => n).join(', ');
    }
  }

  return 'JPEG, PNG, SVG';
});

const imageName = computed(() => {
  if (isFile(props.modelValue)) {
    return props.modelValue.name.split('.')[0];
  } else {
    return (props.modelValue as PhotoUploadResponse)?.fileName;
  }
});

function selectFile(e) {
  if (e.target.files?.length) {
    if (props.multiple) {
      emit('update:modelValue', [
        ...((props.modelValue as AnyImage[]) ?? []),
        ...e.target.files,
      ]);
    } else {
      editingImage.value = e.target.files[0];
    }
  }
  e.target.value = '';
}

function removeImage() {
  emit('remove');
  emitImage(null);
}

function emitImage(image: File) {
  emit('update:modelValue', image);
}
</script>

<style lang="scss">
.ImagePicker {
  position: relative;

  &--disabled & {
    &__body {
      cursor: default;
    }
  }

  &__input {
    @include inputHide;
  }

  &__content {
    &--multiple {
      display: flex;
      flex-wrap: wrap;

      margin: -8px;

      .ImagePicker__image-holder {
        margin: 8px;
      }
    }
  }

  &__image-wrapper {
    margin: 8px;

    &:hover {
      &::after {
        content: '';
      }
    }
  }

  &__image-item {
    display: block;
    width: 70px;
    height: 70px;

    border-radius: 15px;
    object-fit: cover;
    object-position: center;
  }

  &__body {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: fit-content;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: center;

    margin-left: 25px;
  }

  &__image-holder {
    display: flex;
    width: 70px;
    height: 70px;
    flex-shrink: 0;
  }

  &__image {
    width: 100%;
    height: 100%;

    object-fit: cover;
    border-radius: 13px;
  }

  &__empty-placeholder {
    width: 100%;
    height: 100%;

    .circle,
    .plus {
      transition: fill $transition;
    }

    &:hover {
      svg {
        .circle {
          fill: #ff7739;
        }

        .plus {
          fill: #ffffff;
        }
      }
    }
  }

  &__description {
    margin-top: 2px;

    font-size: 14px;
    line-height: 20px;
    color: #a5aabe;
  }

  &__title {
    display: flex;
    align-items: center;
  }

  &__remove {
    cursor: pointer;
    margin-left: 12px;

    path {
      transition: stroke $transition;
    }

    &:hover {
      path {
        stroke: #3b4453;
      }
    }
  }
}
</style>
