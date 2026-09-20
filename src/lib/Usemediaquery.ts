import { useEffect, useState } from 'react';

/**
 * Tracks whether a CSS media query currently matches, re-evaluating on
 * viewport changes (resize, orientation change, devtools breakpoint
 * switching). Use this only when a layout decision genuinely can't be
 * expressed with Tailwind's responsive class variants alone — e.g. gating
 * JS-driven behavior like scroll-pinning, not for styling.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}