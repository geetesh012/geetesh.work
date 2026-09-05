import { useEffect, useRef, useState } from "react";

interface SamuraiPreloaderProps {
  /** Shown as the wordmark under the ensō. */
  siteName?: string;
  /** Small letter-spaced line under the wordmark. */
  tagline?: string;
  /** Kanji revealed at the center once the circle closes. 侍 = samurai, 道 = "the way", 刀 = sword. */
  kanji?: string;
  /** Guaranteed minimum time on screen (ms), so it never just flashes on a fast load. */
  minDisplayMs?: number;
  /** Called once the fade-out transition has finished and the component is about to unmount. */
  onComplete?: () => void;
}

export default function SamuraiPreloader({
  siteName = "GEETESH KANKONKAR",
  tagline = "PORTFOLIO  ·  EST. 2026",
  kanji = "侍",
  minDisplayMs = 1200,
  onComplete,
}: SamuraiPreloaderProps) {
  const strokeRef = useRef<SVGCircleElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const pctRef = useRef<HTMLSpanElement | null>(null);

  const [chromeVisible, setChromeVisible] = useState(false);
  const [kanjiVisible, setKanjiVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const R = 86;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const GAP = CIRCUMFERENCE * 0.09; // the ensō's traditional "opening"
  const DRAW = CIRCUMFERENCE - GAP;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    let rafId = 0;
    let progress = 0;
    let pageLoaded = false;
    let kanjiShown = false;
    const startTime = Date.now();
    let loadTimeoutId: ReturnType<typeof setTimeout> | undefined;
    let finishTimeoutId: ReturnType<typeof setTimeout> | undefined;
    let removeTimeoutId: ReturnType<typeof setTimeout> | undefined;

    const effectiveMinDisplay = prefersReducedMotion ? 0 : minDisplayMs;

    const handleLoad = () => {
      const remaining = effectiveMinDisplay - (Date.now() - startTime);
      loadTimeoutId = setTimeout(() => {
        pageLoaded = true;
      }, Math.max(0, remaining));
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Reveal the static chrome (wordmark, tagline, progress line) right away;
    // the kanji stays reserved as the one "reveal" moment at the end.
    requestAnimationFrame(() => setChromeVisible(true));

    const setProgress = (p: number) => {
      const clamped = Math.max(0, Math.min(100, p));
      const offset = CIRCUMFERENCE - DRAW * (clamped / 100);

      if (strokeRef.current) strokeRef.current.style.strokeDashoffset = String(offset);
      if (fillRef.current) fillRef.current.style.width = `${clamped}%`;
      if (tipRef.current) tipRef.current.style.left = `${clamped}%`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(clamped)}%`;

      if (clamped >= 94 && !kanjiShown) {
        kanjiShown = true;
        setKanjiVisible(true);
      }
    };

    const finish = () => {
      finishTimeoutId = setTimeout(() => {
        setIsHidden(true);
        document.documentElement.style.overflow = originalOverflow;
        removeTimeoutId = setTimeout(() => {
          setIsRemoved(true);
          onComplete?.();
        }, 950);
      }, 450);
    };

    const tick = () => {
      const target = pageLoaded ? 100 : 90;
      progress += (target - progress) * 0.02 + 0.035;
      if (progress >= target) progress = target;
      setProgress(progress);

      if (progress < 99.6) {
        rafId = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };

    if (strokeRef.current) {
      strokeRef.current.style.strokeDasharray = String(CIRCUMFERENCE);
      strokeRef.current.style.strokeDashoffset = String(CIRCUMFERENCE);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("load", handleLoad);
      clearTimeout(loadTimeoutId);
      clearTimeout(finishTimeoutId);
      clearTimeout(removeTimeoutId);
      document.documentElement.style.overflow = originalOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isRemoved) return null;

  return (
    <div
      className={`sp-preloader${isHidden ? " sp-is-hidden" : ""}`}
      role="status"
      aria-live="polite"
    >
      <style>{`
        /* Uses Harmond, Ranade and Noto Sans JP — all defined via @font-face
           in this project's index.css, so nothing needs to be loaded here. */

        .sp-preloader{
          --sp-ink:#141210;
          --sp-ink-deep:#0b0a09;
          --sp-washi:#e9dfc6;
          --sp-washi-dim:#a4967a;
          --sp-shu-bright:#B91729;
          --sp-gold:#c9a86a;
          position:fixed; inset:0;
          display:flex; align-items:center; justify-content:center;
          background: radial-gradient(ellipse 120% 90% at 50% 38%, var(--sp-ink) 0%, var(--sp-ink-deep) 78%);
          z-index:9999;
          font-family:'Noto Sans JP', 'Hiragino Sans', sans-serif;
          transition: opacity .9s cubic-bezier(.65,0,.35,1), filter .9s ease;
        }
        .sp-preloader.sp-is-hidden{ opacity:0; filter:blur(8px); pointer-events:none; }

        .sp-grain{
          position:absolute; inset:0; opacity:.06; mix-blend-mode:overlay; pointer-events:none;
          background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        }

        .sp-core{ position:relative; display:flex; flex-direction:column; align-items:center; padding:0 24px; }

        .sp-enso{ position:relative; width:clamp(140px,32vw,220px); aspect-ratio:1/1; display:flex; align-items:center; justify-content:center; }
        .sp-enso-glow{ position:absolute; inset:-18%; border-radius:50%; background:radial-gradient(circle, rgba(201,168,106,.22), transparent 68%); animation:sp-glow 4.4s ease-in-out infinite; }
        @keyframes sp-glow{ 0%,100%{ opacity:.45; transform:scale(1);} 50%{ opacity:1; transform:scale(1.07);} }

        .sp-enso svg{ width:100%; height:100%; overflow:visible; }
        .sp-enso-track{ fill:none; stroke:rgba(233,223,198,.09); stroke-width:9; }
        .sp-enso-stroke{ fill:none; stroke:url(#sp-inkGrad); stroke-width:10; stroke-linecap:round; filter:url(#sp-inkTexture); }
        .sp-enso-fleck{ fill: var(--sp-gold); opacity:.85; }
        .sp-grad-start{ stop-color: var(--sp-gold); }
        .sp-grad-end{ stop-color: var(--sp-shu-bright); }

        .sp-kanji{
          position:absolute; font-family:'Noto Sans JP', sans-serif; font-weight:700;
          font-size:clamp(38px,9vw,54px); color:var(--sp-washi);
          opacity:0; transform:scale(.8);
          transition:opacity .8s ease, transform .8s cubic-bezier(.34,1.56,.64,1);
        }
        .sp-kanji.sp-show{ opacity:1; transform:scale(1); }

        .sp-wordmark{
          margin-top:30px; font-family:'Harmond', 'Noto Sans JP', serif; font-weight:600; font-stretch:condensed;
          font-size:clamp(22px,4.5vw,30px); letter-spacing:.06em; color:var(--sp-washi);
          opacity:0; transform:translateY(8px);
          transition:opacity .7s ease .1s, transform .7s ease .1s;
        }
        .sp-wordmark.sp-show{ opacity:1; transform:translateY(0); }

        .sp-tagline{
          margin-top:8px; font-family:'Ranade', 'Noto Sans JP', sans-serif; font-size:11px; letter-spacing:.24em; color:var(--sp-washi-dim);
          opacity:0; transition:opacity .7s ease .2s;
        }
        .sp-tagline.sp-show{ opacity:1; }

        .sp-progress{ margin-top:38px; display:flex; align-items:center; gap:14px; opacity:0; transition:opacity .7s ease .3s; }
        .sp-progress.sp-show{ opacity:1; }
        .sp-progress-track{ position:relative; width:min(46vw,180px); height:1px; background:rgba(233,223,198,.18); }
        .sp-progress-fill{ position:absolute; left:0; top:0; height:100%; width:0%; background:linear-gradient(90deg,var(--sp-gold),var(--sp-shu-bright)); }
        .sp-progress-tip{ position:absolute; top:50%; width:5px; height:5px; background:var(--sp-shu-bright); transform:translate(-50%,-50%) rotate(45deg); box-shadow:0 0 6px var(--sp-shu-bright); left:0%; }
        .sp-progress-pct{ font-family:'Ranade', 'Noto Sans JP', sans-serif; font-size:12px; letter-spacing:.05em; color:var(--sp-washi-dim); min-width:32px; font-variant-numeric:tabular-nums; }

        .sp-sr-only{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; }

        @media (prefers-reduced-motion: reduce){
          .sp-enso-glow{ animation:none; opacity:.7; }
          .sp-preloader, .sp-kanji, .sp-wordmark, .sp-tagline, .sp-progress{ transition-duration:.01ms !important; }
        }
      `}</style>

      <div className="sp-grain" />

      <div className="sp-core">
        <div className="sp-enso">
          <div className="sp-enso-glow" />
          <svg viewBox="0 0 220 220">
            <defs>
              <filter id="sp-inkTexture" x="-30%" y="-30%" width="160%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency="0.012 0.9" numOctaves={2} seed={7} result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale={3.2} />
              </filter>
              <linearGradient id="sp-inkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop className="sp-grad-start" offset="0%" />
                <stop className="sp-grad-end" offset="100%" />
              </linearGradient>
            </defs>
            <circle className="sp-enso-track" cx={110} cy={110} r={R} />
            <circle ref={strokeRef} className="sp-enso-stroke" cx={110} cy={110} r={R} transform="rotate(-98 110 110)" />
            <circle className="sp-enso-fleck" cx={99} cy={25} r={5} />
          </svg>
          <div className={`sp-kanji${kanjiVisible ? " sp-show" : ""}`}>{kanji}</div>
        </div>

        <div className={`sp-wordmark${chromeVisible ? " sp-show" : ""}`}>{siteName}</div>
        <div className={`sp-tagline${chromeVisible ? " sp-show" : ""}`}>{tagline}</div>

        <div className={`sp-progress${chromeVisible ? " sp-show" : ""}`}>
          <div className="sp-progress-track">
            <div ref={fillRef} className="sp-progress-fill" />
            <div ref={tipRef} className="sp-progress-tip" />
          </div>
          <span ref={pctRef} className="sp-progress-pct">0%</span>
        </div>
      </div>

      <span className="sp-sr-only">Loading page, please wait.</span>
    </div>
  );
}