import Swiper from "https://unpkg.com/swiper@7/swiper-bundle.esm.browser.min.js";

export default function renewSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 24,
    width: 254,
    breakpoints: {
      768: {
        width: 229,
      },
      1440: {
        width: 330,
      },
    },
  });
}
