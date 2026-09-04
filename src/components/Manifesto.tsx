import { useEffect, useMemo, useRef } from "react";

interface Segment {
  text: string;
  accent?: boolean;
}

const SEGMENTS: Segment[] = [
  { text: "I Was Drawn To A World Where " },
  { text: "Design Meets Logic", accent: true },
  { text: " — A Space Where I Can " },
  { text: "Imagine And Create Anything", accent: true },
  { text: ". That's What Pulled Me Into " },
  { text: "Frontend", accent: true },
  { text: "." },
];

interface Word {
  text: string;
  accent: boolean;
}

function buildWords(segments: Segment[]): Word[] {
  const words: Word[] = [];

  segments.forEach((segment) => {
    const parts = segment.text.split(" ");

    parts.forEach((part, i) => {
      if (!part) return;

      words.push({
        text: part + (i < parts.length - 1 ? " " : ""),
        accent: !!segment.accent,
      });
    });
  });

  return words;
}

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const words = useMemo(() => buildWords(SEGMENTS), []);

  useEffect(() => {
    let raf = 0;

    const clamp = (v: number, min: number, max: number) =>
      Math.min(Math.max(v, min), max);

    const update = () => {
      const paragraph = paragraphRef.current;

      if (!paragraph) {
        raf = requestAnimationFrame(update);
        return;
      }

      const rect = paragraph.getBoundingClientRect();
      const vh = window.innerHeight;

      /*
       * The paragraph starts completely blurred.
       * Reveal begins when the paragraph enters the viewport
       * and progresses as the user scrolls through it.
       */
      const start = vh * 0.85;
      const end = vh * 0.15;

      const progress = clamp((start - rect.top) / (start - end), 0, 1);

      const n = wordRefs.current.length;

      wordRefs.current.forEach((el, i) => {
        if (!el) return;

        /*
         * Spread the reveal across all words.
         * The first word reveals first and the final word reveals last.
         */
        const wordStart = i / n;
        const wordDuration = 0.12;

        const localProgress = clamp(
          (progress - wordStart) / wordDuration,
          0,
          1,
        );

        const blur = 8 * (1 - localProgress);
        const opacity = 0.12 + 0.88 * localProgress;

        el.style.filter = `blur(${blur}px)`;
        el.style.opacity = String(opacity);
      });

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    return () => cancelAnimationFrame(raf);
  }, [words.length]);

  return (
    <section id="manifesto"
      ref={sectionRef}
      className="relative bg-[#0a0908] py-16 md:py-24 px-6 md:px-10"
    >
      {/* left vertical section tab */}
      <span className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 origin-left font-body text-metadata text-white/40">
        HERO
      </span>

      <div className="max-w-[1440px] mx-auto">
        {/* top meta row */}
        <div className="flex items-center justify-between mb-16 md:mb-24">
          <div className="flex items-center gap-3">
            <span className="font-structure font-bold text-metadata text-white tracking-widest">
              MANIFESTO
            </span>

            <span className="font-body text-white/80 text-sm">宣言</span>
          </div>

          <div className="flex items-center">
            <span className="font-body text-metadata text-white/40 tracking-widest">
              WHY WILL YOU HIRE ME?
            </span>

            <span
              className="font-display italic text-6xl md:text-7xl leading-none text-transparent -ml-3 md:-ml-4 select-none"
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.7)",
              }}
            >
              01
            </span>
          </div>
        </div>

        {/* heading */}
        <h2 className="font-display font-semibold text-white text-4xl md:text-6xl mb-8 md:mb-12">
          What Pulled Me In.
        </h2>

        {/* scroll-reveal paragraph */}
        <p
          ref={paragraphRef}
          className="font-structure font-bold text-white text-3xl sm:text-4xl md:text-6xl leading-[1.15] max-w-5xl"
        >
          {words.map((word, i) => (
            <span
              key={i}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className={word.accent ? "text-red-600" : "text-white"}
              style={{
                filter: "blur(8px)",
                opacity: 0.12,
                willChange: "filter, opacity",
              }}
            >
              {word.text}
            </span>
          ))}
        </p>

        {/* byline */}
        <div className="flex items-center gap-3 mt-16 md:mt-24">
          <span className="w-10 h-px bg-red-600" />

          <span className="font-body text-metadata text-white/60 tracking-widest">
            GEETESH
          </span>

          <span className="text-red-600 font-body text-metadata">志</span>

          <span className="font-body text-metadata text-white/40 tracking-widest">
            G.23
          </span>
        </div>
      </div>
    </section >
  );
}
