import { defineStore } from 'pinia';
import { cookies } from '~/bash-frontend-kit/utils/data/_consts';
import { UserProfile } from '~/bash-frontend-kit/types/models/User';
import { useHttp } from '~/bash-frontend-kit/composables/useHttp';
import { computed, ref, useCookie, useNuxtApp, useRuntimeConfig } from '#imports';
import Emitter from '~/bash-frontend-kit/libs/emitter/Emitter';
import { adminRoles, crmRoles, UserRoleType } from '~/bash-frontend-kit/types/models/UserRoleType';
import getUrlToCrm from '~/bash-frontend-kit/utils/browser/getUrlToCrm';

export enum AuthEvents {
  authorization = 'authorization',
  authorized = 'authorized',
  cancel = 'cancel',
}

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig();
  const app = useNuxtApp();
  const devMode = config.public.devMode;

  const user = ref<UserProfile>(null);
  const token = useCookie<string>(cookies.TOKEN, { maxAge: 3600 * 24 * 365 });
  const fromAuthRoute = useCookie<string>(cookies.FROM_AUTH_ROUTE, {
    maxAge: 3600,
  });

  const loggedIn = computed(() => !!token.value);
  const emitter = new Emitter();

  const isUserRoleClient = computed(
    () => !crmRoles.includes(user.value?.role)
  );

  const isUserRoleAdmin = computed(
    () => adminRoles.includes(user.value?.role)
  );

  const isOwner = computed(
    () => config.public.usersRole === UserRoleType.OWNER
  );

  const isClient = computed(
    () => config.public.usersRole === UserRoleType.CLIENT
  );

  const permissions = computed(() => user.value?.role_permissions ?? {});

  function setRouteFromAuth(route?: string) {
    fromAuthRoute.value = route;
  }

  function setToken(newToken?: string) {
    token.value = newToken;
  }

  function setUser(newUser?: UserProfile) {
    user.value = newUser;
    app.$sentrySetUser?.(newUser?.id);
    if(app.$timezoneOffset) {
      app.$timezoneOffset.value = newUser?.timezone_offset;
    }

    if (!devMode && process.client && isClient.value && crmRoles.includes(newUser?.role)) {
      location.href = getUrlToCrm('/dashboard', token.value);
      setToken(null);
      setUser(null);
    }
  }

  function changeUser(dataUpdate: object) {
    setUser({
      ...user.value,
      ...dataUpdate,
    });
  }

  function fetchUser() {
    const http = useHttp();
    return http.get<UserProfile>(config.public.apiProfilePath).then(
      (user) => {
        setUser(user);
      },
      (e) => {
        console.warn('reset user', e);
        setToken(null);
        setUser(null);
      }
    );
  }

  async function logout() {
    try {
      await useHttp().delete(config.public.apiLogoutPath);
    } catch (e) {
      console.warn('logout', e);
    }
    setToken(null);
    setUser(null);
  }

  return {
    user,
    isOwner,
    isClient,
    token,
    isUserRoleClient,
    isUserRoleAdmin,
    permissions,
    setToken,
    setUser,
    changeUser,
    fetchUser,
    logout,
    setRouteFromAuth,
    loggedIn,
    fromAuthRoute,
    emitter,
  };
});
