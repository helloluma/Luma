"use client";

/**
 * v2 loading indicator — a triangle of dots (Vercel's "idle" loader shape) that
 * ripples top-to-bottom. Animation + colors live in globals.css (.tri-loader).
 */
export function TriangleLoader({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={"tri-loader " + className}
    >
      <circle cx="12" cy="5.7646" r="1.4" className="dot dot-1" />
      <circle cx="9.6" cy="9.9215" r="1.4" className="dot dot-2" />
      <circle cx="14.4" cy="9.9215" r="1.4" className="dot dot-3" />
      <circle cx="7.2" cy="14.0785" r="1.4" className="dot dot-4" />
      <circle cx="12" cy="14.0785" r="1.4" className="dot dot-5" />
      <circle cx="16.8" cy="14.0785" r="1.4" className="dot dot-6" />
      <circle cx="4.8" cy="18.2354" r="1.4" className="dot dot-7" />
      <circle cx="9.6" cy="18.2354" r="1.4" className="dot dot-8" />
      <circle cx="14.4" cy="18.2354" r="1.4" className="dot dot-9" />
      <circle cx="19.2" cy="18.2354" r="1.4" className="dot dot-10" />
    </svg>
  );
}
