import { useEffect, useRef, useState } from 'react';

export default function SoundToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.2;

    const tryAutoplay = async () => {
      try {
        // Try playing with sound right away.
        audio.muted = false;
        await audio.play();
        setMuted(false);
      } catch {
        // Browser blocked unmuted autoplay — fall back to muted,
        // which is allowed everywhere. User can unmute via the button.
        audio.muted = true;
        setMuted(true);
        audio.play().catch(() => {});
      }
    };

    tryAutoplay();
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const next = !muted;
    audio.muted = next;

    if (!next) {
      audio.play().catch(() => {});
    }

    setMuted(next);
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/song.mp3" loop preload="auto" />

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? 'Unmute background music' : 'Mute background music'}
        aria-pressed={!muted}
        className="
          fixed
          bottom-7
          left-7
          z-20
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          border
          border-[#635e58]
          bg-[#0a0908]/80
          text-[#f2efe9]
          shadow-lg
          shadow-black/40
          backdrop-blur-sm
          transition-all
          duration-300
          hover:scale-105
          hover:border-[#d13a3a]
          hover:text-[#d13a3a]
          active:scale-95
        "
      >
        {muted ? (
          // Sound Off icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            <line x1="16" y1="9" x2="22" y2="15" />
            <line x1="22" y1="9" x2="16" y2="15" />
          </svg>
        ) : (
          // Sound On icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
        )}
      </button>
    </>
  );
}