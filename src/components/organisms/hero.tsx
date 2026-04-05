"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Copy, Terminal } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Safari } from "@/components/ui/safari";
import { cn } from "@/lib/utils";

const INSTALL = "npm install nexaui";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const demoOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const demoY = useTransform(scrollYProgress, [0, 0.55], [0, 56]);
  const demoBlurPx = useTransform(scrollYProgress, [0, 0.45], [0, 8]);
  const demoFilter = useTransform(demoBlurPx, (b) => `blur(${b}px)`);

  const copyInstall = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-4 pb-24 pt-28 md:pb-32 md:pt-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_70%_at_50%_-30%,rgb(99_102_241/0.18),transparent),radial-gradient(ellipse_50%_45%_at_100%_0%,rgb(244_114_182/0.1),transparent)] dark:bg-[radial-gradient(ellipse_90%_70%_at_50%_-30%,rgb(99_102_241/0.26),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-zinc-300/70 to-transparent dark:via-white/15"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-14 lg:gap-20">
        <div className="flex w-full flex-col items-center gap-8 text-center">
          <div className="mx-auto max-w-3xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-subtle">
              NexaUI · App Router kit
            </p>
            <h1
              className={cn(
                "font-arima text-balance text-4xl font-bold leading-[1.05] text-ink md:text-6xl lg:text-[4.5rem]",
              )}
            >
              Build glass-native interfaces without the noise.
            </h1>
            <p className="text-balance text-base text-ink-muted md:text-lg">
              A minimalist launchpad: Safari-framed previews, spotlight search,
              and motion that respects scroll. Cream light, zinc-deep dark.
            </p>
          </div>

          <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row sm:items-stretch">
            <div className="flex w-full min-w-0 flex-1 items-center gap-2 rounded-2xl border border-zinc-200/90 bg-white/80 px-4 py-3 font-mono text-xs text-ink shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/70 dark:text-zinc-50">
              <Terminal className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-left">{INSTALL}</span>
              <button
                type="button"
                onClick={copyInstall}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-zinc-200/90 bg-[#FFFDF7] px-2.5 py-1.5 text-[11px] font-semibold text-ink transition hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                <Copy className="h-3.5 w-3.5" aria-hidden />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <Link
              href="/docs"
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-8 py-3 text-sm font-semibold text-[#FFFDF7] shadow-xl shadow-zinc-950/25 sm:w-auto",
                "transition hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:shadow-white/15 dark:hover:bg-zinc-100",
              )}
            >
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <motion.div
          style={{
            opacity: demoOpacity,
            y: demoY,
            filter: demoFilter,
          }}
          className="relative w-full max-w-6xl px-0 sm:max-w-6xl lg:max-w-7xl xl:max-w-[90rem] will-change-[opacity,transform,filter]"
        >
          <div
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/12 via-fuchsia-500/8 to-transparent blur-3xl dark:from-indigo-400/18"
            aria-hidden
          />
          <Safari size="hero" url="https://nexaui.dev/preview/dashboard">
            <div className="relative mx-auto w-full max-w-5xl space-y-6">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-[#FFFDF7] via-[#FFFDF7]/60 to-transparent dark:from-[#09090B] dark:via-[#09090B]/60"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-44 bg-gradient-to-t from-[#FFFDF7] via-[#FFFDF7]/45 to-transparent dark:from-[#09090B] dark:via-[#09090B]/45"
                aria-hidden
              />

              <div className="relative z-10 space-y-5 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                    Live preview
                  </p>
                  <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-[11px] font-semibold text-indigo-800 dark:text-indigo-200">
                    Magic UI · Safari
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                  <div className="rounded-2xl border border-zinc-200/80 bg-white/85 p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/75">
                    <p className="text-sm font-semibold text-ink">Glass panel</p>
                    <p className="mt-2 text-xs text-ink-subtle">
                      Backdrop blur, hairline border, soft lift.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200/80 bg-white/85 p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/75">
                    <p className="text-sm font-semibold text-ink">Motion layer</p>
                    <p className="mt-2 text-xs text-ink-subtle">
                      Springs tuned for UI, not fireworks.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200/80 bg-white/85 p-5 shadow-sm sm:col-span-2 lg:col-span-1 dark:border-white/10 dark:bg-zinc-900/75">
                    <p className="text-sm font-semibold text-ink">Tokens</p>
                    <p className="mt-2 text-xs text-ink-subtle">
                      Cream / zinc-deep, one coherent system.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-dashed border-zinc-300/80 bg-white/55 p-5 dark:border-white/15 dark:bg-zinc-950/45">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-95 shadow-lg" />
                    <div className="min-w-0 flex-1 space-y-2.5">
                      <div className="h-3 w-4/5 rounded-full bg-zinc-200/95 dark:bg-zinc-700/90" />
                      <div className="h-2.5 w-3/5 rounded-full bg-zinc-200/80 dark:bg-zinc-700/75" />
                      <div className="h-2.5 w-2/3 rounded-full bg-zinc-200/70 dark:bg-zinc-700/70" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Safari>
        </motion.div>
      </div>
    </section>
  );
}
