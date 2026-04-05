"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SafariProps = {
  url?: string;
  children?: ReactNode;
  className?: string;
  /** Larger chrome + viewport for hero / demos */
  size?: "default" | "hero";
};

export function Safari({
  url = "https://nexaui.dev/preview",
  children,
  className,
  size = "default",
}: SafariProps) {
  const isHero = size === "hero";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.35rem] border border-zinc-200/90 bg-zinc-100 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.35)]",
        "dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-[0_50px_140px_-50px_rgb(0_0_0/0.65)]",
        isHero && "rounded-[1.75rem] shadow-[0_50px_140px_-45px_rgb(0_0_0/0.45)] dark:shadow-[0_60px_160px_-55px_rgb(0_0_0/0.75)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b border-zinc-200/80 bg-white/90 dark:border-white/10 dark:bg-zinc-950/80",
          isHero ? "px-5 py-3.5" : "px-4 py-3",
        )}
      >
        <div className="flex gap-1.5" aria-hidden>
          <span
            className={cn("rounded-full bg-[#FF5F57]", isHero ? "h-3.5 w-3.5" : "h-3 w-3")}
          />
          <span
            className={cn("rounded-full bg-[#FEBC2E]", isHero ? "h-3.5 w-3.5" : "h-3 w-3")}
          />
          <span
            className={cn("rounded-full bg-[#28C840]", isHero ? "h-3.5 w-3.5" : "h-3 w-3")}
          />
        </div>
        <div className="mx-auto flex min-w-0 flex-1 items-center justify-center px-4">
          <div
            className={cn(
              "flex w-full items-center gap-2 rounded-lg border border-zinc-200/90 bg-zinc-50/90 shadow-inner dark:border-white/10 dark:bg-zinc-900/80 dark:text-zinc-400",
              isHero ? "max-w-2xl px-4 py-2 text-xs" : "max-w-md px-3 py-1.5 text-[11px] text-zinc-500",
            )}
          >
            <span className="truncate tabular-nums text-zinc-600 dark:text-zinc-400">
              {url}
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "relative bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900",
          isHero
            ? "min-h-[320px] sm:min-h-[420px] lg:min-h-[520px] xl:min-h-[580px]"
            : "min-h-[220px] sm:min-h-[280px]",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-[#FFFDF7] via-[#FFFDF7]/40 to-transparent dark:from-[#09090B] dark:via-[#09090B]/40",
            isHero ? "h-32" : "h-24",
          )}
          aria-hidden
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#FFFDF7] via-[#FFFDF7]/30 to-transparent dark:from-[#09090B] dark:via-[#09090B]/30",
            isHero ? "h-40" : "h-32",
          )}
          aria-hidden
        />
        <div
          className={cn("relative z-0", isHero ? "p-6 sm:p-8 lg:p-10" : "p-4 sm:p-6")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
