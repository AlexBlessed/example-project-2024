export default [
  '/font-face/Circe/Circe-Regular.woff',
  '/font-face/Circe/Circe-Bold.woff',
  '/font-face/Montserrat/Montserrat-Bold.woff',
  '/font-face/Montserrat/Montserrat-ExtraBold.woff',
].map(getLinkPreload);

function getLinkPreload(href) {
  return { rel: 'preload', as: 'font', fetchpriority: 'high', type: 'font/woff', href: href };
}
