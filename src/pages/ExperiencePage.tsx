import { Link } from "react-router-dom";

interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
}

// Edit this list directly — add real roles, dates, and descriptions per company.
const EXPERIENCE: ExperienceEntry[] = [
  {
    company: "GEL",
    role: "Add your role",
    duration: "Add dates",
    description: "Add a short description of what you did here.",
  },
  {
    company: "HUMAWINGS PVT. LTD.",
    role: "Add your role",
    duration: "Add dates",
    description: "Add a short description of what you did here.",
  },
  {
    company: "CVSYNK TECHNOLOGIES PVT. LTD.",
    role: "Add your role",
    duration: "Add dates",
    description: "Add a short description of what you did here.",
  },
  {
    company: "COPPER CODES LLP",
    role: "Add your role",
    duration: "Add dates",
    description: "Add a short description of what you did here.",
  },
];

export default function ExperiencePage() {
  return (
    <main className="min-h-screen w-full bg-white px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-[900px]">
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
              EXPERIENCE
            </span>
            <span className="font-body text-sm text-black/80">経歴</span>
          </div>
        </div>

        <h1 className="font-display mt-10 text-5xl leading-none text-black md:mt-16 md:text-7xl">
          Where I&rsquo;ve worked.
        </h1>

        {/* TIMELINE */}
        <ol className="mt-16 flex flex-col divide-y divide-black/10">
          {EXPERIENCE.map((entry, index) => (
            <li
              key={entry.company}
              className="flex flex-col gap-2 py-8 first:pt-0 md:flex-row md:items-baseline md:justify-between md:gap-10"
            >
              <div>
                <span className="font-body text-xs tracking-widest text-black/40">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h2 className="font-display mt-1 text-2xl font-bold text-black md:text-3xl">
                  {entry.company}
                </h2>

                <p className="mt-1 font-body text-sm text-black/60">{entry.role}</p>

                <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-black/70 md:text-base">
                  {entry.description}
                </p>
              </div>

              <span className="font-body text-xs tracking-widest text-black/40 md:shrink-0">
                {entry.duration}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}