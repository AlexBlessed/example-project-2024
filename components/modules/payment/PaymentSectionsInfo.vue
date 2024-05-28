<template>
  <div class="PaymentSectionsInfo">
    <CardBlock
      v-for="section in sections"
      :title="section.title"
      :collapsable="false"
      readonly
      white
    >
      <template v-for="item in section.items" :key="item.title">
        <ApplicationGeneralDatePickerItem
          v-if="item.format === 'datetime'"
          :label="item.title"
          :model-value="item.value"
          :editing="false"
          is-time
        />
        <ApplicationGeneralSelectItem
          v-else-if="item.url"
          :label="item.title"
          :option="item"
          :model-value="item.value"
          :get-option-label="(el) => el.value"
        />
        <ApplicationGeneralLabel
          v-else
          :label="item.title"
        >
          <div class="PaymentSectionsInfo__value">
            {{ item.value || '–' }}
          </div>
        </ApplicationGeneralLabel>
      </template>

    </CardBlock>
  </div>
</template>

<script setup lang="ts">
import { PaymentInfoSection } from '~/bash-frontend-kit/types/payment/PaymentInfo';
import CardBlock from '~/bash-frontend-kit/components/global/CardBlock.vue';
import ApplicationGeneralDatePickerItem
  from '~/bash-frontend-kit/components/global/ApplicationGeneralDatePickerItem.vue';
import ApplicationGeneralSelectItem from '~/bash-frontend-kit/components/global/ApplicationGeneralSelectItem.vue';
import ApplicationGeneralLabel from '~/bash-frontend-kit/components/global/ApplicationGeneralLabel.vue';

defineProps<{
  sections?: PaymentInfoSection[];
}>();
</script>

<style lang="scss">
.PaymentSectionsInfo {
  max-width: 467px;

  &__value {
    @include mobile {
      margin-top: 2px;
    }
  }

  .ApplicationGeneralLabel__label {
    margin-top: 0;
  }
}
</style>
