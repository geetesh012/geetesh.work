interface HeroProps {
  mounted: boolean;
}

const VIDEO_SRC =
  'https://res.cloudinary.com/s6be1tov/video/upload/v1788247949/bg-video.mp4';

const TEXT_ENTRANCE =
  'transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]';

export default function Hero({ mounted }: HeroProps) {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background video */}
      <div
        className={`absolute inset-0 transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mounted ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
        }`}
      >
        <video
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          ref={(video) => {if (video) {video.playbackRate = 1;}}}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Foreground */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
  <h1
    className={`font-display font-semibold text-hero text-white mb-4 md:mb-6 delay-[400ms] ${TEXT_ENTRANCE} ${
    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  }`}
  >
    Jack of all trades. Master of none.<br />
    And that's the point.
  </h1>

  <p
    className={`font-display font-medium text-hero-accent text-white/85 delay-[600ms] ${TEXT_ENTRANCE} ${
      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}
  >
    Frontend developer | UI/UX designer
  </p>
</div>
    </section>
  );
}