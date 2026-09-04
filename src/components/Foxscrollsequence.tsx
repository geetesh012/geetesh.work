"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

interface FoxScrollSequenceProps {
  /** Ref to the pinned/sticky parent section that defines the scroll range
   *  (in Work.tsx this is `pinRef`, the 210vh <section>). */
  pinSourceRef: RefObject<HTMLElement | null>;
  className?: string;
  /** Folder containing the exported frames, relative to /public. */
  basePath?: string;
  /** File extension of the exported frames. webp is smallest for photo/painted art. */
  extension?: "png" | "webp" | "jpg";
  /** Total number of exported frames (frame_0001..frame_00XX). */
  frameCount?: number;
  /** Zero-pad width for filenames — 4 -> frame_0001.png */
  padLength?: number;
  /** width / height of one frame. If omitted, it's auto-detected from the
   *  first frame once it loads, so the box always matches your art exactly. */
  aspectRatio?: number;
  /** 0..1. How quickly the displayed frame catches up to the scroll target.
   *  Lower = smoother/slower, higher = snappier/more literal. */
  smoothing?: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function FoxScrollSequence({
  pinSourceRef,
  className = "",
  basePath = "/images/kitsune-frames",
  extension = "webp",
  frameCount = 147,
  padLength = 4,
  aspectRatio,
  smoothing = 0.06,
}: FoxScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedUpToRef = useRef(0); // highest contiguously-loaded frame index + 1
  const currentFrameRef = useRef(0); // smoothed, fractional frame
  const targetFrameRef = useRef(0); // scroll-derived target frame
  const rafRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  // Falls back to a portrait box until the real aspect ratio is known, so
  // there's no square/cropped flash while the first frame loads.
  const [detectedAspectRatio, setDetectedAspectRatio] = useState(0.75);

  const frameSrc = useCallback(
    (index: number) => {
      const n = String(index + 1).padStart(padLength, "0");
      return `${basePath}/frame_${n}.${extension}`;
    },
    [basePath, extension, padLength]
  );

  // Preload every frame. Frames can resolve out of order over the network,
  // but loadedUpToRef only ever advances contiguously, so playback never
  // jumps ahead to a frame that isn't actually ready.
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(frameCount);
    const loaded = new Array(frameCount).fill(false);
    loadedUpToRef.current = 0;

    const advanceContiguous = () => {
      let i = loadedUpToRef.current;
      while (i < frameCount && loaded[i]) i++;
      loadedUpToRef.current = i;
      setLoadProgress(i / frameCount);
      if (i > 0) setIsReady(true);
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameSrc(i);
      img.onload = () => {
        if (cancelled) return;
        if (i === 0 && aspectRatio === undefined && img.naturalWidth > 0) {
          setDetectedAspectRatio(img.naturalWidth / img.naturalHeight);
        }
        loaded[i] = true;
        advanceContiguous();
      };
      img.onerror = () => {
        if (cancelled) return;
        // Don't let one missing file stall the whole sequence.
        loaded[i] = true;
        advanceContiguous();
      };
      images[i] = img;
    }

    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, [frameCount, frameSrc]);

  // Size the canvas to its container, respecting devicePixelRatio for crisp art.
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  useEffect(() => {
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", resizeCanvas);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas]);

  // Draws a (possibly fractional) frame, cross-fading between its two
  // neighbouring integer frames so the transition reads as smooth motion
  // rather than a hard per-frame jump.
  const draw = useCallback((frame: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    const maxIndex = Math.max(loadedUpToRef.current - 1, 0);
    const clamped = clamp(frame, 0, maxIndex);
    const lower = Math.floor(clamped);
    const upper = Math.min(lower + 1, maxIndex);
    const t = clamped - lower;

    const images = imagesRef.current;
    const lowerImg = images[lower];
    const upperImg = images[upper];

    ctx.clearRect(0, 0, w, h);

    const drawContain = (img: HTMLImageElement | undefined, alpha: number) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      ctx.globalAlpha = alpha;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const boxRatio = w / h;
      // Fit the WHOLE image inside the box (never crop): constrain by
      // whichever dimension would otherwise overflow.
      let dw: number;
      let dh: number;
      if (imgRatio > boxRatio) {
        // Image is relatively wider than the box -> width is the limit.
        dw = w;
        dh = w / imgRatio;
      } else {
        // Image is relatively taller than the box -> height is the limit.
        dh = h;
        dw = h * imgRatio;
      }
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    drawContain(lowerImg, 1);
    if (upper !== lower && t > 0.01) drawContain(upperImg, t);
    ctx.globalAlpha = 1;
  }, []);

  // Main loop: reads the pinned section's position every animation frame
  // (cheap — just a getBoundingClientRect) and eases the displayed frame
  // toward the scroll-derived target, instead of snapping to it 1:1.
  useEffect(() => {
    const tick = () => {
      const section = pinSourceRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const scrollableDistance = rect.height - viewportH;
        const progress =
          scrollableDistance > 0
            ? clamp(-rect.top / scrollableDistance, 0, 1)
            : 0;

        const maxIndex = Math.max(frameCount - 1, 0);
        targetFrameRef.current = progress * maxIndex;
      }

      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current +=
        Math.abs(diff) > 0.001 ? diff * smoothing : diff;

      draw(currentFrameRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw, frameCount, pinSourceRef, smoothing]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      style={{ aspectRatio: String(aspectRatio ?? detectedAspectRatio) }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center font-body text-xs tracking-widest text-black/30">
          {Math.round(loadProgress * 100)}%
        </div>
      )}
    </div>
  );
}