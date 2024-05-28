import {formatNumber} from "~/bash-frontend-kit/utils/format/formatNumber";
import {formatPrice} from "~/bash-frontend-kit/utils/format/formatPrice";

export function formatPriceRange(from: number, to: number, label: string = 'час'): string {
  if (from == null && to == null) {
   return '';
  }

  if (from === to || to == null) {
    return `от ${formatPrice(from)} / ${label}`;
  } else {
    return `от ${formatNumber(from)} до ${formatPrice(to)} / ${label}`;
  }
}
