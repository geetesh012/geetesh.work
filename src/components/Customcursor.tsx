import { useEffect, useRef, useState } from 'react';

// Elements that trigger the "engaged" resting-dot state.
const HOVER_SELECTOR = 'a, button, [data-cursor-hover]';

// How long (ms) a captured point stays part of the trail before it's
// dropped. This is what makes the slash vanish almost immediately once
// the cursor stops moving — no new points come in, and old ones age out.
const TRAIL_MAX_AGE = 160;
const MAX_POINTS = 24;

interface Point {
  x: number;
  y: number;
  t: number;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const points = useRef<Point[]>([]);
  const rafRef = useRef<number | null>(null);

  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches);

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add('custom-cursor-active');

    const canvas = canvasRef.current;
    const dot = dotRef.current;
    if (!canvas || !dot) return;
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

    const applyDotTransform = (x: number, y: number) => {
      const scale = hovering.current ? 1.8 : 1;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
    };

    const onMove = (e: MouseEvent) => {
      points.current.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      applyDotTransform(e.clientX, e.clientY);
      dot.style.opacity = '1';
    };

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(HOVER_SELECTOR)) {
        hovering.current = true;
        dot.classList.add('cursor-dot-hovering');
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(HOVER_SELECTOR)) {
        hovering.current = false;
        dot.classList.remove('cursor-dot-hovering');
      }
    };
    const onLeaveWindow = () => {
      dot.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('mouseleave', onLeaveWindow);

    const draw = () => {
      const now = performance.now();
      points.current = points.current.filter((p) => now - p.t < TRAIL_MAX_AGE);
      if (points.current.length > MAX_POINTS) {
        points.current = points.current.slice(points.current.length - MAX_POINTS);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = points.current;
      for (let i = 1; i < pts.length; i++) {
        const p0 = pts[i - 1];
        const p1 = pts[i];
        const age = (now - p1.t) / TRAIL_MAX_AGE; // 0 = just captured, 1 = about to vanish
        const alpha = Math.max(0, 1 - age);
        if (alpha <= 0) continue;

        // White-hot when fresh, fading toward red as it ages — a blade
        // edge cooling from the cut.
        const g = Math.round(255 * (1 - age));
        const b = Math.round(255 * (1 - age));

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(255, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = Math.max(0.5, 3 * alpha);
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(220, 38, 38, 0.7)';
        ctx.shadowBlur = 4;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mouseleave', onLeaveWindow);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-[100] pointer-events-none" />
      <div
        ref={dotRef}
        className="cursor-dot fixed top-0 left-0 z-[100] pointer-events-none w-2 h-2 rounded-full bg-white opacity-0 transition-opacity duration-200"
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          boxShadow: '0 0 5px 1px var(--about-red)',
        }}
      />
    </>
  );
}