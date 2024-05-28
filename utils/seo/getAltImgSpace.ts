import { SpaceDetails } from '~/types/models/SpaceDetails';

export default function getAltImgSpace(space: SpaceDetails, index: number) {
  const type = space?.type;
  const nameOrig = space?.original_title;
  if(index) {
    return `${type} «${nameOrig}» – фото №${index+1}`;
  }
  else {
    return `Фото ${type} «${nameOrig}» – смотри на сайте!`;
  }
}
