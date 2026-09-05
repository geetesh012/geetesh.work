import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

type ScrollToOptions = NonNullable<Parameters<Lenis["scrollTo"]>[1]>;

export function startSmoothScroll(): Lenis {
  if (lenis) return lenis;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  lenis = new Lenis({
    duration: reduceMotion ? 0 : 1.9,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
    smoothWheel: !reduceMotion,
    syncTouch: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time: number) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Scroll to an absolute pixel offset (used by Nav/Menu deep-links). */
export function scrollToY(y: number, opts: Partial<ScrollToOptions> = {}): void {
  if (lenis) {
    lenis.scrollTo(y, {
      duration: 1.4,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      ...opts,
    });
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

/** Scroll to a DOM element (used by mobile section nav + menu deep-links). */
export function scrollToEl(
  el: HTMLElement | null,
  opts: Partial<ScrollToOptions> = {},
): void {
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, {
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      ...opts,
    });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}