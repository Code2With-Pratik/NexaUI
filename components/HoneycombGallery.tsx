"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auraEase } from "@/lib/motion";

type Tile = {
  title: string;
  subtitle: string;
  image: string;
};

const tiles: Tile[] = [
  {
    title: "Flight",
    subtitle: "Aerial",
    image:
      "https://images.unsplash.com/photo-1503146234398-d20f9aa7b8b6?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Aurora",
    subtitle: "Night sky",
    image:
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Mist",
    subtitle: "Forest",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Coastal",
    subtitle: "Ocean edge",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Urban",
    subtitle: "Street",
    image:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Portrait",
    subtitle: "Human",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Nature",
    subtitle: "Wild",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop",
  },
];

/* Pointy-top hex, W:H ≈ 0.866:1 — bigger photographic tiles */
const HEX_W = 200;
const HEX_H = 230;
const GAP = 24;
const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const H_PITCH = HEX_W + GAP;               // 224
const ROW_Y = HEX_H * 0.75 + GAP;          // 196.5

const positions: Array<{ x: number; y: number }> = [
  { x: H_PITCH, y: ROW_Y },                // center
  { x: H_PITCH * 2, y: ROW_Y },            // right
  { x: H_PITCH * 1.5, y: ROW_Y * 2 },      // lower-right
  { x: H_PITCH * 0.5, y: ROW_Y * 2 },      // lower-left
  { x: 0, y: ROW_Y },                      // left
  { x: H_PITCH * 0.5, y: 0 },              // upper-left
  { x: H_PITCH * 1.5, y: 0 },              // upper-right
];

const CONTAINER_W = H_PITCH * 2 + HEX_W;   // 648
const CONTAINER_H = ROW_Y * 2 + HEX_H;     // 623

/* ── Hex border-glow geometry ──────────────────────────────────────
   Inset the polygon slightly inside the clip-path so the stroke isn't
   clipped at the tile's edges. Compute the perimeter so we know how
   long to make the dash-offset animation. */
const STROKE_INSET = 3;
const HEX_POINTS = [
  [HEX_W / 2, STROKE_INSET],
  [HEX_W - STROKE_INSET, HEX_H * 0.25],
  [HEX_W - STROKE_INSET, HEX_H * 0.75],
  [HEX_W / 2, HEX_H - STROKE_INSET],
  [STROKE_INSET, HEX_H * 0.75],
  [STROKE_INSET, HEX_H * 0.25],
] as const;

function distance(a: readonly [number, number], b: readonly [number, number]) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}
const HEX_PERIMETER =
  distance(HEX_POINTS[0], HEX_POINTS[1]) +
  distance(HEX_POINTS[1], HEX_POINTS[2]) +
  distance(HEX_POINTS[2], HEX_POINTS[3]) +
  distance(HEX_POINTS[3], HEX_POINTS[4]) +
  distance(HEX_POINTS[4], HEX_POINTS[5]) +
  distance(HEX_POINTS[5], HEX_POINTS[0]);

const HEX_POINTS_STR = HEX_POINTS.map((p) => p.join(",")).join(" ");

