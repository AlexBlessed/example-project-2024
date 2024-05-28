export function useArray<T = any>(initState: T[] = []) {
  const array = ref([...initState]);

  function add(...items) {
    array.value.push(...items);
  }

  function remove(itemToRemove) {
    array.value = array.value.filter((item) => item !== itemToRemove);
  }

  function toggle(item) {
    if (array.value.includes(item)) {
      remove(item);
    } else {
      add(item);
    }
  }

  return {
    array,
    add,
    remove,
    toggle,
  };
}
