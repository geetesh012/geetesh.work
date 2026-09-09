interface LinkRow {
  label: string;
  description: string;
  href: string;
  isEmail?: boolean;
}

const LINKS: LinkRow[] = [
  {
    label: 'EMAIL',
    description: 'geeteshkankonkar@gmail.com',
    href: 'mailto:geeteshkankonkar@gmail.com',
    isEmail: true,
  },
  {
    label: 'LINKEDIN',
    description: 'Design, Technology, Collaborations & Interesting Opportunities.',
    href: 'https://www.linkedin.com/in/geetesh-kankonkar-1365b11a3/',
  },
  {
    label: 'GITHUB',
    description: 'Selected Experiments, Builds & Things From The Lab.',
    href: 'https://github.com/geetesh012',
  },
  {
    label: 'BEHANCE',
    description: 'Visual Work, Case Studies And Creative Explorations.',
    href: 'https://www.behance.net/geeteshkankonk',
  },
];

export default function Footer() {
  return (
    <section id="contact">
    <footer className="bg-[#D52F23] px-6 md:px-10 py-16 md:py-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-[#180503] rounded-md overflow-hidden">
          {/* header row */}
          <div className="flex items-baseline gap-4 px-8 md:px-12 py-8 border-b border-dashed border-white/20">
            <span className="text-red-500 font-body font-semibold text-xl md:text-2xl">連絡</span>
            <span className="font-structure text-nav text-white/60 tracking-widest">
              OR REACH OUT THE OLD-FASHIONED WAY
            </span>
          </div>

          {/* link rows */}
          {LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target={link.isEmail ? undefined : '_blank'}
              rel={link.isEmail ? undefined : 'noreferrer'}
              className={`group flex flex-col md:flex-row md:items-center gap-2 md:gap-8 px-8 md:px-12 py-8 md:py-10 transition-colors hover:bg-white/5 ${
                i < LINKS.length - 1 ? 'border-b border-dashed border-white/20' : ''
              }`}
            >
              <span className="font-structure text-nav text-white/50 tracking-widest w-24 md:w-28 flex-none">
                {link.label}
              </span>
              <span
                className={`font-display text-white group-hover:text-red-400 transition-colors ${
                  link.isEmail
                    ? 'text-2xl sm:text-3xl md:text-4xl'
                    : 'text-2xl md:text-3xl'
                }`}
              >
                {link.isEmail ? link.description : link.label}
              </span>
              {!link.isEmail && (
                <span className="font-body font-normal text-white/50 text-base md:text-lg">
                  {link.description}
                </span>
              )}
            </a>
          ))}
        </div>

        {/* bottom meta row */}
        <div className="flex items-center justify-between mt-8 px-2">
          <span className="font-structure text-nav text-white/50 tracking-widest">
            GEETESH &nbsp;·&nbsp; 永遠 &nbsp;·&nbsp; 2026
          </span>
          <span className="flex items-center gap-2">
            <span className="font-body font-semibold text-white text-base">作品集</span>
            <span className="font-body font-normal text-white/60 text-sm">Portfolio</span>
          </span>
        </div>
      </div>
    </footer>
  </section>
  );
}