export default function HoneycombGallery() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: auraEase, delay: 0.2 }}
      className="relative"
      style={{ width: CONTAINER_W, height: CONTAINER_H }}
      onMouseLeave={() => setHovered(null)}
    >
      {/* Sequential hex border-glow keyframes.
          Each tile gets a 16.8s animation cycle (7 tiles × 2.4s per turn).
          During its turn (0 → 14.286% of the cycle), the dashed segment
          chases around the hex perimeter. After the turn, opacity drops
          to 0 until the next loop. Using `animation-delay = i * 2.4s` per
          tile staggers their turns sequentially.
          Even-indexed tiles chase CLOCKWISE (offset 0 → −P).
          Odd-indexed tiles chase COUNTER-CLOCKWISE (offset 0 → +P). */}
      <style>{`
        @keyframes hex-chase-cw {
          0%      { opacity: 1; stroke-dashoffset: 0; }
          14.286% { opacity: 1; stroke-dashoffset: -${HEX_PERIMETER}; }
          14.5%, 100% { opacity: 0; }
        }
        @keyframes hex-chase-ccw {
          0%      { opacity: 1; stroke-dashoffset: 0; }
          14.286% { opacity: 1; stroke-dashoffset: ${HEX_PERIMETER}; }
          14.5%, 100% { opacity: 0; }
        }
      `}</style>

      {tiles.map((tile, i) => {
        const pos = positions[i];
        const isHovered = hovered === i;

        return (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            className="absolute cursor-pointer"
            style={{
              left: pos.x,
              top: pos.y,
              width: HEX_W,
              height: HEX_H,
              clipPath: HEX_CLIP,
              backgroundColor: "#0f0f0f",
              transform: isHovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 420ms var(--ease-aura)",
              zIndex: isHovered ? 10 : 1,
            }}
          >
            {/* IMAGE LAYER — blurs on hover. Isolated so the labels
                and the border SVG above stay sharp. */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%), url("${tile.image}")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                filter: isHovered ? "blur(6px) brightness(0.85)" : "none",
                transform: isHovered ? "scale(1.08)" : "scale(1)",
                transition:
                  "filter 320ms var(--ease-aura), transform 420ms var(--ease-aura)",
              }}
            />

            {/* Default label — bottom of tile, hidden on hover */}
            <div
              className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.7) 100%)",
                opacity: isHovered ? 0 : 1,
                transition: "opacity 260ms var(--ease-aura)",
              }}
            >
              <span className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/90">
                {tile.subtitle}
              </span>
            </div>

            {/* Rich hover overlay — bigger title + subtitle */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: auraEase }}
                  className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-3 text-center"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0.25), rgba(0,0,0,0.65))",
                  }}
                >
                  <p className="font-display text-[36px] italic leading-none text-white">
                    {tile.title}
                  </p>
                  <p className="mt-3 text-[12px] font-semibold uppercase leading-tight tracking-[0.22em] text-white/90">
                    {tile.subtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* RUNNING BORDER GLOW — ALWAYS visible, sequential per tile.
                Tile 0 chases first (CW), then tile 1 (CCW), tile 2 (CW),
                tile 3 (CCW), …  After all 7 tiles have had their turn the
                cycle restarts, infinite loop. Each tile's animation has
                the SAME 16.8s duration but a staggered delay equal to
                its index × 2.4s, so only one is glowing at a time. */}
            <svg
              className="pointer-events-none absolute inset-0"
              width={HEX_W}
              height={HEX_H}
              viewBox={`0 0 ${HEX_W} ${HEX_H}`}
              style={{ zIndex: 5 }}
            >
              <defs>
                <linearGradient
                  id={`hex-glow-${i}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="var(--color-accent-primary)" />
                  <stop offset="50%" stopColor="var(--color-accent-secondary)" />
                  <stop offset="100%" stopColor="var(--color-accent-tertiary)" />
                </linearGradient>
                <filter id={`hex-glow-blur-${i}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" />
                </filter>
              </defs>

              {/* Soft glow under-layer — wider, blurred stroke. */}
              <polygon
                points={HEX_POINTS_STR}
                fill="none"
                stroke={`url(#hex-glow-${i})`}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={`url(#hex-glow-blur-${i})`}
                style={{
                  strokeDasharray: `90 ${HEX_PERIMETER - 90}`,
                  opacity: 0,
                  animation: `${i % 2 === 0 ? "hex-chase-cw" : "hex-chase-ccw"} ${tiles.length * 2.4}s linear ${i * 2.4}s infinite`,
                }}
              />

              {/* Crisp top-layer stroke — same dash, no blur. */}
              <polygon
                points={HEX_POINTS_STR}
                fill="none"
                stroke={`url(#hex-glow-${i})`}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: `90 ${HEX_PERIMETER - 90}`,
                  opacity: 0,
                  animation: `${i % 2 === 0 ? "hex-chase-cw" : "hex-chase-ccw"} ${tiles.length * 2.4}s linear ${i * 2.4}s infinite`,
                }}
              />
            </svg>
          </div>
        );
      })}
    </motion.div>
  );
}
