import { SpaceDetails } from '~/types/models/SpaceDetails';
import { getPhotoSpace } from '~/utils/getPhotoSpace';

export function schemaOrgProduct(space: SpaceDetails, apiUrl) {
  const offer = schemaOrgProductOffer(space);
  if(!offer && !space.feedback_count) {
    return null;
  }
  return {
    '@id': space.id.toString(),
    sku: space.id,
    name: space.title,
    image: getPhotoSpace(apiUrl, space.id, space.photos[0], 'lg'),
    description: space.description,
    aggregateRating: space.feedback_count && {
      ratingValue: space.feedback_rating,
      reviewCount: space.feedback_count,
      bestRating: 5,
      worstRating: 0,
    } || null,
    offers: offer ? [offer] : [],
  };
}

export function schemaOrgProductOffer(space: SpaceDetails) {
  return (space.price_min_per_hour || space.price_min_per_day || space.price_min_deposit) && {
    price: space.price_min_per_hour || space.price_min_per_day || space.price_min_deposit,
    priceCurrency: 'RUB',
  } || null;
}
