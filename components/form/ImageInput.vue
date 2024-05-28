<template>
  <div
    class="ImageInput"
    :class="[
      {
        'ImageInput--large': large,
        'ImageInput--selected': hasImage,
      },
      $attrs.class,
    ]"
  >
    <div
      v-if="multiple && hasImage"
      class="ImageInput__multiple-body"
    >
      <ImagesMultipleList
        :images="modelValue"
        :disable-draggable="disableDraggable"
        v-bind="$attrs"
        @change="changeImages"
        @add="emitImage"
        @remove="emit('remove-images', $event)"
      />
    </div>
    <label
      v-else
      class="ImageInput__body"
    >
      <template v-if="hasImage">
        <ImageHolder
          class="ImageInput__image"
          :image="modelValue"
          :large="large"
        />
        <div class="ImageInput__edit-block">
          <div
            v-if="!editMenuOpened"
            class="ImageInput__edit-button"
            @click.prevent="openEditMenu"
          >
            <div class="ImageInput__edit-button-icon">
              <img
                src="../../icons/edit-accent.svg"
                alt=""
              />
            </div>
          </div>
          <div
            v-else
            v-click-outside="closeEditMenu"
            class="ImageInput__edit-menu"
          >
            <div
              class="ImageInput__edit-menu-item"
              @click.prevent="removeImage"
            >
              <img
                src="../../icons/delete-accent.svg"
                alt=""
              />
              <span>Удалить</span>
            </div>
            <div
              class="ImageInput__edit-menu-item ImageInput__edit-menu-item--change"
            >
              <img
                src="../../icons/change-black.svg"
                alt=""
              />
              <span>Заменить</span>
              <input
                class="ImageInput__input"
                type="file"
                accept="image/*"
                :multiple="multiple"
                v-bind="$attrs"
                @change="handleImageSelect"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <ImageInputPlaceholder />
        <input
          class="ImageInput__input"
          type="file"
          accept="image/*"
          :multiple="multiple"
          v-bind="$attrs"
          @change="handleImageSelect"
        />
      </template>
    </label>
    <AddPhotoModal
      v-if="cropper"
      :title="title || 'Редактирование'"
      :file="editingImage"
      :aspect-ratio="aspectRatio"
      @select="emitImage"
      @close="closeCropper"
    >
      <template #description>
        <ul>
          <li>Не использовать брендинг и логотипы</li>
          <li>Вес фото не должен быть > 4 Мб</li>
          <li>Формат JPEG, PNG</li>
        </ul>
      </template>
    </AddPhotoModal>
  </div>
</template>

<script setup lang="ts">
import AddPhotoModal from '~/bash-frontend-kit/components/global/AddPhotoModal.vue';
import ImageInputPlaceholder
  from '~/bash-frontend-kit/components/form/sub-elements/image-input/ImageInputPlaceholder.vue';
import ImageHolder from '~/bash-frontend-kit/components/form/sub-elements/image-input/ImageHolder.vue';
import ImagesMultipleList from '~/bash-frontend-kit/components/form/sub-elements/image-input/ImagesMultipleList.vue';
import {AnyImage} from '~/bash-frontend-kit/types/base/AnyImage';
import {useToggle} from '~/bash-frontend-kit/composables/form/useToggle';

const props = defineProps<{
  modelValue?: AnyImage | AnyImage[];
  disabled?: boolean;
  multiple?: boolean;
  disableDraggable?: boolean;
  large?: boolean;
  cropper?: boolean;
  title?: string;
  aspectRatio?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', image: AnyImage | AnyImage[]);
  (e: 'add-images', images: AnyImage[]);
  (e: 'change-images', images: AnyImage[]);
  (e: 'remove-images', images: AnyImage[]);
}>();

const editingImage = ref<File>(null);
const [editMenuOpened, , closeEditMenu, openEditMenu] = useToggle();

const hasImage = computed(() => {
  if (props.multiple) {
    return !!(props.modelValue as AnyImage[])?.length;
  } else {
    return !!props.modelValue;
  }
});

function closeCropper() {
  editingImage.value = null;
}

function handleImageSelect(event) {
  if (!props.disabled) {
    if (props.multiple) {
      emitImage(event.target.files);
    } else {
      const file = event.target.files[0];
      if (props.cropper) {
        editingImage.value = file;
      } else {
        emitImage(file);
      }
    }
    event.target.value = null;
  }
}

function removeImage() {
  emit('update:modelValue', null);
  closeEditMenu();
}

function changeImages(images) {
  emit('change-images', images);
}

function emitImage(image: File | File[]) {
  if (props.multiple) {
    const images = Array.from(image as File[]);
    emit('update:modelValue', [...(props.modelValue as AnyImage[]), ...images]);
    emit('add-images', images);
  } else {
    emit('update:modelValue', image);
  }
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss">
.ImageInput {
  position: relative;

  &--large & {
    &__body {
      @include mobileUp {
        height: 377px;
      }
    }
  }

  &--selected & {
    &__body {
      cursor: default;
    }
  }

  &:hover {
    .ImageInputPlaceholder__select-text {
      color: #3b4453;
    }
  }

  &__body {
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 180px;

    cursor: pointer;

    @include mobile {
      height: 195px;
    }
  }

  &__image {
    border-radius: 30px;

    @include mobile {
      border-radius: 24px;
    }
  }

  &__edit-block {
    position: absolute;
    bottom: 18px;
    right: 16px;

    @include mobile {
      bottom: 12px;
      right: 12px;
    }
  }

  &__edit-button {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 54px;
    height: 54px;

    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;

    &-icon {
      display: flex;
    }
  }

  &__edit-menu {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 15px;

    padding: 25px 36px 25px 30px;

    background: #ffffff;
    box-shadow: 5px 0 44px rgba(228, 228, 234, 0.33);
    border-radius: 15px;

    &-item {
      display: flex;
      align-items: center;

      font-size: 14px;
      line-height: 20px;

      cursor: pointer;

      &--change {
        position: relative;

        .ImageInput__input {
          z-index: -1;
        }
      }

      img {
        margin-right: 10px;
      }
    }
  }

  &__multiple-body {
    padding: 40px 40px 30px;

    background: #f9fafc;
    border-radius: 30px;

    @include mobile {
      padding: 25px 20px;
    }
  }

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    opacity: 0;
    cursor: pointer;
  }

  .Modal {
    &__mobile-close {
      @include mobile {
        display: none;
      }
    }

    &__title {
      @include mobile {
        text-align: left;
      }
    }
  }

  .AddPhotoModal {
    &__photo {
      height: 506px;

      @include mobile {
        max-width: 400px;
        height: 226px;
      }
    }

    &__actions {
      @include mobile {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 20px;
      }

      .BaseButton {
        @include mobile {
          width: 100%;
        }
      }
    }

    &__back-btn {
      display: none;

      @include mobile {
        display: block !important;
        order: 2;
      }
    }

    &__save-btn {
      @include mobileUp {
        width: auto;
        padding: 0 42px;
      }
    }

    &__preview {
      display: none !important;
    }

    &__description {
      ul {
        padding: 0 !important;
        list-style-position: inside;

        li::marker {
          color: inherit !important;
        }
      }
    }
  }
}
</style>
