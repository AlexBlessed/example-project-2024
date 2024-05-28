import { IdentifiedItem } from 'bash-frontend-kit/types/models/IdentifiedItem';

export function useSelectedList() {
  const selected = ref<number[]>([]);

  function changeSelected(item: IdentifiedItem, isActive: boolean) {
    if (isActive) {
      selected.value.push(item.id);
    } else {
      selected.value.splice(selected.value.indexOf(item.id), 1);
    }
  }

  function isSelected(item: IdentifiedItem) {
    return selected.value.includes(item.id);
  }

  return {
    selected,
    changeSelected,
    isSelected,
  };
}
