<template>
  <div
    v-if="info"
    class="GeneralTableMobileRow"
    :class="{ 'GeneralTableMobileRow--open': fullContent }"
  >
    <div class="GeneralTableMobileRow__main">
      <div
        v-if="info.header"
        class="GeneralTableMobileRow__header"
      >
        <GeneralTableMobileLine
          v-bind="info.header"
          :opened="fullContent"
          @change="updateCell({ slug: info.header.slug, value: $event })"
        />
      </div>

      <img
        v-if="!hideActions"
        class="GeneralTableMobileRow__menu-btn"
        src="@/bash-frontend-kit/icons/menu.svg"
        @click="$emit('open-menu')"
      />
      <img
        v-if="!info.permanentOpen"
        class="GeneralTableMobileRow__hide-btn"
        src="@/bash-frontend-kit/icons/arrow-hide.svg"
        @click="toggleFullContent"
      />

      <Component
        :is="info.link ? AppLink : 'div'"
        v-if="info.image || info.line1 || info.line2"
        class="GeneralTableMobileRow__content"
        :to="info.link?.(id)"
      >
        <img
          v-if="info.image"
          class="GeneralTableMobileRow__image"
          :src="info.image"
        />
        <div class="GeneralTableMobileRow__description">
          <GeneralTableMobileLine
            v-if="info.line1"
            v-bind="info.line1"
            :opened="fullContent"
            @change="updateCell({ slug: info.line1.slug, value: $event })"
          />
          <GeneralTableMobileLine
            v-if="info.line2"
            v-bind="info.line2"
            :opened="fullContent"
            @change="updateCell({ slug: info.line2.slug, value: $event })"
          />
        </div>
      </Component>
    </div>
    <AccordionTransition :opened="fullContent">
      <div class="GeneralTableMobileRow__full-content">
        <div
          v-for="col in rowNormalize"
          :key="col.columnId"
          class="GeneralTableMobileRow__item"
          :class="{
            'GeneralTableMobileRow__item--action': isAction(col.format),
          }"
        >
          <div class="GeneralTableMobileRow__title">
            <span>{{ col.title }}</span>

            <img
              v-if="col.editable"
              src="@/bash-frontend-kit/icons/edit-md.svg"
              alt=""
              class="GeneralTableMobileRow__edit"
              @click="edit(col)"
            />
          </div>
          <UserTableCell
            v-if="isUser(col.format)"
            :type="false"
            :value="col.value"
          />
          <div
            v-else-if="isCheckbox(col.format)"
            class="GeneralTableMobileRow__value"
          >
            <CheckboxTableCell
              :format="col.format"
              :value="col.value"
              @change="updateCell({ slug: col.slug, value: $event })"
            />
          </div>
          <div
            v-else-if="isAction(col.format)"
            class="GeneralTableMobileRow__value"
          >
            <ActionTableCell
              :value="col.value"
              @change="emitAction"
            />
          </div>
          <TableCellWrap
            v-else
            :link="col.link"
            class="GeneralTableMobileRow__value"
          >
            {{ col.value?.value ?? col.value }}
          </TableCellWrap>
        </div>
      </div>
    </AccordionTransition>
    <GeneralTableMobileLine
      v-if="info.action"
      :content="info.action"
      :opened="fullContent"
      :type="RowMobileInfoItemType.CELL"
      :format="TableCellFormat.ACTION"
      @change="emitAction"
    />
  </div>

  <ApplicationModalChangeCol
    v-if="editingCol"
    :col="editingCol"
    opened
    @close="edit()"
    @save="saveCol"
  />
</template>

<script lang="ts" setup>
import AccordionTransition from '~/bash-frontend-kit/components/global/animation/AccordionTransition.vue';
import { dateTime } from '~/bash-frontend-kit/libs/date-time/dateTime';
import {
  NormalizedRowMobileInfo,
  NormalizedTableCell,
  RowMobileInfoItemType,
} from '~/bash-frontend-kit/types/table/NormalizedTable';
import GeneralTableMobileLine from '~/bash-frontend-kit/components/table/GeneralTableMobileLine.vue';
import Column from '~/bash-frontend-kit/types/models/Column';
import { TableCellFormat } from '~/bash-frontend-kit/types/table/TableCellFormat';
import UserTableCell from '~/bash-frontend-kit/components/table/cells/UserTableCell.vue';
import CheckboxTableCell from '~/bash-frontend-kit/components/table/cells/CheckboxTableCell.vue';
import AppLink from '~/bash-frontend-kit/components/app/AppLink.vue';
import ActionTableCell from '~/bash-frontend-kit/components/table/cells/ActionTableCell.vue';
import ApplicationModalChangeCol from '~/bash-frontend-kit/components/table/ApplicationModalChangeCol.vue';
import { TableRowAction } from '~/bash-frontend-kit/utils/data/_consts';
import TableCellWrap from '~/bash-frontend-kit/components/table/cells/base/TableCellWrap.vue';

