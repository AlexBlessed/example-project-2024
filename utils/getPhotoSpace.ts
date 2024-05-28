export function getPhotoSpace(apiUrl: string, spaceId: number, fileName: string, size) {
  if(fileName?.[size]) {
    if(fileName?.[size]?.startsWith('http')) {
      return fileName[size];
    }
    else {
      return `${apiUrl}/storage/uploads/spaces/${spaceId}/${fileName?.[size]}`;
    }
  }
}
