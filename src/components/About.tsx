export default function About() {
  return (
    <section id="about">
      <div className="relative min-h-screen overflow-x-hidden bg-[#0a0908] text-[#f2efe9] font-body">
        <div className="relative mx-auto max-w-[1600px] overflow-hidden px-6 pt-10 pb-16 md:px-14 md:pt-10 md:pb-16">
          {/* Dragon background art */}
          <img
            src="/about/dragon-filled.png"
            alt=""
            className="
            pointer-events-none
            absolute
            right-[-6%]
            top-[10%]
            z-0
            w-[min(74vw,1180px)]
            select-none
            opacity-[0.32]
            saturate-[1.1]
            md:right-[-6%]
          "
          />

          <img
            src="/about/dragon-skitched.png"
            alt=""
            className="
            pointer-events-none
            absolute
            right-[-6%]
            top-[10%]
            z-0
            w-[min(74vw,1180px)]
            select-none
            opacity-[0.55]
            mix-blend-screen
          "
          />

          {/* Header */}
          <div className="relative z-10 mb-16 flex items-center justify-between md:mb-24">
            {/* About label */}
            <div className="flex items-center gap-3">
              <span className="font-structure font-bold text-metadata tracking-widest text-white">
                ABOUT
              </span>

              <span className="font-body text-sm text-white/80">
                私について
              </span>
            </div>

            {/* Right label + number */}
            <div className="flex items-center">
              <span className="font-body text-metadata tracking-widest text-white/40">
                WHO IS BEHIND THIS?
              </span>

              <span
                className="
                -ml-3
                select-none
                font-display
                text-6xl
                italic
                leading-none
                text-transparent
                md:-ml-4
                md:text-7xl
              "
                style={{
                  WebkitTextStroke: "1px rgba(255,255,255,0.7)",
                }}
              >
                02
              </span>
            </div>
          </div>

          {/* Hero */}
          <div className="relative z-10 py-16 md:py-16">
            <h1
              className="
              whitespace-nowrap
              font-display
              text-[clamp(2.75rem,8vw,8.5rem)]
              font-extrabold
              italic
              leading-[0.92]
              tracking-[-0.01em]
              text-transparent
              [-webkit-text-stroke:1.5px_#b3222b]
              max-[900px]:whitespace-normal
              max-[900px]:text-[clamp(2.5rem,12vw,5rem)]
            "
            >
              I AM STILL ALIVE.
            </h1>
          </div>

          {/* Body */}
          <div
            className="
            relative
            z-10
            grid
            grid-cols-1
            items-start
            gap-10
            min-[901px]:grid-cols-[1fr_320px]
            min-[901px]:gap-12
          "
          >
            {/* Copy */}
            <div className="relative max-w-[620px]">
              {/* Vertical label */}
              <span
                className="
                absolute
                left-[-56px]
                top-[40%]
                hidden
                -rotate-180
                font-body
                text-[12px]
                font-bold
                tracking-[0.18em]
                text-[#635e58]
                [writing-mode:vertical-rl]
                min-[901px]:block
              "
              >
                KITSUNE
              </span>

              {/* Main paragraph */}
              <p className="mb-7 font-body text-[clamp(1.15rem,1.8vw,1.5rem)] font-medium leading-[1.5] text-[#f2efe9]">
                Frontend Developer. Based In{" "}
                <span className="text-[#d13a3a]">India.</span> Survived 4 Years
                Of School, Mastered 1 Years Of Frontend Sorcery. Still
                Exploring, <span className="text-[#d13a3a]">Still Me.</span>
              </p>

              {/* Secondary paragraph */}
              <p
                className="
                max-w-[46ch]
                font-body
                text-base
                font-normal
                leading-[1.7]
                text-[#8f8a83]
              "
              >
                I Build Interfaces The Way A Sword Gets Forged — Slow,
                Obsessive, A Little Dramatic. Motion, Pixels, And The Quiet
                Parts Of A Product Nobody Notices When They're Done Right.
              </p>
            </div>

            {/* Metadata */}
            <div className="flex flex-col gap-[22px] pt-1">
              {/* Location */}
              <div className="grid grid-cols-[84px_1fr] items-baseline gap-4 border-b border-[#2a2724] pb-[18px]">
                <span className="font-body text-[11px] font-semibold tracking-[0.14em] text-[#635e58]">
                  LOCATION
                </span>

                <span className="flex items-center gap-2.5 font-display text-sm font-bold tracking-[0.03em] text-[#f2efe9]">
                  GOA&nbsp;&nbsp;&nbsp;INDIA
                </span>
              </div>

              {/* Role */}
              <div className="grid grid-cols-[84px_1fr] items-baseline gap-4 border-b border-[#2a2724] pb-[18px]">
                <span className="font-body text-[11px] font-semibold tracking-[0.14em] text-[#635e58]">
                  ROLE
                </span>

                <span className="flex items-center gap-2.5 font-display text-sm font-bold tracking-[0.03em] text-[#f2efe9]">
                  UI/UX AND FRONTEND ENGINEER
                </span>
              </div>

              {/* Year */}
              <div className="grid grid-cols-[84px_1fr] items-baseline gap-4 border-b border-[#2a2724] pb-[18px]">
                <span className="font-body text-[11px] font-semibold tracking-[0.14em] text-[#635e58]">
                  YEAR
                </span>

                <span className="flex items-center gap-2.5 font-display text-sm font-bold tracking-[0.03em] text-[#f2efe9]">
                  1+ IN THE CRAFT
                </span>
              </div>

              {/* Status */}
              <div className="grid grid-cols-[84px_1fr] items-baseline gap-4 pb-[18px]">
                <span className="font-body text-[11px] font-semibold tracking-[0.14em] text-[#635e58]">
                  STATUS
                </span>

                <span className="flex items-center gap-2.5 font-display text-sm font-bold tracking-[0.03em] text-[#f2efe9]">
                  <span
                    className="
                    h-[7px]
                    w-[7px]
                    flex-none
                    rounded-full
                    bg-[#d13a3a]
                    shadow-[0_0_8px_#d13a3a]
                  "
                  />
                  AVAILABLE FOR WORK
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating action button */}
        <button
          type="button"
          aria-label="Toggle sound"
          className="
    fixed
    bottom-7
    left-[-28px]
    z-20
    flex
    h-16
    w-16
    items-center
    justify-center
    rounded-full
    border
    border-[#635e58]
    bg-[#0a0908]
    text-[#f2efe9]
    transition-all
    duration-300
    hover:border-[#d13a3a]
    hover:text-[#d13a3a]
  "
        >
          {/* Sound On icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-[30px] h-5 w-5"
          >
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
        </button>
      </div>
    </section>
    
  );
}
