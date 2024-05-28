<template>
  <TableCellWrap
    :format="format ?? TableCellFormat.USER_OBJECT"
    :link="link"
    :blank-link="!props.link"
    class="UserTableCell"
  >
    <template v-if="value">
      <UserAvatar
        class="UserTableCell__icon"
        :avatar="value.icon"
        :sex="value.sex"
        :alt="value.value"
      />
      <div class="UserTableCell__name">
        {{ value.value ?? value.name ?? value }}
      </div>
    </template>
    <template v-else>
      <img
        class="UserTableCell__icon"
        src="../../../icons/default-avatar.svg"
        alt=""
      />
      <div class="UserTableCell__name">Некто Неизвестный</div>
    </template>
  </TableCellWrap>
</template>

<script lang="ts" setup>
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import { SexUser } from '~/bash-frontend-kit/utils/data/_consts';
import { Image } from '~/bash-frontend-kit/types/base/image';
import UserAvatar from '~/bash-frontend-kit/components/global/UserAvatar.vue';
import { computed } from '#imports';
import getLinkInTypeable from '~/bash-frontend-kit/utils/table/getLinkInTypeable';
import { TableCellTypeable } from '~/bash-frontend-kit/types/table/NormalizedTable';

const props = defineProps<{
  format?: TableCellFormat;
  value?: {
    id: number;
    value?: string;
    name?: string;
    icon?: Image;
    sex?: SexUser;
  };
  link?: string;
}>();

const link = computed(
  () => props.link ?? getLinkInTypeable(TableCellTypeable.USER, props.value?.id)
);
</script>

<style lang="scss">
.UserTableCell {
  display: flex;
  align-items: center;

  &__icon {
    width: 35px;
    height: 35px;
    flex-shrink: 0;
    margin-right: 12px;

    border-radius: 12px;
  }

  &__name {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 21px;
    max-height: 42px;
  }
}
</style>
