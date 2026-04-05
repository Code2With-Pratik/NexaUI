"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

function burst() {
  const count = 140;
  const defaults = { origin: { y: 0.72 }, zIndex: 9999 };

  function fire(particleRatio: number, opts: confetti.Options) {
    void confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.85 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

export function Sandbox() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-32">
      <div className="glass-panel relative overflow-hidden rounded-[2rem] px-6 py-12 text-center md:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-400/15"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl dark:bg-fuchsia-400/10"
        />

        <div className="relative mx-auto max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/50 px-3 py-1 text-xs font-medium text-ink-muted dark:border-white/10 dark:bg-zinc-950/50">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden />
            Magic UI moment
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            Interactive sandbox
          </h2>
          <p className="text-ink-muted">
            Trigger confetti and a continuous shine pass — a tactile reward for
            explorers who click everything twice.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <motion.button
              type="button"
              className={cn(
                "shine-cta relative inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold",
                "bg-zinc-900 text-[#FFFDF7] shadow-lg dark:bg-white dark:text-zinc-900",
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => burst()}
            >
              <span className="relative z-10">Remix now</span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
