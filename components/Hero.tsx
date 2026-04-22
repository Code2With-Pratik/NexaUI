"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fadeUp, stagger } from "@/lib/motion";
import HoneycombGallery from "./HoneycombGallery";
import CodeCards from "./CodeCards";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsScrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsScrollerRef.current) return;
    const el = cardsScrollerRef.current;

    const ctx = gsap.context(() => {
      /* All transforms are GSAP-managed so the scroll-driven `y` doesn't
         clobber the static scale/xPercent we need to centre the 740-wide
         CodeCards canvas inside the 480-wide wrapper. */
      gsap.set(el, {
        xPercent: -50,
        scale: 0.62,
        transformOrigin: "top center",
        y: 0,
      });

      gsap.to(el, {
        y: -1300,            // shifts the inner content up so cards 2 → 4 scroll into view
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1800",     // length of the scroll-linked phase
          scrub: true,        // reversible: scroll back, the cards slide back down
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden pt-32 pb-24 md:pt-40 md:pb-36"
    >
      <div className="hero-glow" />

      {/* Top-left decoration — Honeycomb showcase */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-40px] top-20 z-10 hidden lg:block"
      >
        <div className="pointer-events-auto">
          <HoneycombGallery />
        </div>
      </div>

      {/* Top-right decoration — CodeCards with scroll-linked vertical translate
          and the snake-stroke dashoffset animation already baked in. */}
      <div className="pointer-events-none absolute right-0 top-12 z-10 hidden lg:block">
        <div
          className="pointer-events-auto relative overflow-hidden"
          style={{
            width: 480,
            height: 640,
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 8%, #000 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 8%, #000 80%, transparent 100%)",
          }}
        >
          <div
            ref={cardsScrollerRef}
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: 740,
            }}
          >
            <CodeCards className="font-sans" />
          </div>
        </div>
      </div>

      {/* Hero copy — always centered, sits in the middle on top of decorations */}
      <motion.div
        variants={stagger(0.15, 0.12)}
        initial="hidden"
        animate="visible"
        className="relative z-20 mx-auto flex w-full max-w-[760px] flex-col items-center px-6 text-center"
      >
        <motion.div variants={fadeUp}>
          <HeroBadge>All systems operational · v0.1</HeroBadge>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="display-clamp mt-7 text-balance text-fg"
        >
          Interfaces with{" "}
          <span className="not-italic font-sans font-extralight tracking-tight text-accent-primary">
            aura.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-[520px] text-pretty text-base leading-relaxed text-fg/70 md:text-lg"
        >
          A macOS-inspired component system for teams who care about depth,
          motion, and the quiet details. Built for Next.js and Tailwind v4.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="#components"
            className="group inline-flex items-center gap-2 rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.02]"
            style={{
              boxShadow:
                "0 18px 50px -15px color-mix(in srgb, var(--color-accent-primary) 55%, transparent)",
            }}
          >
            Explore the system
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3.5 7h7m0 0L7.5 4m3 3L7.5 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="#docs"
            className="aura-border inline-flex items-center gap-2 rounded-full bg-fg/2 px-5 py-2.5 text-sm font-medium text-fg/85 transition-colors hover:bg-fg/5 hover:text-fg"
          >
            <span className="font-mono text-xs text-fg/50">⌘</span> Read the docs
          </a>
        </motion.div>
      </motion.div>

      {/* Mobile fallback — honeycomb shown once, centered, below hero copy */}
      <div className="relative z-10 mx-auto mt-12 flex w-full justify-center px-6 lg:hidden">
        <HoneycombGallery />
      </div>
    </section>
  );
}

function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="aura-glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-fg/85">
      <span className="relative inline-flex h-2 w-2">
        <span
          className="absolute inset-0 rounded-full bg-accent-primary opacity-60 blur-[2px]"
          style={{ animation: "var(--animate-blink)" }}
        />
        <span className="relative h-2 w-2 rounded-full bg-accent-primary" />
      </span>
      {children}
    </span>
  );
}
