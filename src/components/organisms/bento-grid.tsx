"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Box, Layers, Palette, Type } from "lucide-react";
import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 28 },
  },
};

export function BentoGrid() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      id="components"
      className="mx-auto max-w-6xl px-4 pb-24"
      aria-labelledby="bento-heading"
    >
      <div className="mb-10 text-center">
        <h2
          id="bento-heading"
          className="font-arima text-2xl font-bold tracking-tight text-ink md:text-3xl"
        >
          Bento showcase
        </h2>
        <p className="mt-2 text-ink-muted">
          Asymmetric layout, scroll parallax, and small interactive labs.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-[auto_auto]"
      >
        <ParallaxBentoCard
          scrollYProgress={scrollYProgress}
          index={0}
          className="glass-panel md:col-span-7 md:row-span-2 rounded-3xl p-6"
          variants={item}
        >
          <BentoMorphIcons />
        </ParallaxBentoCard>

        <ParallaxBentoCard
          scrollYProgress={scrollYProgress}
          index={1}
          className="glass-panel md:col-span-5 rounded-3xl p-6"
          variants={item}
        >
          <BentoThemeHarmonizer />
        </ParallaxBentoCard>

        <ParallaxBentoCard
          scrollYProgress={scrollYProgress}
          index={2}
          className="glass-panel md:col-span-5 rounded-3xl p-6"
          variants={item}
        >
          <BentoFluidTypography />
        </ParallaxBentoCard>

        <ParallaxBentoCard
          scrollYProgress={scrollYProgress}
          index={3}
          className="glass-panel md:col-span-12 rounded-3xl p-6 md:col-span-12"
          variants={item}
        >
          <BentoSkeletonFirst />
        </ParallaxBentoCard>
      </motion.div>
    </section>
  );
}

function ParallaxBentoCard({
  children,
  className,
  variants,
  scrollYProgress,
  index,
}: {
  children: ReactNode;
  className?: string;
  variants: typeof item;
  scrollYProgress: MotionValue<number>;
  index: number;
}) {
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [28 + index * 10, -22 - index * 12],
  );

  return (
    <motion.article variants={variants} style={{ y }} className={className}>
      {children}
    </motion.article>
  );
}

function BentoMorphIcons() {
  const [hover, setHover] = useState(false);
  const id = useId();

  return (
    <div className="flex h-full min-h-[240px] flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
          <Layers className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-ink">
            Context-aware icons
          </h3>
          <p className="text-sm text-ink-muted">
            SVG paths interpolate on interaction — state follows intent.
          </p>
        </div>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/40 dark:border-white/10 dark:bg-zinc-950/40"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <svg
          viewBox="0 0 120 120"
          className="h-40 w-40 text-indigo-600 dark:text-indigo-300"
          aria-labelledby={`${id}-title`}
          role="img"
        >
          <title id={`${id}-title`}>Morphing icon demo</title>
          <motion.path
            fill="currentColor"
            d="M60 28 C78 28 92 42 92 60 C92 78 78 92 60 92 C42 92 28 78 28 60 C28 42 42 28 60 28 Z"
            initial={false}
            animate={{ opacity: hover ? 0 : 1 }}
            transition={{ duration: 0.22 }}
          />
          <motion.path
            fill="currentColor"
            d="M60 18 L98 96 L22 96 Z"
            initial={false}
            animate={{ opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.22 }}
          />
        </svg>
        <p className="pointer-events-none absolute bottom-3 text-xs text-ink-subtle">
          Hover to morph
        </p>
      </div>
    </div>
  );
}

