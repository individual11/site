import type { Viewport } from "next";
import Link from "next/link";
import { PALETTE, PALETTE_CSS } from "@/lib/palette";
import { workDisplay, workMono } from "./fonts";
import "./work.css";

// The portfolio is dark (Eleven concept, Signal palette). Colours come from
// lib/palette.ts so the CSS and the particle canvas always match.
export const viewport: Viewport = {
  themeColor: PALETTE.bg,
};

export default function WorkLayout({ children }: LayoutProps<"/work">) {
  return (
    <div className={`work ${workDisplay.variable} ${workMono.variable}`} style={PALETTE_CSS}>
      <header className="w-bar">
        <Link href="/" className="w-brand">
          <b>individual11</b>
        </Link>
        <nav className="w-nav" aria-label="Portfolio">
          <Link href="/work">Work</Link>
          <Link href="/work#contact">Contact</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
