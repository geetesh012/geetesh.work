import { useRef } from "react";
import { Link } from "react-router-dom";
import FoxScrollSequence from "./Foxscrollsequence";
import { usePinnedSection } from "./Usesectionpin";
import { useMediaQuery } from "../lib/Usemediaquery";

interface ScrollPanelProps {
  title: string;
  items: string[];
  to: string;
}

function ScrollPanel({ title, items, to }: ScrollPanelProps) {
  return (
    <Link
      to={to}
      aria-label={`View all ${title.toLowerCase()}`}
      className="
        group relative block w-[min(78vw,300px)] shrink-0
        text-inherit no-underline
        sm:w-[300px]
        md:w-[332px]
        lg:w-[334px]
      "
    >
      {/* Scroll / paper background */}
      <img
        src="/images/zen-scroller.png"
        alt=""
        aria-hidden="true"
        className="
          block h-auto w-full
          select-none pointer-events-none
          transition-transform duration-300 ease-out
          group-hover:scale-[1.02]
        "
        draggable={false}
      />

      {/* CONTENT INSIDE SCROLL */}
      <div
        className="
          absolute inset-0
          flex flex-col items-center
          px-[15%]
          pt-[30%]
          pb-[16%]
          text-center
        "
      >
        {/* TITLE */}
        <h3
          className="
            shrink-0
            font-display
            font-bold
            text-[28px]
            leading-none
            tracking-[-0.02em]
            text-black
            md:text-[30px]
            lg:text-[32px]
          "
        >
          {title}
        </h3>

        {/* LIST */}
        <ol
          className="
            mt-[34px]
            flex w-full
            flex-col
            items-center
            gap-[20px]
            font-display
            font-bold
            text-[22px]
            leading-[1.15]
            tracking-[-0.01em]
            text-black
            md:mt-[38px]
            md:gap-[25px]
          "
        >
          {items.map((item, index) => (
            <li
              key={item}
              className="
                w-full
                whitespace-pre-line
                text-center
                font-bold
              "
            >
              {index + 1}. {item}
            </li>
          ))}
        </ol>
      </div>
    </Link>
  );
}

const PROJECTS = ["WEDDIFY", "CARBONLY", "SOLO LEVELING", "RETRO POKEDEX"];

const EXPERIENCE = [
  "GEL",
  "HUMAWINGS PVT. LTD.",
  "CVSYNK \n TECHNOLOGIES PVT. LTD.",
  "COPPER CODES LLP",
];

const PIN_LENGTH_VH = 320;

export default function Work() {
  const pinRef = useRef<HTMLElement>(null);
  // Below md the three panels stack instead of sitting in a pinned row, so
  // there's no fixed-height "frame" to scroll-jack through — pinning (and
  // the tall spacer section it needs) is desktop-only.
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pinStyle = usePinnedSection(pinRef, isDesktop);

  return (
    <section
      id="work"
      ref={pinRef}
      className="relative w-full bg-white"
      style={{ height: isDesktop ? `${PIN_LENGTH_VH}vh` : "auto" }}
    >
      <div
        className={
          isDesktop
            ? "flex h-screen w-full flex-col overflow-hidden"
            : "flex w-full flex-col py-16"
        }
        style={pinStyle}
      >
        {/* =========================================================
            LEFT BLOSSOM
        ========================================================= */}
        <img
          src="/images/blossom-left.png"
          alt=""
          aria-hidden="true"
          className="
            pointer-events-none
            absolute left-0 top-0 z-0
            hidden h-full w-auto max-w-[24%]
            select-none
            object-contain object-left
            md:block
          "
          draggable={false}
        />

        {/* =========================================================
            RIGHT BLOSSOM
        ========================================================= */}
        <img
          src="/images/blossom-right.png"
          alt=""
          aria-hidden="true"
          className="
            pointer-events-none
            absolute right-0 top-0 z-0
            hidden h-full w-auto max-w-[27%]
            select-none
            object-contain object-right
            md:block
          "
          draggable={false}
        />

        <div
          className="
            relative
            mx-auto
            flex
            h-full
            w-full
            max-w-[1440px]
            flex-col
          "
        >
          {/* =======================================================
              TOP META
          ======================================================= */}
          <div
            className="
              flex
              shrink-0
              items-start
              justify-between
              px-6
              pt-8
              md:px-10
              md:pt-10
            "
          >
            {/* LEFT — WORK */}
            <div className="flex items-center gap-3">
              <span
                className="
                  font-structure
                  font-bold
                  text-metadata
                  tracking-widest
                  text-black
                "
              >
                WORK
              </span>

              <span
                className="
                  font-body
                  text-sm
                  font-medium
                  text-black/80
                "
              >
                仕事
              </span>
            </div>

            {/* RIGHT — SECTION NUMBER */}
            <div
              className="
                flex
                items-start
              "
            >
              <span
                className="
                  hidden
                  pt-3
                  font-body
                  text-xs
                  tracking-[0.18em]
                  text-black/40
                  md:block
                "
              >
                WHAT HAVE I BUILT?
              </span>

              <span
                className="
                  font-display
                  text-[68px]
                  italic
                  leading-[0.75]
                  text-transparent
                  select-none
                  md:text-[76px]
                "
                style={{
                  WebkitTextStroke: "1px rgba(0,0,0,0.7)",
                }}
              >
                03
              </span>
            </div>
          </div>

          {/* =======================================================
              MAIN CONTENT
          ======================================================= */}
          <div
            className="
            flex
            min-h-0
            flex-1
            items-center
            justify-center
            px-8
            pb-12
            pt-6
            md:px-8
            md:pb-20
            md:pt-8
            lg:px-12
          "
          >
            <div
              className="
                mx-auto
                flex
                w-full
                max-h-full
                flex-col
                items-center
                justify-center
                gap-10
                md:flex-row
                md:gap-[56px]
                lg:gap-[70px]
              "
            >
              {/* ===================================================
                  PROJECTS
              =================================================== */}
              <ScrollPanel title="Projects" items={PROJECTS} to="/projects" />

              {/* ===================================================
                  FOX
              =================================================== */}
              <div
                className="
                  flex
                  h-full
                  shrink-0
                  items-center
                  justify-center
                "
              >
                <FoxScrollSequence
                  className="
                    w-[min(70vw,300px)]
                    max-h-full
                    sm:w-[300px]
                    md:w-[350px]
                    lg:w-[380px]
                  "
                  basePath="/images/kitsune-frames"
                  pinSourceRef={pinRef}
                />
              </div>

              {/* ===================================================
                  EXPERIENCE
              =================================================== */}
              <ScrollPanel title="Experience" items={EXPERIENCE} to="/experience" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}