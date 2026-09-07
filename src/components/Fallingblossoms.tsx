import { useMemo } from "react";

interface Petal {
  id: number;
  left: number; 
  size: number; 
  duration: number; 
  delay: number; 
  drift: number; 
  rotateStart: number; 
  opacity: number;
  color: string;
}

const PETAL_COLORS = ["#e2493c", "#eb7a72", "#c9403f", "#e88f8a"];

function generatePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 10 + Math.random() * 14,
    duration: 11 + Math.random() * 10,
    delay: -Math.random() * 20,
    drift: 60 + Math.random() * 100 * (Math.random() < 0.5 ? -1 : 1),
    rotateStart: Math.random() * 360,
    opacity: 0.45 + Math.random() * 0.4,
    color: PETAL_COLORS[i % PETAL_COLORS.length],
  }));
}

interface FallingBlossomsProps {
  /** Number of petals on screen at once. Keep modest — this runs on every page. */
  count?: number;
  className?: string;
}

export default function FallingBlossoms({
  count = 20,
  className = "",
}: FallingBlossomsProps) {
  const petals = useMemo(() => generatePetals(count), [count]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
    >
      <style>{`
        @keyframes blossom-fall {
          0% {
            transform: translate(0, -10vh) rotate(0deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--drift), 110vh) rotate(360deg);
            opacity: 0;
          }
        }
        .blossom-petal {
          position: absolute;
          top: 0;
          animation-name: blossom-fall;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .blossom-petal {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>

      {petals.map((p) => (
        <span
          key={p.id}
          className="blossom-petal"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            // @ts-expect-error -- custom property consumed by the keyframes above
            "--drift": `${p.drift}px`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="100%"
            height="100%"
            style={{ transform: `rotate(${p.rotateStart}deg)` }}
          >
            <path
              d="M12 2C8.5 6.5 8.5 11 12 13C15.5 11 15.5 6.5 12 2Z"
              fill={p.color}
            />
          </svg>
        </span>
      ))}
    </div>
  );
}