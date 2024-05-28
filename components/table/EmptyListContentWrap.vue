<template>
  <div class="EmptyListContentWrap">
    <div class="EmptyListContentWrap__body">
      <slot name="body" />
    </div>
    <div class="EmptyListContentWrap__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.EmptyListContentWrap {
  &__body {
    max-width: 560px;

    div + div,
    p + p {
      margin-top: 30px;
    }

    ul,
    ol {
      padding-left: 24px;
      margin-top: 16px;

      li {
        margin-bottom: 5px;

        &:last-child {
          margin-bottom: 0;
        }

        &::marker {
          color: #ff7739;
        }
      }
    }
  }

  &__actions {
    margin-top: 40px;
  }
}
</style>
