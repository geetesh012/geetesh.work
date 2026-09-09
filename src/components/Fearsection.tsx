import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import ModelErrorBoundary from "./Modelerrorboundary";
import { usePinnedSection } from "./Usesectionpin";

const SwordModel = lazy(() => import("./Swordmodel"));

const STATEMENTS: { text: string; highlight?: string }[] = [
  { text: "MOST PEOPLE FEAR FAILURE." },
  { text: "WE FEAR SOMETHING QUIETER —", highlight: "QUIETER —" },
  { text: "RUNNING OUT OF PATIENCE.", highlight: "PATIENCE." },
  { text: "EVERY LINE, DELIBERATE.", highlight: "DELIBERATE." },
  { text: "EVERY CUT, EARNED.", highlight: "EARNED." },
  { text: "DISCIPLINE ISN'T THE \n ABSENCE OF FEAR —" },
  { text: "IT'S BUILDING ANYWAY.", highlight: "ANYWAY." },
];

const TICKER_WORDS = ["THE HAND WILL SHAKE", "THE MIND WILL NOT"];

const PIN_LENGTH_VH = STATEMENTS.length * 100;

const STATEMENT_EXIT_MS = 350;

// ─────────────────────────────────────────────
// Scroll → Statement Index
// ─────────────────────────────────────────────

function useScrollTargetIndex(
  sectionRef: RefObject<HTMLElement | null>,
  count: number,
) {
  const [index, setIndex] = useState(0);
  const lastIndex = useRef(0);

  useEffect(() => {
    let raf: number;

    const update = () => {
      const el = sectionRef.current;

      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;

        if (scrollable > 0) {
          const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);

          const progress = scrolled / scrollable;

          const nextIndex = Math.min(count - 1, Math.floor(progress * count));

          if (nextIndex !== lastIndex.current) {
            lastIndex.current = nextIndex;
            setIndex(nextIndex);
          }
        }
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    return () => cancelAnimationFrame(raf);
  }, [sectionRef, count]);

  return index;
}

// ─────────────────────────────────────────────
// Animated Statement Controller
// ─────────────────────────────────────────────

function useAnimatedStatement(targetIndex: number) {
  const [displayIndex, setDisplayIndex] = useState(targetIndex);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    if (targetIndex === displayIndex) return;

    // Start exit animation
    setPhase("out");

    const exitTimer = window.setTimeout(() => {
      // Change statement after exit
      setDisplayIndex(targetIndex);

      // Start entrance animation
      setPhase("in");
    }, STATEMENT_EXIT_MS);

    return () => window.clearTimeout(exitTimer);
  }, [targetIndex, displayIndex]);

  return {
    statement: STATEMENTS[displayIndex],
    phase,
  };
}

// ─────────────────────────────────────────────
// Particles
// ─────────────────────────────────────────────

function useParticles(count: number) {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 1.6,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 6,
      opacity: 0.15 + Math.random() * 0.25,
    })),
  );

  return particles;
}

// ─────────────────────────────────────────────
// Statement Text
// ─────────────────────────────────────────────

function StatementText({
  statement,
  phase,
}: {
  statement: { text: string; highlight?: string };
  phase: "in" | "out";
}) {
  const { text, highlight } = statement;

  const parts = highlight ? text.split(highlight) : [text];

  return (
    <div
      className={`statement-stage ${
        phase === "out" ? "statement-out" : "statement-in"
      }`}
    >
      <h2
        key={text}
        className="font-display text-center text-[#f5f0ea] leading-[0.98] max-w-6xl mx-auto px-6 uppercase"
        style={{
          fontSize: "clamp(2.25rem, 6vw, 6.5rem)",
        }}
      >
        {highlight ? (
          <>
            {parts[0]}

            <span style={{ color: "#B91729" }}>{highlight}</span>

            {parts[1]}
          </>
        ) : (
          text
        )}
      </h2>
    </div>
  );
}

