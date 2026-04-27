"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Play", href: "/#play" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/priyamwadapandey", external: true },
  { label: "Resume", href: "https://www.dropbox.com/scl/fi/q25sm46awt2hyr5dxbipp/Pri_Resume.pdf?rlkey=n42okjjek5vmanorbudpp0wrm&st=65336wi9&dl=0", external: true },
];

const hind = { fontFamily: "var(--font-hind), sans-serif" } as const;

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // dark = true when the play section is behind the nav
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // PlaySection dispatches this event when its top edge crosses the nav
  useEffect(() => {
    const onTheme = (e: Event) => {
      setDark((e as CustomEvent<string>).detail === "dark");
    };
    window.addEventListener("nav-theme", onTheme);
    return () => window.removeEventListener("nav-theme", onTheme);
  }, []);

  // ── Derived styles ─────────────────────────────────────────────────────────

  const frosted = scrolled || menuOpen;
  const aboutMode = pathname === "/about";

  const navBg = aboutMode
    ? "transparent"
    : dark
    ? frosted
      ? "rgba(17,17,17,0.88)"
      : "#111111"
    : frosted
      ? "color-mix(in srgb, var(--color-page-bg) 65%, transparent)"
      : "var(--color-page-bg)";

  const navShadow = aboutMode
    ? "none"
    : dark
    ? frosted ? "0 1px 0 rgba(255,255,255,0.08)" : "none"
    : frosted ? "0 1px 0 #e8e8e8" : "none";

  const textColor = dark ? "rgba(255,255,255,0.75)" : "#333333";
  const barColor  = dark ? "rgba(255,255,255,0.75)" : "#333333";
  const dropdownBorder = dark ? "rgba(255,255,255,0.1)" : "#e8e8e8";

  const linkStyle = { ...hind, color: textColor };

  const onPlayClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (pathname !== "/") {
      window.location.href = "/#play";
      return;
    }

    const playSection = document.getElementById("play");
    if (playSection) {
      playSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMenuOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: navBg,
        backdropFilter: aboutMode ? "none" : frosted || dark ? "blur(16px)" : "none",
        WebkitBackdropFilter: aboutMode ? "none" : frosted || dark ? "blur(16px)" : "none",
        boxShadow: navShadow,
        transition: [
          "box-shadow 300ms cubic-bezier(0.23, 1, 0.32, 1)",
          "background-color 300ms cubic-bezier(0.23, 1, 0.32, 1)",
        ].join(", "),
      }}
    >
      {/* Top bar */}
      <div className="w-[86%] max-w-[1238px] mx-auto flex items-center justify-between py-8">

        {/* Logo + name */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dark ? "/Darkbg logo.png" : "/logos/nav-logo.svg"}
            alt="Priyamwada Pandey"
            className="size-6 shrink-0 object-contain"
            style={{ transition: "opacity 300ms cubic-bezier(0.23, 1, 0.32, 1)" }}
          />
          <span
            className="text-[14px] uppercase tracking-wide leading-none"
            style={{ ...hind, lineHeight: 0.5, transform: "translateY(1.5px)", color: textColor, transition: "color 300ms cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            Priyamwada Pandey
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target={link.href !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-[14px] uppercase hover:opacity-60 transition-opacity"
                style={{ ...linkStyle, transition: "opacity 200ms, color 300ms cubic-bezier(0.23, 1, 0.32, 1)" }}
              >
                {link.label}
              </a>
            ) : link.href === "/#play" ? (
              <a
                key={link.label}
                href={link.href}
                onClick={onPlayClick}
                className="text-[14px] uppercase hover:opacity-60 transition-opacity"
                style={{ ...linkStyle, transition: "opacity 200ms, color 300ms cubic-bezier(0.23, 1, 0.32, 1)" }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] uppercase hover:opacity-60 transition-opacity"
                style={{ ...linkStyle, transition: "opacity 200ms, color 300ms cubic-bezier(0.23, 1, 0.32, 1)" }}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Hamburger, mobile only */}
        <button
          className="md:hidden flex flex-col items-center justify-center w-8 h-8 gap-[5px]"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span
            className="block w-5 h-[1.5px] rounded-full"
            style={{
              backgroundColor: barColor,
              transition: "transform 350ms cubic-bezier(0.23, 1, 0.32, 1), background-color 300ms cubic-bezier(0.23, 1, 0.32, 1)",
              transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-5 h-[1.5px] rounded-full"
            style={{
              backgroundColor: barColor,
              transition: "transform 350ms cubic-bezier(0.23, 1, 0.32, 1), opacity 250ms cubic-bezier(0.23, 1, 0.32, 1), background-color 300ms cubic-bezier(0.23, 1, 0.32, 1)",
              transform: menuOpen ? "scaleX(0)" : "none",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-[1.5px] rounded-full"
            style={{
              backgroundColor: barColor,
              transition: "transform 350ms cubic-bezier(0.23, 1, 0.32, 1), background-color 300ms cubic-bezier(0.23, 1, 0.32, 1)",
              transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden w-[86%] max-w-[1238px] mx-auto pb-6 flex flex-col gap-5"
          style={{ borderTop: `1px solid ${dropdownBorder}` }}
        >
          <div className="pt-5 flex flex-col gap-5">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-[14px] uppercase hover:opacity-60 transition-opacity"
                  style={linkStyle}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : link.href === "/#play" ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[14px] uppercase hover:opacity-60 transition-opacity"
                  style={linkStyle}
                  onClick={onPlayClick}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[14px] uppercase hover:opacity-60 transition-opacity"
                  style={linkStyle}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
