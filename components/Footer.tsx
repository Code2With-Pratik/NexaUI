import Link from "next/link";
import LogoMark from "./LogoMark";

type Col = { title: string; links: { label: string; href: string; external?: boolean }[] };

const columns: Col[] = [
  {
    title: "Pages",
    links: [
      { label: "All Products", href: "/components" },
      { label: "Studio", href: "/" },
      { label: "Clients", href: "/" },
      { label: "Pricing", href: "/" },
      { label: "Blog", href: "/" },
    ],
  },
  {
    title: "Socials",
    links: [
      { label: "Facebook", href: "https://facebook.com", external: true },
      { label: "Instagram", href: "https://instagram.com", external: true },
      { label: "Twitter", href: "https://twitter.com", external: true },
      { label: "LinkedIn", href: "https://linkedin.com", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Cookie Policy", href: "/" },
    ],
  },
  {
    title: "Register",
    links: [
      { label: "Sign Up", href: "/" },
      { label: "Login", href: "/" },
      { label: "Forgot Password", href: "/" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-[var(--color-border-default)] bg-[var(--color-bg)] pt-16">
      <div className="relative mx-auto w-full max-w-[1240px] px-6">
        <div className="flex flex-col gap-14 md:flex-row md:items-start md:justify-between md:gap-20">
          {/* Brand + copyright */}
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center overflow-hidden rounded-lg">
                <img
                  src="/Logo.gif"
                  alt="Aura UI Logo"
                  className="size-full object-cover mix-blend-multiply dark:invert dark:mix-blend-screen"
                />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-fg">
                Aura UI
              </span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-fg/45">
              © copyright Aura UI {year}. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-14 gap-y-10 md:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="mb-5 text-[14px] font-semibold text-fg">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.external ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[13.5px] text-fg/60 transition-colors hover:text-fg"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          href={l.href}
                          className="text-[13.5px] text-fg/60 transition-colors hover:text-fg"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Oversized ghosted wordmark — gradient fill, light rising from the bottom */}
        <div className="pointer-events-none mt-12 select-none">
          <p
            aria-hidden
            className="bg-clip-text text-center font-sans font-bold leading-[0.9] tracking-[-0.04em] text-transparent"
            style={{
              fontSize: "clamp(5rem, 22vw, 20rem)",
              backgroundImage:
                "linear-gradient(to top, var(--color-accent-primary) 0%, color-mix(in srgb, var(--color-accent-primary) 95%, transparent) 20%, color-mix(in srgb, var(--color-accent-primary) 55%, transparent) 55%, color-mix(in srgb, var(--color-accent-primary) 0%, transparent) 100%)",
            }}
          >
            Aura UI
          </p>
        </div>
      </div>
    </footer>
  );
}
