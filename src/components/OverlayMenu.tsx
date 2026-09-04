import { OVERLAY_EASE } from "./constants";

interface OverlayMenuProps {
  open: boolean;
  onClose: () => void;
}

const LINKS = [
  { label: "MANIFESTO", href: "#manifesto", jp: "一" },
  { label: "ABOUT", href: "#about", jp: "二" },
  { label: "WORK", href: "#work", jp: "三" },
  { label: "CONTACT", href: "#contact", jp: "四" },
];

export default function OverlayMenu({ open, onClose }: OverlayMenuProps) {
  const handleClick = (href: string) => {
    onClose();

    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  };

  return (
    <div
      style={{ transitionTimingFunction: OVERLAY_EASE }}
      className={`fixed inset-0 z-40 overflow-hidden bg-black transition-[opacity,visibility] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div
        className={`
    absolute inset-0
    pointer-events-none
    overflow-hidden
    transition-all
    duration-[1000ms]
    ease-[cubic-bezier(0.22,1,0.36,1)]
    ${open ? "opacity-100 scale-100" : "opacity-0 scale-[1.08]"}
  `}
      >
        {/* =====================================================
            MAIN BLOOD / BRUSH STROKE
            Large diagonal stroke behind the menu
        ====================================================== */}

        <div
          className="
            absolute
            w-[135vw]
            h-[15vw]
            min-h-[100px]
            max-h-[210px]
            left-[-20vw]
            top-[42%]
            -rotate-[25deg]
            opacity-[0.28]
            bg-[#B91729]
            blur-[1px]
          "
          style={{
            clipPath:
              "polygon(0% 40%, 5% 30%, 13% 35%, 21% 20%, 31% 28%, 42% 15%, 54% 23%, 66% 12%, 77% 24%, 88% 18%, 100% 31%, 96% 52%, 87% 48%, 77% 62%, 66% 50%, 55% 66%, 43% 51%, 32% 72%, 21% 55%, 10% 66%, 2% 53%)",
          }}
        />

        {/* Darker core of the blood stroke */}
        <div
          className="
            absolute
            w-[125vw]
            h-[5vw]
            min-h-[35px]
            max-h-[70px]
            left-[-15vw]
            top-[48%]
            -rotate-[25deg]
            opacity-[0.42]
            bg-[#8f1020]
            blur-[2px]
          "
          style={{
            clipPath:
              "polygon(0% 45%, 8% 28%, 18% 48%, 28% 20%, 38% 42%, 49% 25%, 61% 48%, 73% 18%, 84% 40%, 94% 25%, 100% 42%, 96% 60%, 85% 50%, 74% 68%, 62% 52%, 50% 70%, 39% 50%, 27% 72%, 16% 53%, 6% 68%)",
          }}
        />

        {/* =====================================================
            LONG THIN BLOOD TRAILS
        ====================================================== */}

        <span
          className="
            absolute
            w-[115vw]
            h-[2px]
            left-[-10vw]
            top-[45%]
            bg-[#B91729]
            opacity-30
            -rotate-[24deg]
            blur-[0.5px]
          "
        />

        <span
          className="
            absolute
            w-[95vw]
            h-[1px]
            left-[5vw]
            top-[54%]
            bg-[#B91729]
            opacity-40
            -rotate-[24deg]
          "
        />

        <span
          className="
            absolute
            w-[75vw]
            h-[1px]
            left-[20vw]
            top-[58%]
            bg-[#B91729]
            opacity-25
            -rotate-[24deg]
          "
        />

        <span
          className="
            absolute
            w-[50vw]
            h-[1px]
            left-[-5vw]
            top-[39%]
            bg-[#B91729]
            opacity-25
            -rotate-[24deg]
          "
        />

        {/* =====================================================
            BLOOD SPLATTERS
        ====================================================== */}

        <span
          className="
            absolute
            left-[14%]
            top-[28%]
            w-3
            h-3
            rounded-full
            bg-[#B91729]
            opacity-30
            blur-[1px]
          "
        />

        <span
          className="
            absolute
            left-[19%]
            top-[34%]
            w-2
            h-5
            rounded-full
            bg-[#B91729]
            opacity-25
            rotate-[35deg]
          "
        />

        <span
          className="
            absolute
            left-[29%]
            top-[25%]
            w-2
            h-2
            rounded-full
            bg-[#B91729]
            opacity-35
          "
        />

        <span
          className="
            absolute
            left-[72%]
            top-[57%]
            w-3
            h-2
            rounded-full
            bg-[#B91729]
            opacity-25
            rotate-[20deg]
          "
        />

        <span
          className="
            absolute
            left-[80%]
            top-[62%]
            w-2
            h-4
            rounded-full
            bg-[#B91729]
            opacity-30
            rotate-[-35deg]
          "
        />

        <span
          className="
            absolute
            left-[88%]
            top-[55%]
            w-2
            h-2
            rounded-full
            bg-[#B91729]
            opacity-25
          "
        />

        {/* Tiny flying droplets */}
        <span
          className="
            absolute
            left-[11%]
            top-[40%]
            w-[2px]
            h-8
            bg-[#B91729]
            opacity-25
            rotate-[35deg]
          "
        />

        <span
          className="
            absolute
            left-[91%]
            top-[48%]
            w-[2px]
            h-10
            bg-[#B91729]
            opacity-25
            rotate-[-30deg]
          "
        />

        <span
          className="
            absolute
            left-[65%]
            top-[29%]
            w-[2px]
            h-5
            bg-[#B91729]
            opacity-20
            rotate-[40deg]
          "
        />

        {/* =====================================================
            FILM / GRAIN FEEL
        ====================================================== */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            mix-blend-screen
          "
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.8) 0.5px, transparent 0.5px)",
            backgroundSize: "4px 4px",
          }}
        />

        {/* Dark vignette */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.65)_100%)]
          "
        />
      </div>

      {/* =========================================================
          MENU
      ========================================================== */}

      <div
        className={`
    relative z-10
    h-full
    flex flex-col
    items-center
    justify-center
    transition-transform
    duration-[900ms]
    ease-[cubic-bezier(0.22,1,0.36,1)]
    ${open ? "translate-y-0 scale-100" : "translate-y-8 scale-[0.98]"}
  `}
      >
        <nav className="flex flex-col items-start gap-5 md:gap-6 lg:gap-7">
          {LINKS.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleClick(link.href);
              }}
              className="
                group
                flex items-center
                text-white
                transition-[opacity,transform] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]
              "
              style={{
                transitionTimingFunction: OVERLAY_EASE,
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(2.5rem)",
                transitionDelay: open ? `${250 + index * 100}ms` : "0ms",
              }}
            >
              {/* =================================================
                  JAPANESE NUMBER
              ================================================== */}

              <span
                className="
                  font-structure
                  text-lg
                  md:text-base
                  text-[#B91729]
                  w-8
                  md:w-12
                  text-right
                  mr-12
                  md:mr-16
                "
              >
                {link.jp}
              </span>

              {/* =================================================
                  MENU TEXT
              ================================================== */}

              <span
                className="
                  relative
                  inline-block
                  font-display
                  italic
                  font-semibold
                  text-4xl
                  md:text-6xl
                  lg:text-7xl
                  leading-[0.85]
                  tracking-[-0.04em]
                  text-white
                "
              >
                {link.label}

                {/* =============================================
                    SAMURAI SWORD SLASH
                ============================================== */}

                <span
                  className="
                    absolute
                    left-[-8%]
                    right-[-8%]
                    top-1/2
                    h-[2px]
                    bg-[#B91729]
                    shadow-[0_0_8px_rgba(185,23,41,0.9)]
                    origin-left
                    scale-x-0
                    -rotate-[2deg]
                    pointer-events-none
                    transition-transform
                    duration-[160ms]
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    group-hover:scale-x-100
                  "
                  aria-hidden="true"
                />

                {/* Sharp white sword tip */}
                <span
                  className="
                    absolute
                    left-[-10%]
                    top-[calc(50%-2px)]
                    w-4
                    h-[3px]
                    bg-white
                    opacity-0
                    -rotate-[2deg]
                    pointer-events-none
                    transition-all
                    duration-[160ms]
                    ease-out
                    group-hover:left-[98%]
                    group-hover:opacity-100
                  "
                  aria-hidden="true"
                />

                {/* Small red blade glow */}
                <span
                  className="
                    absolute
                    left-[-8%]
                    right-[-8%]
                    top-[calc(50%+2px)]
                    h-[1px]
                    bg-[#B91729]
                    opacity-0
                    blur-[1px]
                    scale-x-0
                    origin-left
                    -rotate-[2deg]
                    pointer-events-none
                    transition-all
                    duration-[200ms]
                    group-hover:scale-x-100
                    group-hover:opacity-70
                  "
                  aria-hidden="true"
                />
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
