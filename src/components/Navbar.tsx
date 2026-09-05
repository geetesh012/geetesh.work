interface NavbarProps {
  scrolled: boolean;
  mounted: boolean;
  overlayOpen: boolean;
  onToggleOverlay: () => void;
}

const ENTRANCE =
  "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]";

export default function Navbar({
  mounted,
  overlayOpen,
  onToggleOverlay,
}: NavbarProps) {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-transparent">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
        {/* Left — logo, two-line stacked */}
        <a
          href="#"
          className={`font-display font-bold text-white leading-none tracking-tight z-50 delay-0 ${ENTRANCE} ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }`}
        >
          <span className="block text-base md:text-lg">GEETESH</span>

          <span
            className="block text-base md:text-lg -mt-2 tracking-[0.08em] text-transparent"
            style={{
              WebkitTextStroke: "0.5px white",
            }}
          >
            KANKONKAR
          </span>
        </a>

        {/* Center — desktop only, static label */}
        <span
          className={`font-body hidden md:block text-white/90 text-base delay-200 ${ENTRANCE} ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          作品集
        </span>

        {/* Right — desktop only, Navigate pill */}
        <button
          type="button"
          onClick={onToggleOverlay}
          className={`font-structure text-nav hidden md:flex items-center gap-2 px-5 py-2 rounded-lg border border-white/20 text-white/90 hover:bg-white/10 delay-[400ms] ${ENTRANCE} ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          {overlayOpen ? "Close" : "Navigate"}
        </button>

        {/* Right — mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={onToggleOverlay}
          className={`md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 z-50 delay-200 ${ENTRANCE} ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <span
            className={`w-6 h-[2px] bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              overlayOpen
                ? "rotate-45 translate-y-[4px]"
                : "rotate-0 translate-y-0"
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              overlayOpen
                ? "-rotate-45 -translate-y-[4px]"
                : "rotate-0 translate-y-0"
            }`}
          />
        </button>
      </div>
    </nav>
  );
}