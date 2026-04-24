"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auraEase } from "@/lib/motion";

/**
 * Two-row showcase marquee + click-to-maximize lightbox.
 *
 * Marquee
 *  - Row A scrolls right → left, Row B scrolls left → right (opposite).
 *  - Page scroll DOWN  → both rows play normal direction.
 *  - Page scroll UP    → both rows reverse (still opposite to each other).
 *  - Direction is mutated DIRECTLY on the DOM nodes via refs (no React
 *    re-render on scroll), so the marquee never stutters.
 *
 * Lightbox (window mockup)
 *  - Click any card → it maximises into a macOS-style window.
 *  - Closes via the RED traffic light, ESC key, or clicking the backdrop.
 *  - Bottom of the window has a frosted-blur strip with the title /
 *    description + a "Live preview" CTA.
 *  - Window is fully responsive (90 vw on mobile, capped at 880 px).
 */

type ShowcaseItem = {
  src: string;
  title: string;
  description: string;
  href: string;
};

const rowA: ShowcaseItem[] = [
  {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop",
    title: "Analytics Dashboard",
    description: "Live metrics with smooth motion and crisp typography.",
    href: "/components",
  },
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop",
    title: "Code Editor Theme",
    description: "Monochrome syntax with a single accent for emphasis.",
    href: "/components",
  },
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80&auto=format&fit=crop",
    title: "Workspace Setup",
    description: "Quiet desk, loud ideas. Hardware-grade focus.",
    href: "/components",
  },
  {
    src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80&auto=format&fit=crop",
    title: "Brand Palette",
    description: "Tokens that survive a redesign — colour, motion, depth.",
    href: "/components",
  },
  {
    src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80&auto=format&fit=crop",
    title: "Neural Network",
    description: "Visualising depth — every layer earns its weight.",
    href: "/components",
  },
  {
    src: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&q=80&auto=format&fit=crop",
    title: "Studio Light",
    description: "Soft surfaces, hard edges, considered shadows.",
    href: "/components",
  },
  {
    src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&q=80&auto=format&fit=crop",
    title: "Workflow",
    description: "From sketch to ship without leaving the keyboard.",
    href: "/components",
  },
];

const rowB: ShowcaseItem[] = [
  {
    src: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=80&auto=format&fit=crop",
    title: "Mobile Concept",
    description: "Touch-first, gesture-rich, designed at finger speed.",
    href: "/components",
  },
  {
    src: "https://images.unsplash.com/photo-1492158266870-c4eb09c3a4f1?w=1200&q=80&auto=format&fit=crop",
    title: "Type Specimen",
    description: "Instrument Serif paired with Geist for display moments.",
    href: "/fonts",
  },
  {
    src: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=1200&q=80&auto=format&fit=crop",
    title: "Lighting Study",
    description: "Where light hits, the system breathes.",
    href: "/components",
  },
  {
    src: "https://images.unsplash.com/photo-1607706189992-eae578626c86?w=1200&q=80&auto=format&fit=crop",
    title: "Macro Texture",
    description: "Grain, glass, and the calm in between.",
    href: "/components",
  },
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80&auto=format&fit=crop",
    title: "Spatial Geometry",
    description: "Tokens for architecture as much as interface.",
    href: "/components",
  },
  {
    src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&q=80&auto=format&fit=crop",
    title: "Aurora Field",
    description: "A palette mood-boarded straight from the sky.",
    href: "/icons",
  },
  {
    src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80&auto=format&fit=crop",
    title: "Editorial",
    description: "Long-form layout that respects the reader.",
    href: "/docs",
  },
];