// ─────────────────────────────────────────────
// Fear Section
// ─────────────────────────────────────────────

export default function FearSection() {
  const pinRef = useRef<HTMLElement>(null);

  const pinStyle = usePinnedSection(pinRef);

  const targetIndex = useScrollTargetIndex(pinRef, STATEMENTS.length);

  const { statement, phase } = useAnimatedStatement(targetIndex);

  const particles = useParticles(45);

  return (
    <section
      ref={pinRef}
      className="relative w-full bg-[#0a0908]"
      style={{
        height: `${PIN_LENGTH_VH}vh`,
      }}
    >
      <style>{`

        /* ═══════════════════════════════════════
           MARQUEE ANIMATIONS
        ═══════════════════════════════════════ */

        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0);
          }
        }


        /* ═══════════════════════════════════════
           STATEMENT TRANSITION
        ═══════════════════════════════════════ */

        .statement-stage {
          perspective: 1200px;
          transform-style: preserve-3d;
          will-change: transform, opacity, filter;
        }


        /* Statement leaving */

        .statement-stage.statement-out {
          animation:
            statement-flip-out
            350ms
            cubic-bezier(0.65, 0, 0.35, 1)
            forwards;
        }


        /* Statement entering */

        .statement-stage.statement-in {
          animation:
            statement-flip-in
            700ms
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }


        /* ═══════════════════════════════════════
           EXIT
        ═══════════════════════════════════════ */

        @keyframes statement-flip-out {

          0% {
            opacity: 1;

            transform:
              perspective(1200px)
              rotateX(0deg)
              translateY(0);

            filter: blur(0);
          }

          100% {
            opacity: 0;

            transform:
              perspective(1200px)
              rotateX(-75deg)
              translateY(-35px);

            filter: blur(8px);
          }
        }


        /* ═══════════════════════════════════════
           ENTER
        ═══════════════════════════════════════ */

        @keyframes statement-flip-in {

          0% {
            opacity: 0;

            transform:
              perspective(1200px)
              rotateX(75deg)
              translateY(35px);

            filter: blur(8px);
          }

          55% {
            opacity: 1;

            transform:
              perspective(1200px)
              rotateX(-5deg)
              translateY(-2px);

            filter: blur(1px);
          }

          100% {
            opacity: 1;

            transform:
              perspective(1200px)
              rotateX(0deg)
              translateY(0);

            filter: blur(0);
          }
        }


        /* ═══════════════════════════════════════
           PARTICLE ANIMATION
        ═══════════════════════════════════════ */

        @keyframes particle-drift {

          0% {
            opacity: var(--particle-opacity);
            transform: translate3d(0, 0, 0);
          }

          50% {
            opacity: calc(var(--particle-opacity) * 0.35);
            transform: translate3d(4px, -10px, 0);
          }

          100% {
            opacity: var(--particle-opacity);
            transform: translate3d(0, 0, 0);
          }
        }


        /* ═══════════════════════════════════════
           REDUCED MOTION
        ═══════════════════════════════════════ */

        @media (prefers-reduced-motion: reduce) {

          .statement-stage.statement-out,
          .statement-stage.statement-in {
            animation: none;
          }

        }

      `}</style>

      <div className="h-screen w-full overflow-hidden" style={pinStyle}>
        {/* ═══════════════════════════════════════
            FILM GRAIN
        ═══════════════════════════════════════ */}

        <div className="film-grain z-30" />

        {/* ═══════════════════════════════════════
            CENTER VERTICAL LINE
        ═══════════════════════════════════════ */}

        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#B91729]/20 z-0" />

        {/* ═══════════════════════════════════════
            BACKGROUND TYPOGRAPHY — TOP
        ═══════════════════════════════════════ */}

        <div className="absolute top-[4%] left-0 w-full overflow-hidden z-0 select-none pointer-events-none">
          <div
            className="flex whitespace-nowrap font-display font-extrabold uppercase text-white/[0.06]"
            style={{
              fontSize: "clamp(4rem, 14vw, 11rem)",
              animation: "marquee-left 42s linear infinite",
              transform: "skewY(-15deg)",
            }}
          >
            <span className="pr-12">
              FLINCH &times; FEAR&nbsp;&nbsp;&nbsp; FLINCH &times; FEAR
            </span>

            <span className="pr-12">
              FLINCH &times; FEAR&nbsp;&nbsp;&nbsp; FLINCH &times; FEAR
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            BACKGROUND TYPOGRAPHY — BOTTOM
        ═══════════════════════════════════════ */}

        <div className="absolute top-[60%] left-0 w-full overflow-hidden z-0 select-none pointer-events-none flex items-center gap-16">
          <div
            className="flex whitespace-nowrap font-display font-extrabold uppercase text-[#B91729]/15 shrink-0"
            style={{
              fontSize: "clamp(3.5rem, 12vw, 9rem)",
              animation: "marquee-right 38s linear infinite",
              transform: "skewY(-15deg)",
            }}
          >
            <span className="pr-12">GO ANYWAY&nbsp;&nbsp;&nbsp; GO ANYWAY</span>

            <span className="pr-12">GO ANYWAY&nbsp;&nbsp;&nbsp; GO ANYWAY</span>
          </div>

          <span
            className="font-display text-[#B91729]/15 shrink-0"
            style={{
              fontSize: "clamp(3rem, 10vw, 7rem)",
            }}
          >
            侍の道
          </span>
        </div>

        {/* ═══════════════════════════════════════
            PARTICLE DUST
        ═══════════════════════════════════════ */}

        <div className="absolute inset-0 z-10 pointer-events-none">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute rounded-full bg-white"
              style={
                {
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  "--particle-opacity": p.opacity,
                  animation: `particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* ═══════════════════════════════════════
            SWORD MODEL
        ═══════════════════════════════════════ */}

        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <ModelErrorBoundary
            fallback={
              <svg
                viewBox="0 0 800 800"
                className="absolute w-[140%] h-[140%] max-w-none opacity-70"
              >
                <defs>
                  <linearGradient
                    id="bladeGlow"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#B91729" stopOpacity="0" />

                    <stop offset="45%" stopColor="#B91729" stopOpacity="0.9" />

                    <stop offset="55%" stopColor="#f5f0ea" stopOpacity="0.9" />

                    <stop offset="100%" stopColor="#B91729" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <line
                  x1="620"
                  y1="120"
                  x2="180"
                  y2="680"
                  stroke="url(#bladeGlow)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            }
          >
            <Suspense fallback={null}>
              <SwordModel className="absolute w-[100%] h-[100%] max-w-2xl" />
            </Suspense>
          </ModelErrorBoundary>
        </div>

        {/* ═══════════════════════════════════════
            MAIN ANIMATED STATEMENT
        ═══════════════════════════════════════ */}

        <div className="relative z-40 min-h-screen flex items-center justify-center whitespace-pre-line">
          <StatementText statement={statement} phase={phase} />
        </div>

        {/* ═══════════════════════════════════════
            BOTTOM TICKER
        ═══════════════════════════════════════ */}

        <div className="absolute bottom-8 left-0 w-full overflow-hidden z-20 select-none pointer-events-none">
          <div
            className="flex whitespace-nowrap font-display italic text-white/10 text-lg md:text-2xl"
            style={{
              animation: "marquee-left 26s linear infinite",
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="pr-10">
                {TICKER_WORDS.join("   ·   ")}
                &nbsp;&nbsp;&nbsp; &middot; &nbsp;&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            BOTTOM REVEAL
        ═══════════════════════════════════════ */}

        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-[#0a0908] z-30 pointer-events-none" />
      </div>
    </section>
  );
}
