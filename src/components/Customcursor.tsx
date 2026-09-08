import { useEffect, useRef, useState } from 'react';

const HOVER_SELECTOR = 'a, button, [data-cursor-hover]';
const TRAIL_MAX_AGE = 320;
const MAX_POINTS = 32;
const BLADE_WIDTH = 7;
const SPARK_LIFETIME = 260;

const BRAND_RED: [number, number, number] = [185, 23, 41];
const CORE_COLOR: [number, number, number] = [253, 246, 243];

interface Point {
  x: number;
  y: number;
  t: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
}

function smooth(points: Point[]): Point[] {
  if (points.length < 3) return points;

  const out: Point[] = [points[0]];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];

    out.push({
      x: p0.x * 0.75 + p1.x * 0.25,
      y: p0.y * 0.75 + p1.y * 0.25,
      t: p0.t * 0.75 + p1.t * 0.25,
    });

    out.push({
      x: p0.x * 0.25 + p1.x * 0.75,
      y: p0.y * 0.25 + p1.y * 0.75,
      t: p0.t * 0.25 + p1.t * 0.75,
    });
  }

  out.push(points[points.length - 1]);

  return out;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bladeRef = useRef<HTMLDivElement>(null);

  const points = useRef<Point[]>([]);
  const sparks = useRef<Spark[]>([]);
  const rafRef = useRef<number | null>(null);

  const lastAngle = useRef(0);

  const [enabled] = useState(() =>
    window.matchMedia('(pointer: fine)').matches
  );

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add('custom-cursor-active');

    const canvas = canvasRef.current;
    const blade = bladeRef.current;

    if (!canvas || !blade) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const hovering = { current: false };

    const applyBladeTransform = (
      x: number,
      y: number,
      angle = lastAngle.current
    ) => {
      const scale = hovering.current ? 1.35 : 1;

      blade.style.transform = `
        translate3d(${x}px, ${y}px, 0)
        translate(-50%, -50%)
        rotate(${angle}rad)
        scale(${scale})
      `;
    };

    const onMove = (e: MouseEvent) => {
      const now = performance.now();

      const prev = points.current[points.current.length - 1];

      points.current.push({
        x: e.clientX,
        y: e.clientY,
        t: now,
      });

      /*
       * Rotate the ninja blade in the direction of movement.
       */
      if (prev) {
        const dx = e.clientX - prev.x;
        const dy = e.clientY - prev.y;

        if (Math.hypot(dx, dy) > 1) {
          const targetAngle = Math.atan2(dy, dx);

          // Smooth rotation
          let difference = targetAngle - lastAngle.current;

          while (difference > Math.PI) difference -= Math.PI * 2;
          while (difference < -Math.PI) difference += Math.PI * 2;

          lastAngle.current += difference * 0.22;
        }

        const dist = Math.hypot(dx, dy);

        /*
         * Throw off sparks when moving quickly.
         */
        if (dist > 18 && sparks.current.length < 14) {
          const count = Math.min(2, Math.floor(dist / 18));

          for (let i = 0; i < count; i++) {
            const spread =
              (Math.random() - 0.5) * Math.PI * 1.4;

            const speed = 0.6 + Math.random() * 1.2;

            sparks.current.push({
              x: e.clientX,
              y: e.clientY,
              vx: Math.cos(spread) * speed,
              vy: Math.sin(spread) * speed,
              born: now,
            });
          }
        }
      }

      applyBladeTransform(
        e.clientX,
        e.clientY,
        lastAngle.current
      );

      blade.style.opacity = '1';
    };

    const onMouseOver = (e: MouseEvent) => {
      if (
        (e.target as Element)?.closest?.(
          HOVER_SELECTOR
        )
      ) {
        hovering.current = true;
        blade.classList.add('cursor-blade-hovering');
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (
        (e.target as Element)?.closest?.(
          HOVER_SELECTOR
        )
      ) {
        hovering.current = false;
        blade.classList.remove('cursor-blade-hovering');
      }
    };

    const onLeaveWindow = () => {
      blade.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener(
      'mouseleave',
      onLeaveWindow
    );

    const draw = () => {
      const now = performance.now();

      /*
       * Remove old trail points.
       */
      points.current = points.current.filter(
        (p) => now - p.t < TRAIL_MAX_AGE
      );

      if (points.current.length > MAX_POINTS) {
        points.current = points.current.slice(
          points.current.length - MAX_POINTS
        );
      }

      /*
       * Remove expired sparks.
       */
      sparks.current = sparks.current.filter(
        (s) => now - s.born < SPARK_LIFETIME
      );

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const raw = points.current;

      if (raw.length > 2) {
        const pts = smooth(raw);

        const meta = pts.map((p) => {
          const age = Math.min(
            1,
            Math.max(
              0,
              (now - p.t) / TRAIL_MAX_AGE
            )
          );

          const alpha = 1 - age;

          return {
            ...p,
            alpha,
            width:
              BLADE_WIDTH *
              alpha *
              0.5,
          };
        });

        const normalAt = (i: number) => {
          const prev =
            meta[Math.max(0, i - 1)];

          const next =
            meta[
              Math.min(
                meta.length - 1,
                i + 1
              )
            ];

          const dx = next.x - prev.x;
          const dy = next.y - prev.y;

          const len =
            Math.hypot(dx, dy) || 1;

          return {
            nx: -dy / len,
            ny: dx / len,
          };
        };

        /*
         * Continuous tapered blade trail.
         */
        const left: {
          x: number;
          y: number;
        }[] = [];

        const right: {
          x: number;
          y: number;
        }[] = [];

        for (let i = 0; i < meta.length; i++) {
          const p = meta[i];

          if (p.alpha <= 0.02) continue;

          const { nx, ny } =
            normalAt(i);

          left.push({
            x: p.x + nx * p.width,
            y: p.y + ny * p.width,
          });

          right.push({
            x: p.x - nx * p.width,
            y: p.y - ny * p.width,
          });
        }

        if (left.length > 1) {
          ctx.beginPath();

          ctx.moveTo(
            left[0].x,
            left[0].y
          );

          for (
            let i = 1;
            i < left.length;
            i++
          ) {
            ctx.lineTo(
              left[i].x,
              left[i].y
            );
          }

          for (
            let i = right.length - 1;
            i >= 0;
            i--
          ) {
            ctx.lineTo(
              right[i].x,
              right[i].y
            );
          }

          ctx.closePath();

          const tail = meta[0];
          const head =
            meta[meta.length - 1];

          const headAlpha =
            head.alpha;

          const grad =
            ctx.createLinearGradient(
              tail.x,
              tail.y,
              head.x,
              head.y
            );

          grad.addColorStop(
            0,
            `rgba(${BRAND_RED.join(',')},0)`
          );

          grad.addColorStop(
            0.4,
            `rgba(${BRAND_RED.join(',')},${
              0.5 * headAlpha
            })`
          );

          grad.addColorStop(
            1,
            `rgba(${CORE_COLOR.join(',')},${
              0.9 * headAlpha
            })`
          );

          ctx.fillStyle = grad;

          ctx.shadowColor = `rgba(${BRAND_RED.join(
            ','
          )},0.45)`;

          ctx.shadowBlur = 5;

          ctx.fill();

          ctx.shadowBlur = 0;
        }

        /*
         * Bright leading edge.
         */
        ctx.beginPath();

        let started = false;

        const glintStart = Math.max(
          0,
          Math.floor(meta.length * 0.6)
        );

        for (
          let i = glintStart;
          i < meta.length;
          i++
        ) {
          const p = meta[i];

          if (p.alpha < 0.45) continue;

          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }

        if (started) {
          ctx.strokeStyle = `rgba(${CORE_COLOR.join(
            ','
          )},0.9)`;

          ctx.lineWidth = 1.3;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          ctx.stroke();
        }
      }

      /*
       * Ember sparks.
       */
      for (const s of sparks.current) {
        const age =
          (now - s.born) /
          SPARK_LIFETIME;

        const alpha =
          Math.max(0, 1 - age);

        if (alpha <= 0) continue;

        const x =
          s.x +
          s.vx *
            (now - s.born) *
            0.18;

        const y =
          s.y +
          s.vy *
            (now - s.born) *
            0.18;

        const color =
          age < 0.5
            ? CORE_COLOR
            : BRAND_RED;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          Math.max(
            0.4,
            1.3 * alpha
          ),
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(${color.join(
          ','
        )},${alpha})`;

        ctx.fill();
      }

      rafRef.current =
        requestAnimationFrame(draw);
    };

    rafRef.current =
      requestAnimationFrame(draw);

    return () => {
      document.body.classList.remove(
        'custom-cursor-active'
      );

      window.removeEventListener(
        'resize',
        resize
      );

      window.removeEventListener(
        'mousemove',
        onMove
      );

      document.removeEventListener(
        'mouseover',
        onMouseOver
      );

      document.removeEventListener(
        'mouseout',
        onMouseOut
      );

      document.removeEventListener(
        'mouseleave',
        onLeaveWindow
      );

      if (rafRef.current !== null) {
        cancelAnimationFrame(
          rafRef.current
        );
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Existing animated trail */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[100] pointer-events-none"
      />

      {/* Ninja blade cursor */}
      <div
        ref={bladeRef}
        className="
          cursor-blade
          fixed
          top-0
          left-0
          z-[101]
          pointer-events-none
          opacity-0
        "
        style={{
          width: '30px',
          height: '30px',
          transform:
            'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          filter:
            'drop-shadow(0 0 4px rgba(185, 23, 41, 0.55))',
          transition:
            'opacity 180ms ease, transform 120ms ease-out',
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Soft red glow applied to the blade's outline */}
            <filter
              id="bladeGlow"
              x="-60%"
              y="-60%"
              width="220%"
              height="220%"
            >
              <feGaussianBlur
                stdDeviation="2.5"
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Brushed-metal shading across each blade face */}
            <linearGradient
              id="shurikenMetal"
              x1="15%"
              y1="0%"
              x2="85%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#9a9ea3" />
              <stop offset="45%" stopColor="#54575c" />
              <stop offset="100%" stopColor="#161718" />
            </linearGradient>
          </defs>

          {/*
            Six-point ninja star, glowing red outline, with a true
            transparent center hole (evenodd) instead of a solid disc.
          */}
          <path
            d="
              M50,2 L59,34.41 L91.57,26 L68,50
              L91.57,74 L59,65.59 L50,98 L41,65.59
              L8.43,74 L32,50 L8.43,26 L41,34.41 Z
              M60,50
              A10,10 0 1 0 40,50
              A10,10 0 1 0 60,50 Z
            "
            fill="url(#shurikenMetal)"
            fillRule="evenodd"
            stroke="#B91729"
            strokeWidth="2"
            strokeLinejoin="round"
            filter="url(#bladeGlow)"
          />

          {/* Subtle dark bezel around the hole */}
          <circle
            cx="50"
            cy="50"
            r="10"
            fill="none"
            stroke="#0d0d0d"
            strokeOpacity="0.6"
            strokeWidth="1.2"
          />
        </svg>
      </div>
    </>
  );
}