export default function Marquee() {
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ShowcaseItem | null>(null);

  /* Page-scroll direction sets animation-direction directly on the DOM —
     no React state, no re-renders. */
  useEffect(() => {
    let lastY = window.scrollY;
    let currentDir: "normal" | "reverse" = "normal";
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        const next: "normal" | "reverse" = delta > 0 ? "normal" : "reverse";
        if (next !== currentDir) {
          currentDir = next;
          if (rowARef.current) rowARef.current.style.animationDirection = next;
          if (rowBRef.current) rowBRef.current.style.animationDirection = next;
        }
        lastY = y;
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close lightbox on ESC */
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    /* Lock body scroll while open */
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  const trackA = [...rowA, ...rowA];
  const trackB = [...rowB, ...rowB];

  return (
    <>
      <section
        id="updates"
        aria-label="Showcase"
        className="relative border-y border-border-default bg-surface/40 py-10 overflow-hidden"
      >
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-bg to-transparent" />

        <Row
          ref={rowARef}
          track={trackA}
          keyframe="aura-marquee-a"
          duration={48}
          onCardClick={setActive}
        />
        <div className="mt-5">
          <Row
            ref={rowBRef}
            track={trackB}
            keyframe="aura-marquee-b"
            duration={54}
            onCardClick={setActive}
          />
        </div>

        <style>{`
          @keyframes aura-marquee-a {
            from { transform: translate3d(0, 0, 0); }
            to   { transform: translate3d(-50%, 0, 0); }
          }
          @keyframes aura-marquee-b {
            from { transform: translate3d(-50%, 0, 0); }
            to   { transform: translate3d(0, 0, 0); }
          }
        `}</style>
      </section>

      <Lightbox item={active} onClose={() => setActive(null)} />
    </>
  );
}

/* ────── Row primitive ────── */

const Row = ({
  ref,
  track,
  keyframe,
  duration,
  onCardClick,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  track: ShowcaseItem[];
  keyframe: string;
  duration: number;
  onCardClick: (item: ShowcaseItem) => void;
}) => (
  <div className="flex">
    <div
      ref={ref}
      className="flex shrink-0 items-center gap-4 pr-4"
      style={{
        animationName: keyframe,
        animationDuration: `${duration}s`,
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        animationDirection: "normal",
        animationFillMode: "both",
        willChange: "transform",
      }}
    >
      {track.map((item, i) => (
        <ShowcaseCard
          key={`${item.src}-${i}`}
          item={item}
          onClick={() => onCardClick(item)}
        />
      ))}
    </div>
  </div>
);

function ShowcaseCard({
  item,
  onClick,
}: {
  item: ShowcaseItem;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative shrink-0 overflow-hidden border border-border-default transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
      style={{
        width: 280,
        height: 170,
        borderRadius: 18,
        backgroundColor: "var(--color-surface)",
      }}
      aria-label={`Open ${item.title}`}
    >
      <img
        src={item.src}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        draggable={false}
      />

      {/* Default subtle vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      {/* Hover overlay — darker tint + centred fullscreen icon button.
          The icon uses the existing aura-glass style so it matches the
          rest of the UI's glass language. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)",
        }}
      >
        <span
          className="flex items-center justify-center rounded-full text-fg shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          style={{
            width: 48,
            height: 48,
            backgroundColor: "rgba(255,255,255,0.16)",
            border: "1px solid rgba(255,255,255,0.32)",
          }}
        >
          <FullscreenIcon />
        </span>
      </div>
    </button>
  );
}

function FullscreenIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white"
      aria-hidden
    >
      <path d="M3 8V3h5" />
      <path d="M17 8V3h-5" />
      <path d="M3 12v5h5" />
      <path d="M17 12v5h-5" />
    </svg>
  );
}

/* ────── Lightbox (macOS-style window mockup) ────── */

function Lightbox({
  item,
  onClose,
}: {
  item: ShowcaseItem | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: auraEase }}
          className="fixed inset-0 z-[120] flex items-center justify-center px-4 sm:px-8"
          aria-modal
          role="dialog"
          aria-label={item.title}
        >
          {/* Backdrop — frosted-white glass blur, clicking closes */}
          <div
            className="absolute inset-0"
            onClick={onClose}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(28px) saturate(160%)",
              WebkitBackdropFilter: "blur(28px) saturate(160%)",
            }}
          />

          {/* Window */}
          <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 16, opacity: 0 }}
            transition={{ duration: 0.32, ease: auraEase }}
            className="relative z-10 w-full overflow-hidden rounded-2xl shadow-[0_60px_140px_-30px_rgba(0,0,0,0.7)]"
            style={{
              maxWidth: "min(880px, 95vw)",
              backgroundColor: "var(--color-surface)",
              /* Mockup-style white-gray border, 2px wide */
              border: "2px solid rgba(220, 220, 225, 0.35)",
              boxShadow:
                "0 0 0 1px rgba(180, 180, 180, 0.22), 0 60px 140px -30px rgba(0, 0, 0, 0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar with traffic lights — bigger, more tactile */}
            <div className="flex items-center gap-2.5 border-b border-white/10 bg-black/40 px-4 py-3 backdrop-blur sm:px-5 sm:py-3.5">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="relative h-[18px] w-[18px] rounded-full transition-transform duration-150 hover:scale-110"
                style={{
                  backgroundColor: "#ff5f57",
                  boxShadow:
                    "0 0 0 0.5px rgba(0,0,0,0.5) inset, 0 0 10px -2px #ff5f57",
                }}
              />
              {/* Yellow + green are decorative — disabled */}
              <span
                aria-hidden
                className="h-[18px] w-[18px] rounded-full opacity-90"
                style={{
                  backgroundColor: "#febc2e",
                  boxShadow:
                    "0 0 0 0.5px rgba(0,0,0,0.5) inset, 0 0 10px -2px #febc2e",
                }}
              />
              <span
                aria-hidden
                className="h-[18px] w-[18px] rounded-full opacity-90"
                style={{
                  backgroundColor: "#28c840",
                  boxShadow:
                    "0 0 0 0.5px rgba(0,0,0,0.5) inset, 0 0 10px -2px #28c840",
                }}
              />
              <span className="ml-3 truncate text-[11px] text-white/55 font-mono">
                {item.title.toLowerCase().replace(/\s+/g, "-")}.aura
              </span>
              <span className="ml-auto hidden text-[10px] uppercase tracking-[0.2em] text-white/35 sm:inline">
                ESC to close
              </span>
            </div>

            {/* Image area */}
            <div className="relative aspect-[16/10] w-full bg-black/30">
              <img
                src={item.src}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />

              {/* Bottom frosted-blur info strip */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 sm:p-5">
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 -z-10 h-full"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.55) 60%, rgba(10,10,12,0) 100%)",
                    backdropFilter: "blur(12px) saturate(140%)",
                    WebkitBackdropFilter: "blur(12px) saturate(140%)",
                    maskImage:
                      "linear-gradient(to top, #000 0%, #000 40%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to top, #000 0%, #000 40%, transparent 100%)",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-white sm:text-lg">
                    {item.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-white/70 sm:text-[13px]">
                    {item.description}
                  </p>
                </div>
                <a
                  href={item.href}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-black transition-transform hover:scale-[1.03] sm:px-4 sm:py-2 sm:text-[13px]"
                  style={{
                    backgroundColor: "var(--color-accent-primary)",
                    boxShadow:
                      "0 8px 24px -8px color-mix(in srgb, var(--color-accent-primary) 55%, transparent)",
                  }}
                >
                  Live preview
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
