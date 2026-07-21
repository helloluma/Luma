/**
 * Luma logo mark — a triangle of dots that shimmer through the brand palette
 * (grey → blue → deep blue → green → amber) on a staggered delay, reusing the
 * same `.animate-luma-dot` animation as the original hexagon mark. Honors
 * prefers-reduced-motion (dots hold steady) via globals.css.
 */
const DOTS: { cx: number; cy: number; delay: number }[] = [
  { cx: 12, cy: 5.7646, delay: 0.4 },
  { cx: 9.6, cy: 9.9215, delay: 1.2 },
  { cx: 14.4, cy: 9.9215, delay: 2.0 },
  { cx: 7.2, cy: 14.0785, delay: 0.8 },
  { cx: 12, cy: 14.0785, delay: 1.6 },
  { cx: 16.8, cy: 14.0785, delay: 2.8 },
  { cx: 4.8, cy: 18.2354, delay: 0.2 },
  { cx: 9.6, cy: 18.2354, delay: 3.2 },
  { cx: 14.4, cy: 18.2354, delay: 1.0 },
  { cx: 19.2, cy: 18.2354, delay: 2.4 },
];

export function TriangleMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      {DOTS.map((d, i) => (
        <circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r="1.4"
          fill="#b8c1d4"
          className="animate-luma-dot"
          style={{ animationDelay: `${d.delay}s` }}
        />
      ))}
    </svg>
  );
}
