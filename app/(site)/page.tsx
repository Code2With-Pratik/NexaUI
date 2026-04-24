import Hero from "@/components/Hero";
import WindowMockup from "@/components/WindowMockup";
import BentoGrid from "@/components/BentoGrid";
import Marquee from "@/components/Marquee";
import SnakeRail from "@/components/SnakeRail";

export default function Page() {
  return (
    <main className="relative">
      {/* SnakeRail spans Hero + WindowMockup as a sticky right-side overlay,
          so the four cards (CodePen / HTML / CSS / JS) and the snake-stroke
          flow continuously across both sections as the user scrolls. */}
      <div className="relative">
        <SnakeRail />
        <Hero />

        <section className="relative z-20 mx-auto -mt-2 w-full max-w-[1060px] px-6 pb-24 md:-mt-4 md:pb-36">
          <WindowMockup />
        </section>
      </div>

      <Marquee />

      <section
        id="components"
        className="relative mx-auto w-full max-w-[1240px] px-6 py-24 md:py-36"
      >
        <header className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">The system</p>
            <h2 className="display-clamp text-balance">
              Composable{" "}
              <span className="not-italic font-sans font-light text-[var(--color-accent-primary)]">
                primitives
              </span>
            </h2>
          </div>
          <p className="hidden max-w-sm text-sm text-fg/55 md:block">
            Every surface is built from the same set of tokens — borders, glass, glow, and grain. Drop them anywhere.
          </p>
        </header>
        <BentoGrid />
      </section>
    </main>
  );
}
