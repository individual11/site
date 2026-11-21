"use client";

import { useEffect, useState } from "react";

export type Stop = { id: string; label: string };

/**
 * A small fixed button that names the next stop and scrolls to it.
 * "Current" is whichever stop's centre is nearest the middle of the screen.
 * Hidden on the last stop.
 */
export default function NextSection({ stops }: { stops: Stop[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = innerHeight / 2;
      let best = 0, bestD = Infinity;
      stops.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        // A tall section counts as current while it covers the middle of the screen.
        const d = r.top <= mid && r.bottom >= mid ? 0 : Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      setCurrent(best);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [stops]);

  const next = stops[current + 1];

  const go = () => {
    if (!next) return;
    const el = document.getElementById(next.id);
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Centre matches the snap point and where the particle formation is complete.
    // The "More work" grid is the exception: start at its heading.
    const block = el.classList.contains("w-more") ? "start" : "center";
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block });
  };

  return (
    <button
      type="button"
      className="w-next"
      onClick={go}
      data-hidden={!next}
      aria-hidden={!next}
      tabIndex={next ? 0 : -1}
      aria-label={next ? `Scroll to ${next.label}` : undefined}
    >
      <span>
        Next: <b>{next?.label ?? ""}</b>
      </span>
      <i aria-hidden="true">↓</i>
    </button>
  );
}
