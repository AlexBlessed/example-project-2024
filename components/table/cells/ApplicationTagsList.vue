<template>
  <div
    v-if="list && list.length"
    class="ApplicationTagsList"
    :class="{'ApplicationTagsList--long': long}"
  >
    <Component
      :is="getComponentTag(tag)"
      v-for="(tag, i) in listFiltred.slice(0, props.maxLength)"
      v-bind="getPropsTag(tag)"
      :key="i"
      class="ApplicationTagsList__tag"
    >
      {{ getTag(tag) }}
    </Component>
    <div
      v-if="list.length > props.maxLength"
      class="ApplicationTagsList__more-tags"
    >
      + {{ listFiltred.length - props.maxLength }}
      <div class="ApplicationTagsList__more-tags--modal">
        <Component
          :is="getComponentTag(tag)"
          v-for="(tag, i) in listFiltred.slice(props.maxLength)"
          v-bind="getPropsTag(tag)"
          :key="i"
          class="ApplicationTagsList__tag"
        >
          {{ getTagInTagList(tag) }}
        </Component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '#imports';

type Tag = string | {text: string; link?: string};

interface Props {
  list?: Tag[];
  maxLength?: number;
  long?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  maxLength: 1,
});

const listFiltred = computed(() => props.list.filter((v) => (v?.text ?? v)?.trim()));

function getTag(tag) {
  const text = tag?.text || tag;
  if (text?.length > 19 && !props.long) return `${text.slice(0, 16)}...`;
  else return text;
}

function getTagInTagList(tag) {
  const text = tag?.text || tag;
  if (text?.length > 14 && !props.long) return `${text.slice(0, 14)}...`;
  else return text;
}

function isLinkTag(tag: Tag) {
  return tag && typeof tag !== 'string';
}
function getComponentTag(tag: Tag) {
  return isLinkTag(tag) ? 'a' : 'div';
}

function getPropsTag(tag: Tag) {
  if(isLinkTag(tag)) {
    return {
      target: '_blank',
      href: tag.link,
    }
  }
}
</script>

<style lang="scss">
.ApplicationTagsList {
  position: relative;
  display: flex;
  margin: -3px;

  &--long {
    flex-wrap: wrap;
    margin: -5px;
  }
  &--long & {
    &__tag, &__more-tags {
      white-space: normal;
      margin: 5px;
    }

    &__more-tags {
      position: static;

      &--modal {
        width: 100%;
        bottom: 0;
        margin-bottom: 50px;

        @include mobile {
          transform: translateX(-50%);
          left: 50%;
          width: 95vw;
        }
      }
    }
  }

  &__tag {
    text-overflow: ellipsis;
    max-width: 100%;
    overflow: hidden;
  }

  &__tag, &__more-tags {
    white-space: nowrap;
    padding: 3px 10px;
    background: var(--secondary);
    border-radius: 5px;
    color: var(--text);
    margin: 3px;
    text-decoration: none;

    &:hover {
      background: var(--secondary-hover);
    }
  }

  &__more-tags {
    position: relative;
    cursor: default;

    &:hover {
      background: #ff7739;
      color: #ffffff;

      .ApplicationTagsList__more-tags--modal {
        display: flex;
      }

      .ApplicationTagsList__tag + .ApplicationTagsList__tag {
        margin-left: 0;
      }
    }

    &--modal {
      display: none;
      flex-wrap: wrap;
      grid-gap: 10px 7px;

      position: absolute;
      bottom: calc(100% + 6px);
      right: 0;
      z-index: var(--z-index-dropdown);

      background: #ffffff;
      box-shadow: 4px 10px 37px rgba(180, 187, 198, 0.28);
      border-radius: 20px;
      padding: 20px;

      width: 200px;
      min-width: min-content;

      &:before {
        content: '';
        position: absolute;
        bottom: -50px;
        left: 0;
        width: 100%;
        height: 50px;
      }

      &--first {
        bottom: unset;
        top: calc(100% + 12px);

        &:before {
          content: '';
          position: absolute;
          top: -50px;
          left: 0;
          width: 100%;
          height: 50px;
        }
      }
    }
  }
}
</style>
