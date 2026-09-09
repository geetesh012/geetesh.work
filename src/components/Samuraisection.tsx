import { useRef } from 'react';
import SamuraiScrollSequence from './Samuraiscrollsequence';
import { usePinnedSection } from './Usesectionpin';

const PIN_LENGTH_VH = 220;

export default function SamuraiSection() {
  const pinRef = useRef<HTMLElement>(null);

  const pinStyle = usePinnedSection(pinRef);

  return (
    <section
      ref={pinRef}
      className="relative mt-24 w-full bg-black md:mt-32"
      style={{ height: `${PIN_LENGTH_VH}vh` }}
    >
      <div
        className="h-screen w-full overflow-hidden"
        style={pinStyle}
      >
        {/* Section label — swap the text/number once this section's real
            position in the page order (relative to Fear=01, Work=03) is
            decided. */}
        {/* <span className="absolute top-8 left-6 md:left-10 font-structure font-bold uppercase tracking-[0.15em] text-sm text-white z-10">
          Samurai
        </span> */}
        <span
          className="
            absolute
            left-4
            top-1/2
            z-10
            hidden
            -translate-y-1/2
            -rotate-180
            font-body
            text-[12px]
            font-bold
            tracking-[0.18em]
            text-white/40
            [writing-mode:vertical-rl]
            md:left-8
            min-[901px]:block
          "
        >
          SAMURAI
        </span>

        <SamuraiScrollSequence
          className="absolute inset-0 z-0"
          pinSourceRef={pinRef}
        />

        <div className="absolute bottom-2 right-16 md:right-16 z-10 flex h-16 w-18 items-center justify-center rounded-full border-2 border-white/60 bg-[#D52F23] text-white md:h-20 md:w-20">
          <span className="font-structure text-sm tracking-[0.1em] md:text-base">
            作品集
          </span>
        </div>
      </div>
    </section>
  );
}