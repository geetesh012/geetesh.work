import { Link } from "react-router-dom";
import FallingBlossoms from "../components/Fallingblossoms";

interface Project {
  title: string;
  description: string;
  tags?: string[];
  href?: string;
  image?: string;
}

const PROJECTS: Project[] = [
  {
    title: "WEDDIFY",
    description:
      "A personal project created to simplify the often overwhelming wedding-planning process. Weddify brings the entire journey into one organized mobile app, allowing couples to manage guests, discover and book vendors, track budgets, and assign tasks from a single place. The goal is to reduce the stress of juggling scattered spreadsheets and apps while helping couples spend more time enjoying the moments that matter.",
    tags: ["Mobile App", "UI/UX Design", "Case Study"],
    href: "https://www.behance.net/gallery/236093975/WEDDIFY-The-wedding-planning-app",
    image: "/images/projects/Weddify.png",
  },
  {
    title: "CARBONLY",
    description:
      "A consumer-focused carbon-footprint tracking application designed to help individuals understand, reduce, and offset their carbon emissions through a clean, interactive, and trustworthy mobile experience. The project focuses on making invisible and complex carbon data easier to understand and act on, while addressing common problems with existing climate apps such as complicated interfaces, low trust in calculations and offset claims, tedious manual tracking, and privacy concerns around automation. The goal was to turn climate awareness into meaningful, long-term behavioral change.",
    tags: ["Mobile App", "Case Stidy", "UI/UX Design"],
    href: "https://www.behance.net/gallery/242179689/Carbonly-Carbon-footprint-tracking-app",
    image: "/images/projects/Carbonly.jpg",
  },
  {
    title: "SOLO LEVELING",
    description:
      "A creative concept web page inspired by Solo Leveling, the popular South Korean web novel, webtoon, and anime. Created to explore visual creativity and push narrative-driven web design skills, the project translates the series' dark-fantasy aesthetic and dynamic energy into a modern digital experience. Dramatic typography, high-contrast visuals, and interface elements inspired by the story's system UI work together to create an immersive experience that combines storytelling with expressive visual design.",
    tags: ["Concept Design", "Web Design", "Game Design"],
    href: "https://www.behance.net/gallery/230457437/Gaming-Web-design-(Solo-Leveling-Arise)",
    image: "/images/projects/Solo-leveling.jpg",
  },
  {
    title: "RETRO POKEDEX",
    description:
      "A retro handheld-style Pokédex web app covering all 1,025 Pokémon across Generations I–IX, built with React, Vite, and PokéAPI. Features search, multi-type filtering, sorting, favorites, a 6-slot team builder with type-coverage analysis, side-by-side comparisons, a turn-based battle simulator, and a shareable URL-based routing system. Installable as a PWA with offline support via IndexedDB, multi-language UI (English/Spanish/French), and a themeable retro device interface with sound effects and smooth animations",
    tags: ["React", "API", "Retro"],
    href: "https://geetesh012.github.io/Pokedex/",
    image: "/images/projects/Retro-pokedex.png",
  },
  {
    title: "GOI-GoaTourism",
    description:
      "An immersive, scroll-driven tourism website for Goa built with React, GSAP/ScrollTrigger, Framer Motion, and Lenis — vertical scroll drives a pinned horizontal filmstrip of destinations, with scroll-synced parallax, text reveals, and page transitions throughout.",
    tags: ["React", "GSAP", "LENIS", "Goa"],
    href: "https://geetesh012.github.io/GOI-GoaTourism/",
    image: "/images/projects/Goa tourism.jpg",
  },
];

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#FAFAFA] px-6 py-10 md:px-10 md:py-14">
      <FallingBlossoms />

      {/* Left blossom — matches the backdrop used in the Work section */}
      {/* <img
        src="/images/blossom-left.png"
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none fixed left-0 top-0 z-0
          hidden h-screen w-auto max-w-[24%]
          select-none object-contain object-left
          opacity-70 md:block
        "
        draggable={false}
      /> */}

      {/* Right blossom */}
      {/* <img
        src="/images/blossom-right.png"
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none fixed right-0 top-0 z-0
          hidden h-screen w-auto max-w-[27%]
          select-none object-contain object-right
          opacity-70 md:block
        "
        draggable={false}
      /> */}

      <div className="relative z-10 mx-auto max-w-[1100px]">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="font-body text-sm tracking-widest text-black/60 transition-colors hover:text-black"
          >
            ← BACK
          </Link>

          <div className="flex items-center gap-3">
            <span className="font-structure font-bold text-metadata tracking-widest text-black">
              PROJECTS
            </span>
            <span className="font-body text-sm text-black/80">作品</span>
          </div>
        </div>

        <h1 className="font-display mt-10 text-5xl leading-none text-black md:mt-16 md:text-7xl">
          Everything I&rsquo;ve built.
        </h1>

        {/* PROJECT LIST */}
        <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-12 md:gap-y-16">
          {PROJECTS.map((project) => (
            <a
              key={project.title}
              href={project.href}
              target={project.href?.startsWith("http") ? "_blank" : undefined}
              rel={project.href?.startsWith("http") ? "noreferrer" : undefined}
              className="group block border-b border-black/10 pb-8 transition-colors hover:border-black/30"
            >
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="aspect-video w-full rounded-sm object-cover"
                  loading="lazy"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="aspect-video w-full rounded-sm bg-black/5"
                />
              )}

              <h2 className="font-display mt-5 text-2xl font-bold text-black md:text-3xl">
                {project.title}
              </h2>

              <p className="mt-3 w-full font-body text-sm leading-relaxed text-black/70 md:text-base">
                {project.description}
              </p>

              {project.tags && project.tags.length > 0 && (
                <div className="mt-2 flex items-center gap-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-black/20 px-3 py-2 font-body text-xs tracking-wide text-black/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <span className="mt-5 inline-block font-body text-xs tracking-widest text-black/40 transition-colors group-hover:text-black">
                VIEW PROJECT →
              </span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
