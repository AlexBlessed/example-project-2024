<template>
  <Component
    :is="link ? AppLink : 'div'"
    :to="link"
    class="TableCellWrap"
    :class="{ 'TableCellWrap--stretch': stretch }"
    :style="sizeStyle"
    :public-link="link && (publicLink ?? isPublicLink)"
    :target="link && (blankLink ?? isPublicLink) && '_blank'"
  >
    <slot />
  </Component>
</template>

<script lang="ts" setup>
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import { toPixels } from '~/bash-frontend-kit/utils/format/toPixels';
import { getTableCellSize } from '~/bash-frontend-kit/utils/table/getTableCellSize';
import AppLink from '~/bash-frontend-kit/components/app/AppLink.vue';
import { computed } from '#imports';

interface Props {
  format?: TableCellFormat;
  link?: string;
  stretch?: boolean;
  publicLink?: boolean;
  blankLink?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  publicLink: null,
  blankLink: null,
});

const isPublicLink = computed(() => !props.link?.startsWith?.('/'));

const sizeStyle = computed(() => ({
  width: props.format && toPixels(getTableCellSize(props.format)),
}));
</script>

<style lang="scss">
.TableCellWrap {
  flex-shrink: 0;

  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  color: #3b4453;

  &--stretch {
    align-self: stretch;
  }

  &:not(:hover) {
    text-decoration: none;
  }

  &:empty::after {
    content: '–';
    font-weight: 400;
    font-size: 16px;
    line-height: 23px;
    color: #3b4453;
  }
}
</style>
