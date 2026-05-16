/** AVIF assets under `public/new-about-page-assets/`. */
const BASE = "/new-about-page-assets";

export const aboutAssets = {
  portrait: `${BASE}/nse-1111402417421280693-85103.avif`,
  listeningAlbum: `${BASE}/the_black_keys_album_art_1.avif`,
  bookDevilsAdvocate: `${BASE}/the-devils-advocate-9781451682557_hr.avif`,
  bookCultureMap: `${BASE}/9781610392761.avif`,
  bookHoverCat: `${BASE}/elmowg-elmo-cat.gif`,
  bookHoverOffice: `${BASE}/the-office-handshake-meme-template-regular-f1d1d45c.webp`,
} as const;

export const SPOTIFY_PEACHES_ALBUM_URL =
  "https://open.spotify.com/album/4wl0lStE236Kc7pJ7eTpgq";

const whatsappTimelinePhoto = "WhatsApp Image 2026-05-16 at 12.56.46.avif";

export const aboutTimelineAssets = {
  photoStripRobo: "/play/robo1.avif",
  photoStripMiddle: `${BASE}/image_133.avif`,
  photoStripWhatsapp: `${BASE}/${encodeURIComponent(whatsappTimelinePhoto)}`,
  rocketMortgagePhoto: `${BASE}/nse-5891242651126496402-65962.avif`,
} as const;

export const TARS_ICON_SRC = "/Icons/Tars%20Icon%20Logo.svg";
export const ROCKET_MORTGAGE_ICON_SRC = "/Icons/RM%20Logo%20Icon.svg";
