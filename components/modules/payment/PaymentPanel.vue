<template>
  <div class="PaymentPanel">
    <div class="PaymentPanel__subtitle" v-if="subTitle">{{ subTitle }}</div>
    <h2 class="PaymentPanel__title" v-if="title">{{ title }}</h2>
    <slot/>
    <h2 class="PaymentPanel__total">
      <span>Итого</span>
      <span>{{ formattedPrice }}</span>
    </h2>
    <div class="PaymentPanel__actions">
      <slot name="actions" :price="formattedPrice"/>
    </div>
    <PaymentsMethodsInfo/>
    <slot name="footer"/>
  </div>
</template>

<script setup lang="ts">
import PaymentsMethodsInfo from '~/bash-frontend-kit/components/modules/payment/PaymentsMethodsInfo.vue';
import { formatPrice } from '~/bash-frontend-kit/utils/format/formatPrice';

const props = defineProps<{
  title: string;
  subTitle?: string;
  price: number;
}>();

const formattedPrice = computed(() => formatPrice(props.price));
</script>

<style lang="scss">
.PaymentPanel {
  flex-shrink: 0;
  padding: 40px 50px;
  width: 400px;

  background: #ffffff;
  box-shadow: 0 14px 42px -7px rgba(228, 228, 234, 0.4);
  border-radius: 20px;

  @include mobile {
    padding: 30px 20px;
    margin: 0 -20px;
    width: auto;
    box-shadow: none;
  }

  &__title {
    margin-bottom: 40px;

    @include mobile {
      margin-bottom: 20px;
    }
  }

  &__subtitle {
    margin-bottom: 4px;
  }


  &__total {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    margin: 25px 0;
  }

  &__actions {
    display: grid;
    grid-gap: 15px;

    margin-bottom: 25px;

    .BaseCheckbox {
      margin-bottom: 10px;
    }
  }
}
</style>
