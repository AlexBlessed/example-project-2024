
export function useInterval(callback: (...args: any[]) => any, timeout: number, initCall = false) {
  let interval;

  function clear() {
    clearInterval(interval);
  }

  onMounted(() => {
    interval = setInterval(callback, timeout);

    if (initCall) {
      callback();
    }
  });

  onBeforeUnmount(() => clear());

  return clear;
}
