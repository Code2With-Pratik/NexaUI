"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    id: "1",
    title: "Glass panels",
    href: "/components",
    src: "https://picsum.photos/seed/nexa-ui-glass/640/400",
  },
  {
    id: "2",
    title: "Icon system",
    href: "/icons",
    src: "https://picsum.photos/seed/nexa-ui-icons/640/400",
  },
  {
    id: "3",
    title: "Typography",
    href: "/fonts",
    src: "https://picsum.photos/seed/nexa-ui-type/640/400",
  },
  {
    id: "4",
    title: "Documentation",
    href: "/docs",
    src: "https://picsum.photos/seed/nexa-ui-docs/640/400",
  },
  {
    id: "5",
    title: "Motion layer",
    href: "/components",
    src: "https://picsum.photos/seed/nexa-ui-motion/640/400",
  },
  {
    id: "6",
    title: "Themes",
    href: "/docs",
    src: "https://picsum.photos/seed/nexa-ui-theme/640/400",
  },
] as const;

export function AutoScrollShowcase() {
  const row = [...cards, ...cards];

  return (
    <section
      className="relative border-y border-zinc-200/80 bg-white/40 py-14 dark:border-white/10 dark:bg-zinc-950/40"
      aria-label="Component showcase"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#FFFDF7] to-transparent md:w-32 dark:from-[#09090B]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#FFFDF7] to-transparent md:w-32 dark:from-[#09090B]" />

      <div className="mx-auto mb-10 max-w-6xl px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-subtle">
          Showcase
        </p>
        <h2 className="mt-3 font-arima text-3xl font-bold text-ink md:text-4xl">
          Components in motion
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-ink-muted md:text-base">
          Rectangular cards auto-scroll — swap images for your own component
          captures or marketing art.
        </p>
      </div>

      <div className="overflow-hidden pb-2">
        <motion.div
          className="flex w-max gap-5 pr-5 md:gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 56,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {row.map((card, i) => (
            <Link
              key={`${card.id}-${i}`}
              href={card.href}
              className="group relative block w-[260px] shrink-0 overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-lg shadow-zinc-900/10 dark:border-white/10 dark:bg-zinc-900 dark:shadow-black/40 sm:w-[300px] md:w-[340px] lg:w-[380px]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={card.src}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 260px, 380px"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <p className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white drop-shadow-sm">
                  {card.title}
                </p>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
