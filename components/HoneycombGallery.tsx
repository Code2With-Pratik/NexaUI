"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auraEase } from "@/lib/motion";

type Tile = {
  title: string;
  subtitle: string;
  gradient: string;
};

/**
 * Placeholder gradients designed to read like darkish landscape photography.
 * Swap each `gradient` field for a real image URL later — the component
 * already supports any CSS background value.
 */
const tiles: Tile[] = [
  {
    title: "Flight",
    subtitle: "Aerial",
    gradient:
      "linear-gradient(135deg, #6b8ca8 0%, #2a3a52 50%, #0f1628 100%)",
  },
  {
    title: "Aurora",
    subtitle: "Night sky",
    gradient:
      "linear-gradient(135deg, #2d8a5a 0%, #0a3d28 55%, #051f14 100%)",
  },
  {
    title: "Mist",
    subtitle: "Forest",
    gradient:
      "linear-gradient(135deg, #8a8a8a 0%, #2e3532 50%, #141818 100%)",
  },
  {
    title: "Coastal",
    subtitle: "Ocean edge",
    gradient:
      "linear-gradient(135deg, #3a5a8a 0%, #1f2f4d 50%, #0a1120 100%)",
  },
  {
    title: "Urban",
    subtitle: "Street",
    gradient:
      "linear-gradient(135deg, #5a5a5a 0%, #2a2a2a 50%, #0f0f0f 100%)",
  },
  {
    title: "Portrait",
    subtitle: "Human",
    gradient:
      "linear-gradient(135deg, #8a6b4a 0%, #3d2818 55%, #1a100a 100%)",
  },
  {
    title: "Nature",
    subtitle: "Wild",
    gradient:
      "linear-gradient(135deg, #3a6b3d 0%, #1a2e18 50%, #0a1408 100%)",
  },
];

/* Pointy-top hex, W:H ≈ 0.866:1 — bigger tiles + more breathing room */
const HEX_W = 168;
const HEX_H = 194;
const GAP = 22;
const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

/**
 * Rosette of 7 hexes: 1 center + 6 neighbours. Pitch includes GAP so the
 * hexes read as separate physical tiles instead of a continuous mesh.
 */
const H_PITCH = HEX_W + GAP;               // 176
const ROW_Y = HEX_H * 0.75 + GAP;          // 154.5

const positions: Array<{ x: number; y: number }> = [
  { x: H_PITCH, y: ROW_Y },                // center
  { x: H_PITCH * 2, y: ROW_Y },            // right
  { x: H_PITCH * 1.5, y: ROW_Y * 2 },      // lower-right
  { x: H_PITCH * 0.5, y: ROW_Y * 2 },      // lower-left
  { x: 0, y: ROW_Y },                      // left
  { x: H_PITCH * 0.5, y: 0 },              // upper-left
  { x: H_PITCH * 1.5, y: 0 },              // upper-right
];

const CONTAINER_W = H_PITCH * 2 + HEX_W;   // 410
const CONTAINER_H = ROW_Y * 2 + HEX_H;     // 395

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
      {tiles.map((tile, i) => {
        const pos = positions[i];
        const isHovered = hovered === i;
        const isDimmed = hovered !== null && !isHovered;

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
              background: tile.gradient,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
              transform: isHovered ? "scale(1.06)" : "scale(1)",
              filter: isDimmed
                ? "blur(3px) brightness(0.55) saturate(0.85)"
                : "none",
              transition:
                "transform 420ms var(--ease-aura), filter 320ms var(--ease-aura)",
              zIndex: isHovered ? 10 : 1,
            }}
          >
            {/* Tiny default label (always on) — readable but quiet */}
            <div
              className="pointer-events-none absolute inset-0 flex items-end justify-center pb-3"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.55) 100%)",
                opacity: isHovered ? 0 : 1,
                transition: "opacity 260ms var(--ease-aura)",
              }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
                {tile.subtitle}
              </span>
            </div>

            {/* Rich hover overlay — short paragraph + title */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: auraEase }}
                  className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0.15), rgba(0,0,0,0.7))",
                    backdropFilter: "blur(2px)",
                    WebkitBackdropFilter: "blur(2px)",
                  }}
                >
                  <p className="font-display text-[26px] italic leading-none text-white">
                    {tile.title}
                  </p>
                  <p className="mt-2 text-[10px] font-semibold uppercase leading-tight tracking-[0.2em] text-white/85">
                    {tile.subtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
}
