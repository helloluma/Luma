// The cut-out people who greet visitors on the landing hero and the demo ask
// screen. One is picked at random on the client after mount, so the server
// render and the first client render agree.
export const HERO_IMAGES = [
  { src: "/hero/hk-woman-black.webp", left: "41%" }, // woman, natural hair
  { src: "/hero/hk-man-older.webp", left: "45%" }, // older man
  { src: "/hero/hk-woman-ea.webp", left: "41%" }, // woman, low bun
  { src: "/hero/hk-man-sa.webp", left: "41%" }, // man, glasses
  { src: "/hero/hk-woman-latina.webp", left: "41%" }, // Latina woman (full color)
];

export function randomHero() {
  return HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];
}
