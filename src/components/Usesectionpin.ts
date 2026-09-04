import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

/**
 * Pins `sectionRef`'s child to the viewport for the section's scroll range,
 * driven from JS instead of `position: sticky`.
 *
 * Why: `position: sticky` silently stops working if ANY ancestor has
 * `overflow` set to anything other than `visible`, or has a CSS `transform`
 * applied to it (which many smooth-scroll libraries — Lenis, Locomotive
 * Scroll, GSAP ScrollSmoother — do to the page wrapper). When that happens
 * the sticky child just scrolls away with the rest of the page instead of
 * pinning. This hook reproduces the same visual result with fixed/absolute
 * positioning, computed every animation frame instead of relying on the
 * browser's sticky algorithm.
 *
 * Note: this still won't pin correctly if an ancestor applies a CSS
 * `transform` for smooth scrolling — `position: fixed` is contained by a
 * transformed ancestor the same way `sticky` is. If you're using Lenis,
 * Locomotive Scroll, or GSAP ScrollSmoother, use that library's own pinning
 * (e.g. GSAP ScrollTrigger's `pin: true`) instead of this hook.
 */
export function usePinnedSection(
  sectionRef: RefObject<HTMLElement | null>
): CSSProperties {
  const [style, setStyle] = useState<CSSProperties>({ position: "relative" });
  const phaseRef = useRef<"before" | "pinned" | "after">("before");

  useEffect(() => {
    let raf: number;

    const update = () => {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const viewportH = window.innerHeight;

        let phase: "before" | "pinned" | "after";
        if (rect.top > 0) {
          phase = "before";
        } else if (rect.bottom <= viewportH) {
          phase = "after";
        } else {
          phase = "pinned";
        }

        if (phase !== phaseRef.current) {
          phaseRef.current = phase;
          if (phase === "before") {
            setStyle({ position: "relative" });
          } else if (phase === "pinned") {
            setStyle({ position: "fixed", top: 0, left: 0, width: "100%" });
          } else {
            setStyle({ position: "absolute", bottom: 0, left: 0, width: "100%" });
          }
        }
      }
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [sectionRef]);

  return style;
}