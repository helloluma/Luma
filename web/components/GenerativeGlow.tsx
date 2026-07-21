"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Apple Intelligence-style ambient glow, ported from the generative-ui demo's
 * AIGlowAvatar and retuned to Luma's palette (blues → cyan → green → indigo,
 * no rainbow). Renders as a soft breathing pulse behind the demo loader.
 * Honors prefers-reduced-motion by painting a single static frame.
 */

type RGB = { r: number; g: number; b: number };

const COLORS: RGB[] = [
  { r: 91, g: 141, b: 239 }, // soft blue  #5b8def
  { r: 22, g: 82, b: 197 }, //  accent blue #1652c5
  { r: 45, g: 156, b: 219 }, // cyan
  { r: 2, g: 122, b: 72 }, //   grounded green #027a48
  { r: 99, g: 102, b: 241 }, // indigo
  { r: 138, g: 163, b: 204 }, // muted blue-gray
];

function lerp(a: RGB, b: RGB, t: number): RGB {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

function colorAt(position: number, time: number): RGB {
  const p = (position + time) % 1;
  const idx = p * COLORS.length;
  const i = Math.floor(idx);
  return lerp(COLORS[i % COLORS.length], COLORS[(i + 1) % COLORS.length], idx - i);
}

export function GenerativeGlow({
  size = 260,
  fill = false,
}: {
  size?: number;
  fill?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // In fill mode the glow spans the viewport (prism-style wash); otherwise it
  // uses the fixed `size`. Track the working dimension so it stays responsive.
  const [dim, setDim] = useState(size);

  useEffect(() => {
    if (!fill) {
      setDim(size);
      return;
    }
    const update = () =>
      setDim(Math.ceil(Math.max(window.innerWidth, window.innerHeight) * 1.3));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [fill, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Full-viewport canvases can get large; drop DPR so the blurred wash stays cheap.
    const dpr = fill ? 1 : 2;
    const center = dim / 2;
    const glowRadius = dim * 0.34;
    const size = dim;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let time = 0;
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      // stacked glow layers for depth
      for (let layer = 4; layer >= 0; layer--) {
        const layerRadius = glowRadius + layer * size * 0.045;
        const layerOpacity = 0.16 - layer * 0.025;
        const segments = 64;
        for (let i = 0; i < segments; i++) {
          const start = (i / segments) * Math.PI * 2 - Math.PI / 2;
          const end = ((i + 1.5) / segments) * Math.PI * 2 - Math.PI / 2;
          const pos = i / segments;
          const c = colorAt(pos, time);
          const pulse = Math.sin(time * 3 + pos * Math.PI * 2) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.arc(center, center, layerRadius, start, end);
          ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${layerOpacity * pulse})`;
          ctx.lineWidth = size * (0.03 + layer * 0.012);
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }
    };

    if (reduce) {
      draw();
      return;
    }

    const loop = () => {
      draw();
      time += 0.015;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [dim, fill]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={fill ? "blur-[80px]" : "blur-2xl"}
      style={{ opacity: fill ? 0.8 : 0.9 }}
    />
  );
}
