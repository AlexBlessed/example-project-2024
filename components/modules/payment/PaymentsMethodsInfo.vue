<template>
  <div class="PaymentsMethodsInfo">
    <div class="PaymentsMethodsInfo__description">
      Вы перейдёте на страницу оплаты сервиса «Тинькоф». Безопасность
      гарантирована протоколом HTTPS и сертификатом PCI DSS.
    </div>
    <div class="PaymentsMethodsInfo__payment-methods">
      <img
        src="@/bash-frontend-kit/icons/payment/visa-logo.svg"
        alt="Visa"
      />
      <img
        src="@/bash-frontend-kit/icons/payment/mastercard-logo.svg"
        alt="Mastercard"
      />
      <img
        src="@/bash-frontend-kit/icons/payment/mir-logo.svg"
        alt="Мир"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentsMethodsInfo',
};
</script>

<style lang="scss">
.PaymentsMethodsInfo {
  &__description {
    margin-bottom: 15px;

    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #b4bbc6;
  }

  &__payment-methods {
    margin: -7px;

    img {
      margin: 7px;
    }
  }
}
</style>
