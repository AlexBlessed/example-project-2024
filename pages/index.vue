<template>
  <MainLayout gray-gradient>
    <div class="container">
      <div class="MainPage">
        <div class="MainPage__welcome-screen" v-bind="bgAttrs">
          <h1 class="MainPage__title">
            Более <br>
            500 площадок для <br>
            вашего мероприятия
          </h1>
          <CompactMarketplaceFiltersFormWidget />
        </div>
        <MainAdvantages class="MainPage__advantages" id="advantages" />
        <SpacesSelection
          class="MainPage__recommended-selection"
          title="Популярное"
          :spaces="recommended"
        />
        <PlatformTypesGallery class="MainPage__platforms-types-gallery" id="types" />
        <div class="MainPage__selections">
          <SpacesSelection
            v-for="({alias, title, list, link}) in types"
            :key="alias"
            :link="link"
            :title="title"
            :spaces="list"
          />
        </div>
        <SpaceHowItWorksBlock accent />
        <FAQBlock :faq="faq" bash />
        <SpaceJoinUsBlock />
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '~/layouts/main.vue';
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';
import CompactMarketplaceFiltersFormWidget from '~/components/main/CompactMarketplaceFiltersFormWidget.vue';
import MainAdvantages from '~/components/main/MainAdvantages.vue';
import SpacesSelection from '~/components/main/SpacesSelection.vue';
import PlatformTypesGallery from '~/components/main/PlatformTypesGallery.vue';
import FAQBlock from '~/bash-frontend-kit/components/modules/faq/FAQBlock.vue';
import SpaceJoinUsBlock from '~/components/space_details/SpaceJoinUsBlock.vue';
import SpaceHowItWorksBlock from '~/components/space_details/SpaceHowItWorksBlock.vue';
import { useMedia, useSeoMeta } from '#imports';
import getImgAttrPublicImage from '~/bash-frontend-kit/utils/browser/getImgAttrPublicImage';
import { computed } from 'vue';

const http = useHttp();
const media = useMedia();

const { recommended, types, faq } = await http.get('/marketplace/main?withFaq=true');

useSeoMeta({
  title: 'Маркетплейс площадок для аренды: лофты, студии, рестораны, конференц-залы и крыши',
  description: 'Сервис бронирования лофтов и других площадок в аренду для мероприятий. Аренда помещений под любой праздник, съемку, корпоратив, площадки для обучения и презентаций и многое другое. Без комиссии, с гарантией возврата средств.',
});

const getBgAttrs = getImgAttrPublicImage('/images/main-page/', true);
const bgAttrs = computed(() => media.md ? getBgAttrs('main-page-illustration-mobile') : getBgAttrs('main-page-illustration'));
</script>

<style lang="scss">
.MainPage {

  &__welcome-screen {
    padding: 80px 0 95px;
    margin-bottom: 150px;
    background-position: right top;
    background-size: contain;
    background-repeat: no-repeat;

    @include tablet {
      background-size: calc(100vw - var(--container-p) * 2) auto;
      background-position: calc(100% - var(--container-p)) 100px;
      margin: 0 var(--container-p-m) 80px;
      padding: 0 var(--container-p);
    }
  }

  &__title {
    margin-bottom: 40px;

    font-weight: 800;
    font-size: 40px;
    line-height: 50px;
    letter-spacing: -0.01em;


    @include tablet {
      margin-top: -20px;
      margin-bottom: 332px;

      font-size: 22px;
      line-height: 30px;
      letter-spacing: -0.01em;
    }
  }

  &__advantages {
    margin-bottom: 130px;

    @include mobile {
      margin-bottom: 80px;
    }
  }

  &__recommended-selection {
    margin-bottom: 90px;

    @include tablet {
      margin-bottom: 60px;
    }

    @include mobile {
      margin-bottom: 80px;
    }
  }

  &__platforms-types-gallery {
    margin-bottom: 100px;

    @include tablet {
      margin-bottom: 80px;
    }
  }

  &__selections {
    display: grid;
    grid-gap: 100px;

    margin-bottom: 100px;

    @include mobile {
      grid-gap: 80px;
    }
  }

  .SpaceHowItWorksBlock__bg path {
    fill: #EDEEF4;
  }
}
</style>