function BentoThemeHarmonizer() {
  const [primary, setPrimary] = useState("#6366f1");
  const [accent, setAccent] = useState("#f472b6");
  const [surface, setSurface] = useState("#fffdf7");

  return (
    <div className="flex h-full min-h-[200px] flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300">
          <Palette className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-ink">
            Theme harmonizer
          </h3>
          <p className="text-sm text-ink-muted">
            Tune a triad and preview harmony on a live glass tile.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
          Primary
          <input
            type="color"
            value={primary}
            onChange={(e) => setPrimary(e.target.value)}
            className="h-10 w-full min-w-[5rem] cursor-pointer rounded-lg border border-zinc-200 bg-transparent dark:border-white/10"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
          Accent
          <input
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="h-10 w-full min-w-[5rem] cursor-pointer rounded-lg border border-zinc-200 bg-transparent dark:border-white/10"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-ink-muted">
          Surface
          <input
            type="color"
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
            className="h-10 w-full min-w-[5rem] cursor-pointer rounded-lg border border-zinc-200 bg-transparent dark:border-white/10"
          />
        </label>
      </div>

      <div
        className="mt-auto rounded-2xl border p-4 shadow-inner"
        style={{
          backgroundColor: surface,
          borderColor: primary,
          boxShadow: `0 18px 50px ${primary}33`,
        }}
      >
        <div
          className="rounded-xl px-3 py-2 text-sm font-medium"
          style={{ backgroundColor: `${primary}22`, color: primary }}
        >
          Harmonized chip
        </div>
        <div
          className="mt-3 h-2 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${primary}, ${accent})`,
          }}
        />
      </div>
    </div>
  );
}

function BentoFluidTypography() {
  const [size, setSize] = useState(28);

  return (
    <div className="flex h-full min-h-[200px] flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
          <Type className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-ink">
            Fluid typography
          </h3>
          <p className="text-sm text-ink-muted">
            Scale Arima in real time — feel the voice change.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center justify-between gap-3 text-xs font-medium text-ink-muted">
          Optical size
          <span className="tabular-nums text-ink">
            {size}px
          </span>
        </label>
        <input
          type="range"
          min={14}
          max={56}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="h-2 w-full accent-indigo-500"
        />
      </div>

      <p
        className="font-arima mt-auto rounded-2xl border border-zinc-200/80 bg-white/50 px-4 py-3 text-ink dark:border-white/10 dark:bg-zinc-950/50"
        style={{ fontSize: size, lineHeight: 1.15 }}
      >
        Arima scales with purpose.
      </p>
    </div>
  );
}

function BentoSkeletonFirst() {
  const [skeleton, setSkeleton] = useState(false);

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="flex max-w-xl items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-500/15 text-zinc-700 dark:text-zinc-300">
          <Box className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-ink">
            Skeleton-first
          </h3>
          <p className="text-sm text-ink-muted">
            Flip the interface into skeleton loaders to validate layout rhythm
            before the data arrives.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-stretch gap-4 md:max-w-md">
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/40 px-4 py-3 dark:border-white/10 dark:bg-zinc-950/40">
          <span className="text-sm font-medium text-ink">
            Skeleton mode
          </span>
          <input
            type="checkbox"
            checked={skeleton}
            onChange={(e) => setSkeleton(e.target.checked)}
            className="h-5 w-9 cursor-pointer accent-indigo-600"
          />
        </label>

        <div
          className={cn(
            "glass-panel overflow-hidden rounded-2xl p-4",
            skeleton && "animate-pulse",
          )}
        >
          {skeleton ? (
            <div className="space-y-3">
              <div className="h-4 w-2/3 rounded-md bg-zinc-200/90 dark:bg-zinc-700/90" />
              <div className="h-3 w-full rounded-md bg-zinc-200/80 dark:bg-zinc-700/80" />
              <div className="h-3 w-5/6 rounded-md bg-zinc-200/80 dark:bg-zinc-700/80" />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="aspect-square rounded-xl bg-zinc-200/90 dark:bg-zinc-700/90" />
                <div className="aspect-square rounded-xl bg-zinc-200/80 dark:bg-zinc-700/80" />
                <div className="aspect-square rounded-xl bg-zinc-200/80 dark:bg-zinc-700/80" />
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-ink-muted">
              <p className="font-medium">Content-ready panel</p>
              <p className="text-ink-muted">
                Typography, spacing, and affordances stay stable while payloads
                stream in.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
