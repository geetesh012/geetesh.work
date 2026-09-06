import { Link } from "react-router-dom";

interface Project {
  title: string;
  description: string;
  tags?: string[];
  href?: string;
}

// Edit this list directly — add real descriptions, tags, and links per project.
const PROJECTS: Project[] = [
  {
    title: "WEDDIFY",
    description: "Add a short description of what this project does and the problem it solves.",
    tags: ["React", "Next.js"],
    href: "#",
  },
  {
    title: "CARBONLY",
    description: "Add a short description of what this project does and the problem it solves.",
    tags: ["React", "TypeScript"],
    href: "#",
  },
  {
    title: "SOLO LEVELING",
    description: "Add a short description of what this project does and the problem it solves.",
    tags: ["Swift", "WebGL"],
    href: "#",
  },
  {
    title: "RETRO POKEDEX",
    description: "Add a short description of what this project does and the problem it solves.",
    tags: ["React", "API"],
    href: "#",
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen w-full bg-white px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-[1100px]">
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
        <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2 md:gap-y-16">
          {PROJECTS.map((project) => (
            <a
              key={project.title}
              href={project.href}
              target={project.href?.startsWith("http") ? "_blank" : undefined}
              rel={project.href?.startsWith("http") ? "noreferrer" : undefined}
              className="group block border-b border-black/10 pb-8 transition-colors hover:border-black/30"
            >
              <h2 className="font-display text-2xl font-bold text-black md:text-3xl">
                {project.title}
              </h2>

              <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-black/70 md:text-base">
                {project.description}
              </p>

              {project.tags && project.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body text-xs tracking-wide text-black/50"
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