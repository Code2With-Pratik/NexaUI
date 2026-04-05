import { AutoScrollShowcase } from "@/components/organisms/auto-scroll-showcase";
import { BentoGrid } from "@/components/organisms/bento-grid";
import { Hero } from "@/components/organisms/hero";
import { Sandbox } from "@/components/organisms/sandbox";
import { SiteFooter } from "@/components/organisms/site-footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <AutoScrollShowcase />
        <BentoGrid />
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-6">
          <div className="glass-panel flex flex-col items-center gap-6 rounded-[2rem] p-8 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-subtle">
                Continue exploring
              </p>
              <h2 className="mt-2 font-arima text-2xl font-bold text-ink md:text-3xl">
                Docs, fonts, and icon recipes.
              </h2>
              <p className="mt-2 max-w-xl text-sm text-ink-muted">
                Every destination in the nav is a real route — bookmarkable and
                ready for your content.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 md:justify-end">
              <Link
                href="/docs"
                className="rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-[#FFFDF7] dark:bg-white dark:text-zinc-950"
              >
                Open docs
              </Link>
              <Link
                href="/fonts"
                className="rounded-full border border-zinc-200/90 px-6 py-2.5 text-sm font-semibold text-ink dark:border-white/15"
              >
                Typography
              </Link>
            </div>
          </div>
        </section>
        <Sandbox />
      </main>
      <SiteFooter />
    </>
  );
}
