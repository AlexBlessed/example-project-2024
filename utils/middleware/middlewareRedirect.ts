import { defineNuxtRouteMiddleware, navigateTo, useHttp } from '#imports';

export interface ResponseRedirect {
  new_url?: string;
  code?: number;
}

const cacheMap = new Map();
let updateTime = Date.now();

function checkOld() {
  const time = Date.now() - updateTime;
  if (cacheMap.size > 10000 || time > 1000 * 60) {
    cacheMap.clear();
    updateTime = Date.now();
  }
}


function getData(url, urlCheck) {
  checkOld();
  const key = urlCheck;
  const isMp = urlCheck.startsWith('/marketplace');
  if (isMp && cacheMap.has(key)) {
    return cacheMap.get(key);
  } else {
    return useHttp().get<ResponseRedirect>({
      url,
      params: { url: urlCheck },
    }).then((data) => {
      if (isMp) {
        cacheMap.set(key, data);
      }
      return data;
    });
  }
}

export function middlewareRedirect(url, checker?: (to, from) => boolean) {
  return defineNuxtRouteMiddleware(async (to, from) => {
    try {
      const isPathOld = from.path === to.path && decodeURI(from.fullPath) !== to.fullPath;
      if (!process.server && isPathOld) {
        return;
      }
      if (!checker || checker(to, from)) {
        const data = await getData(url, to.fullPath);

        if (data?.new_url) {
          let url = data.new_url;
          if (!url.startsWith('/')) {
            url = `/${url}`;
          }

          console.warn(`[${data?.code}]:`, url);

          return navigateTo(decodeURIComponent(url), {
            redirectCode: 301,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
}