const props = defineProps<{
  id: number;
  info: NormalizedRowMobileInfo;
  row: NormalizedTableCell[];
  titles: Column[];
  hideActions?: boolean;
}>();

type cellChanges = { slug: string; value: any };

const emit = defineEmits<{
  (e: 'change', changes: cellChanges);
  (e: 'action', action: TableRowAction);
}>();

const editingCol = ref();

const fullContent = ref<boolean>(!!props.info.permanentOpen);

const rowNormalize = computed(() =>
  props.row.reduce((list, col, index) => {
    const value = getValue(col.value, col.format);
    if (value || value === 0 || value === false) {
      const title = props.titles[index];
      if (title && !props.info.slugs.includes(title.slug)) {
        list.push({
          value,
          title: title.name,
          format: col.format,
          slug: col.slug,
          editable: !!col.options && col.format === TableCellFormat.STRING,
          link: col.link,
        });
      }
    }
    return list;
  }, [])
);

function updateCell(changes: cellChanges) {
  emit('change', changes);
}

function emitAction() {
  emit('action', TableRowAction.action);
}

function toggleFullContent() {
  fullContent.value = !fullContent.value;
}

function isUser(type) {
  return type === TableCellFormat.USER_OBJECT;
}

function isCheckbox(type) {
  return [
    TableCellFormat.COMPLETED,
    TableCellFormat.PAYED,
    TableCellFormat.PAID,
  ].includes(type);
}

function isAction(type) {
  return TableCellFormat.ACTION === type;
}

function getValue(value: any, type: TableCellFormat) {
  switch (type) {
    case TableCellFormat.DATE:
      return formatDate(value);
    case TableCellFormat.BOOLEAN:
      return value ? 'Есть' : 'Нет';
    case TableCellFormat.ACTIVE:
      return value ? 'Активна' : 'Не активна';
    case TableCellFormat.LIST:
      return value?.join?.(', ') || value;
    case TableCellFormat.USER_OBJECT:
    case TableCellFormat.ICON_OBJECT:
      return value;

    case TableCellFormat.COLOR_OBJECT:
    case TableCellFormat.PRIORITY:
      return value?.text || value;
    default:
      return value;
  }
}

function formatDate(date) {
  if (date) {
    return dateTime(date).formatFullDateTime();
  }
}

function edit(col = null) {
  editingCol.value = col;
}

function saveCol(value) {
  updateCell({ slug: editingCol.value.slug, value });
  edit();
}
</script>

<style lang="scss">
.GeneralTableMobileRow {
  padding: 25px 40px;
  border-bottom: 1px solid #edeef4;
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &__menu-btn {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
  }

  &__hide-btn {
    position: absolute;
    right: 0;
    top: min(100%, 102px);
    padding: 10px;
    margin: -20px -5px -5px;
    transition: transform $transition;
  }

  &__main {
    position: relative;

    display: flex;
    flex-direction: column;
  }

  &__description {
    width: 100%;
  }

  &__header {
    margin-bottom: 10px;
  }

  &__header + &__hide-btn {
    top: 35px;
  }

  &__content {
    display: flex;
    align-items: center;
    align-self: flex-start;
    padding-right: 35px;

    text-decoration: none;
    width: 100%;
  }

  &__full-content {
    display: flex;
    flex-direction: column;
    margin-top: 20px;

    @include mobile {
      margin-top: 18px;
    }
  }

  &__item {
    .TableCellWrap {
      width: 100% !important;
    }

    &--action {
      margin-top: 25px;
      order: 5;

      .GeneralTableMobileRow__title {
        display: none;
      }
    }

    & + & {
      margin-top: 25px;

      @include mobile {
        margin-top: 18px;
      }
    }
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #b4bbc6;
    margin-bottom: 5px;
  }

  &__image {
    width: 45px;
    height: 45px;
    margin-right: 12px;

    border-radius: 12px;
  }

  &--open & {
    &__hide-btn {
      transform: rotate(180deg);
    }
  }

  .CheckboxTableCell {
    padding: 12px;
    background: #f5f6fa;
    border-radius: 12px;

    .BaseCheckbox__input:not(.BaseCheckbox__input--active) {
      background: #ffffff;
    }
  }
}
</style>
