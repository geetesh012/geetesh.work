import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

export function usePinnedSection(
  sectionRef: RefObject<HTMLElement | null>,
  enabled: boolean = true
): CSSProperties {
  const [style, setStyle] = useState<CSSProperties>({ position: "relative" });
  const phaseRef = useRef<"before" | "pinned" | "after">("before");

  useEffect(() => {
    if (!enabled) {
      phaseRef.current = "before";
      setStyle({ position: "relative" });
      return;
    }

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
  }, [sectionRef, enabled]);

  return style;
}