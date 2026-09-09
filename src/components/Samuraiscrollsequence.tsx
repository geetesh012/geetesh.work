import { useEffect, useRef, useState, type RefObject } from 'react';

interface SamuraiScrollSequenceProps {
  className?: string;
  pinSourceRef?: RefObject<HTMLElement | null>;
}

const FRAME_COUNT = 50;
const FRAME_PATH = (index: number) =>
  `/images/samurai-frames/frame-${String(index + 1).padStart(3, '0')}.png`;

const CONCURRENT_LOADS = 12;

export default function SamuraiScrollSequence({ className = '', pinSourceRef }: SamuraiScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
  const lastDrawnFloatIndexRef = useRef(-1);
  const rafRef = useRef<number | null>(null);

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [failedPath, setFailedPath] = useState('');

  const drawCoverImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement, alpha: number) => {
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = imgW / imgH;

    let sx = 0;
    let sy = 0;
    let sWidth = imgW;
    let sHeight = imgH;

    if (imgAspect > canvasAspect) {
      // Frame is relatively wider than the canvas — crop the sides.
      sWidth = imgH * canvasAspect;
      sx = (imgW - sWidth) / 2;
    } else {
      // Frame is relatively taller than the canvas — crop top/bottom.
      sHeight = imgW / canvasAspect;
      sy = (imgH - sHeight) / 2;
    }

    ctx.globalAlpha = alpha;
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
  };

  const drawFrame = (lowerIndex: number, upperIndex: number = lowerIndex, frac = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    if (displayWidth === 0 || displayHeight === 0) return;

    const targetW = Math.round(displayWidth * dpr);
    const targetH = Math.round(displayHeight * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const lowerImg = imagesRef.current[lowerIndex];
    const upperImg = imagesRef.current[upperIndex];
    if (!lowerImg && !upperImg) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (lowerImg) drawCoverImage(ctx, lowerImg, canvas, 1);
    if (upperImg && upperIndex !== lowerIndex && frac > 0) drawCoverImage(ctx, upperImg, canvas, frac);
  };

  const findLoadedFrame = (index: number) => {
    if (imagesRef.current[index]) return index;
    for (let d = 1; d < FRAME_COUNT; d += 1) {
      if (index - d >= 0 && imagesRef.current[index - d]) return index - d;
      if (index + d < FRAME_COUNT && imagesRef.current[index + d]) return index + d;
    }
    return null;
  };

  useEffect(() => {
    let cancelled = false;

    const loadOne = (index: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.src = FRAME_PATH(index);
        img.onload = () => {
          if (cancelled) return resolve();
          imagesRef.current[index] = img;
          if (index === 0) {
            setStatus('ready');
            // Draw on next tick so the canvas has picked up its sized layout first.
            requestAnimationFrame(() => drawFrame(0, 0, 0));
          }
          resolve();
        };
        img.onerror = () => {
          if (cancelled) return resolve();
          if (index === 0) {
            console.error(`SamuraiScrollSequence: failed to load ${img.src}`);
            setFailedPath(img.src);
            setStatus('error');
          }
          resolve(); // don't hang the batch queue on missing later frames
        };
      });

    const loadAll = async () => {
      await loadOne(0);
      const remaining = Array.from({ length: FRAME_COUNT - 1 }, (_, i) => i + 1);
      for (let i = 0; i < remaining.length; i += CONCURRENT_LOADS) {
        if (cancelled) return;
        await Promise.all(remaining.slice(i, i + CONCURRENT_LOADS).map(loadOne));
      }
    };

    loadAll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let running = true;
    const displayedProgressRef = { current: 0 };
    // Lower = lazier/slower catch-up. Higher = snappier, closer to 1:1 with scroll.
    const EASE = 0.035;

    const loop = () => {
      if (!running) return;
      const viewportHeight = window.innerHeight;

      let targetProgress: number;

      const pinEl = pinSourceRef?.current;
      if (pinEl) {
        const rect = pinEl.getBoundingClientRect();
        const scrollable = rect.height - viewportHeight;
        targetProgress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      } else {
        const el = containerRef.current;
        if (!el) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
        const rect = el.getBoundingClientRect();
        const total = viewportHeight + rect.height;
        const traveled = viewportHeight - rect.top;
        targetProgress = Math.min(1, Math.max(0, traveled / total));
      }

      displayedProgressRef.current += (targetProgress - displayedProgressRef.current) * EASE;

      const floatIndex = displayedProgressRef.current * (FRAME_COUNT - 1);
      // Skip redraws for imperceptibly small changes (e.g. once eased motion
      // has settled) rather than repainting every frame for nothing.
      if (Math.abs(floatIndex - lastDrawnFloatIndexRef.current) > 0.002) {
        lastDrawnFloatIndexRef.current = floatIndex;

        const rawLower = Math.floor(floatIndex);
        const rawUpper = Math.min(rawLower + 1, FRAME_COUNT - 1);
        const frac = floatIndex - rawLower;

        const lower = findLoadedFrame(rawLower);
        const upper = findLoadedFrame(rawUpper);

        if (lower !== null && upper !== null) {
          drawFrame(lower, upper, lower === upper ? 0 : frac);
        } else if (lower !== null) {
          drawFrame(lower);
        } else if (upper !== null) {
          drawFrame(upper);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [pinSourceRef]);

  if (status === 'error') {
    return (
      <div
        className={`${className} w-full h-full flex items-center justify-center border border-dashed border-white/30 bg-white/5 text-center p-3`}
      >
        <p className="font-body text-[11px] leading-snug text-white/60">
          Fox frames not found.
          <br />
          Expected: <code className="break-all">{failedPath}</code>
          <br />
          Check the folder + filename pattern.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`${className} w-full h-full`}>
      <canvas
        ref={canvasRef}
        className={`block w-full h-full transition-opacity duration-500 ${
          status === 'ready' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}