<template>
  <div class="ProfileContent">
    <div class="ProfileContent__user">
      <UserPhotoBlock
        :avatar="user?.avatar"
        :size="user?.avatar_size"
        :sex="sex"
        @select="openAddModal"
        @remove="removeAvatar"
      />
    </div>
    <ProfileForm
        :form-without-company-name="formWithoutCompanyName"
        @change-sex="changeSex"
    />
    <AddPhotoModal
      title="Фото профиля"
      :file="avatarFile"
      @close="closeAddModal"
      @select="updateAvatar"
    />
  </div>
</template>

<script setup lang="ts">
import ProfileForm from '~/bash-frontend-kit/components/modules/profile/settings/ProfileForm.vue';
import AddPhotoModal from '~/bash-frontend-kit/components/global/AddPhotoModal.vue';
import UserPhotoBlock from '~/bash-frontend-kit/components/global/UserPhotoBlock.vue';
import { createFormData } from '~/bash-frontend-kit/utils/createFormData';
import { Image } from '~/bash-frontend-kit/types/base/image';
import { useAuthStore } from '~/bash-frontend-kit/store/auth';
import { storeToRefs } from 'pinia';
import { SexUser } from '~/bash-frontend-kit/utils/data/_consts';
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';

defineProps<{
  formWithoutCompanyName?: boolean;
}>();

const http = useHttp();
const auth = useAuthStore();
const { user } = storeToRefs(auth);

const sex = ref<SexUser>();
const avatarFile = ref<File>(null);

function changeSex(val) {
  sex.value = val;
}

function openAddModal(file) {
  avatarFile.value = file;
}

function closeAddModal() {
  avatarFile.value = null;
}

async function updateAvatar(file) {
  const formData = createFormData({ avatar: file });
  const avatar = await http.postFormData<{ url: Image; size?: number }>(
    '/profile/avatar',
    formData
  );
  auth.setUser({
    ...auth.user,
    avatar_size: avatar.size,
    avatar: avatar.url,
  });
}

async function removeAvatar() {
  await http.delete('/profile/avatar/delete');
  auth.setUser({
    ...auth.user,
    avatar_size: null,
    avatar: null,
  });
}
</script>

<style lang="scss">
.ProfileContent {
  max-width: 664px;

  &__user {
    display: flex;
    align-items: center;
    margin-bottom: 35px;
  }

  &__avatar {
    height: 70px;
    width: 70px;
    object-fit: cover;
    margin-right: 25px;
    cursor: pointer;
  }

  &__title {
    font-weight: 400;
    font-size: 16px;
    line-height: 23px;
    color: #3b4453;
  }

  &__format {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #a5aabe;
  }
}
</style>
