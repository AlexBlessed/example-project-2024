<template>
  <div class="AddNewLeadButton">
    <p>{{ title }}</p>
    <BaseButton
      v-if="btnText"
      :md-slim="!main"
      @click="$emit('add')"
    >
      <img
        src="@/bash-frontend-kit/icons/add-application.svg"
        alt=""
      />
      <span>
        <slot>{{ btnText }}</slot>
      </span>
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
import BaseButton from '~/bash-frontend-kit/components/form/BaseButton';
import { computed, useRoute } from '#imports';
import { TypeContentLead } from '~/bash-frontend-kit/consts/TypeContentLead';

const props = defineProps<{
  activeItem?: TypeContentLead;
}>();

defineEmits<{
  (e: 'add');
}>();

const route = useRoute();

const title = computed(() => {
  if (!props.activeItem) {
    if (route.path.includes('tasks')) return 'Нет задач';
    else if (route.path.includes('roles')) return 'Нет ролей';
    else if (route.path.includes('finance/money')) return 'Нет поступлений';
    else if (route.path.endsWith('finance')) return 'Нет счетов';
    else if (route.path.includes('invoices')) return 'Нет счетов';
    else if (route.path.includes('payments')) return 'Нет поступлений';
    else if (route.path.includes('deals')) return 'Нет заявок';
    else if (route.path.includes('reviews')) return 'Нет отзывов';
    else if (route.path.includes('spaces')) return 'Нет площадок';
    else if (route.path.includes('users')) return 'Нет контактов';
    else return 'Нет данных';
  } else if (props.activeItem === TypeContentLead.TASKS) return 'Нет задач';
  else if (props.activeItem === TypeContentLead.INVOICES) return 'Нет счетов';
  else if ([TypeContentLead.LEAD, TypeContentLead.LEAD_MP].includes(props.activeItem))
    return 'У вас пока нет заявок';
  else if (props.activeItem === TypeContentLead.AUTO_ACTIONS)
    return 'Нет автодействий';
  else if (props.activeItem === TypeContentLead.REVIEWS) return 'Нет отзывов';
  else if (props.activeItem === TypeContentLead.PAYMENTS)
    return 'Нет поступлений';
});

const btnText = computed(() => {
  if (!props.activeItem) {
    if (route.path.includes('tasks')) return 'Добавить задачу';
    else if (route.path.includes('reviews')) return false;
    else if (route.path.includes('invoices')) return 'Добавить счёт';
    else if (route.path.includes('deals')) return 'Добавить заявку';
    else if (route.path.includes('payments')) return 'Добавить поступление';
    else if (route.path.includes('roles')) return 'Добавить роль';
    else if (route.path.includes('finance/money'))
      return 'Добавить поступление';
    else if (route.path.endsWith('finance')) return 'Добавить счёт';
    else if (route.path.includes('users')) return 'Добавить контакт';
    else if (route.path.includes('spaces')) return 'Добавить площадку';
    else if (route.path.endsWith('reports')) return false;
    else return 'Добавить';
  } else if (props.activeItem === TypeContentLead.TASKS)
    return 'Добавить задачу';
  else if (props.activeItem === TypeContentLead.INVOICES)
    return 'Добавить счёт';
  else if (props.activeItem === TypeContentLead.LEAD) return 'Отправить заявку';
  else if (props.activeItem === TypeContentLead.REVIEWS) return false;
  else if (props.activeItem === TypeContentLead.PAYMENTS)
    return 'Добавить поступление';
  else if (props.activeItem === TypeContentLead.LEAD_MP)
    return 'Найти площадки';
});
</script>

<style lang="scss">
.AddNewLeadButton {
  display: block;

  min-height: 40vh;
  height: 100%;
  max-width: 500px;

  &--main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: unset;
  }

  @include mobile {
    padding: 25px 0 0 40px;
  }

  p {
    margin-bottom: 18px;

    font-weight: 400;
    font-size: 16px;
    line-height: 23px;
    color: #3b4453;
  }

  button {
    width: auto;
  }
}
</style>
