import { Link } from "react-router-dom";
import FallingBlossoms from "../components/Fallingblossoms";

interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
  image?: string;
}

const EXPERIENCE: ExperienceEntry[] = [
  {
    company: "GEL",
    role: "Implementation Engineer",
    duration: "Jan 2026 – May 2026",
    description: "Managed and validated government service portal Change Requests for the GoaOnline e-Governance project, coordinating requirements with multiple state departments, collaborating with development teams to communicate approved changes and track issues through JIRA, and conducting client-side testing to verify implementations, demonstrate updates to stakeholders, and ensure timely delivery and approval.",
    image: "/images/experience/GEL-logo.png",
  },
  {
    company: "HUMAWINGS PVT. LTD.",
    role: "UI/UX Designer (Intern)",
    duration: "July 2025 – Sept 2025",
    description:
      "Designed Dairy Sathi, an end-to-end ordering and delivery ecosystem, after researching customers, delivery partners, and admins. Delivered three connected products — a customer app, a driver app, and an admin dashboard — with a consistent, accessible design system across all of them.",
    image: "/images/experience/Humawings-logo.png",
  },
  {
    company: "CVSYNK TECHNOLOGIES PVT. LTD.",
    role: "UI/UX & Frontend Developer (Intern)",
    duration: "Jan 2025 – Jun 2025",
    description:
      "Worked across both sides of the product on CVSYNK's client-facing platform — designing wireframes and UI components, then building them out as responsive front-end code with the Quasar framework. Bridged the gap between design intent and production implementation for real customers.",
    image: "/images/experience/CVSYNK-logo.png",
  },
  {
    company: "COPPER CODES LLP",
    role: "UI/UX Designer (Intern)",
    duration: "2024",
    description:
      "First professional design internship — led the UI/UX process in Figma across responsive layouts and interactive prototypes, and ran end-to-end case studies from user research through to polished screens. Developed a lasting interest in using illustration and animation to make interfaces feel more expressive.",
    image: "/images/experience/CopperCodes-logo.png",
  },
];

export default function ExperiencePage() {
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

      <div className="relative z-10 mx-auto max-w-[900px]">
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
              className="flex flex-col gap-6 py-8 first:pt-0 md:flex-row md:items-start md:gap-10"
            >
              {/* PHOTO */}
              {entry.image ? (
                <img
                  src={entry.image}
                  alt={entry.company}
                  className="h-44 w-full shrink-0 rounded-sm object-cover md:h-32 md:w-48"
                  loading="lazy"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="hidden h-32 w-48 shrink-0 rounded-sm bg-black/5 md:block"
                />
              )}

              <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-6">
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
              </div>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}