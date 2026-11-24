"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type Shot = { src: StaticImageData; caption: string; alt: string };

// Where the strip rests for each screen: centred, or pinned at either end.
function restingPoints(strip: HTMLElement) {
  const max = strip.scrollWidth - strip.clientWidth;
  return Array.from(strip.children, (el) => {
    const fig = el as HTMLElement;
    const left = fig.offsetLeft - strip.offsetLeft + fig.offsetWidth / 2 - strip.clientWidth / 2;
    return Math.min(Math.max(left, 0), max);
  });
}

/** On phones the screens scroll sideways, with a labelled control underneath; wider, all four sit in a row. */
export function Shots({ shots }: { shots: Shot[] }) {
  const strip = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const distances = restingPoints(el).map((p) => Math.abs(p - el.scrollLeft));
      setActive(distances.indexOf(Math.min(...distances)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const show = (i: number) => {
    const el = strip.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: restingPoints(el)[i], behavior: still ? "auto" : "smooth" });
  };

  return (
    <>
      <div className="cc-split">
        <div className="cc-shots" ref={strip}>
          {shots.map((s) => (
            <figure key={s.caption}>
              <Image src={s.src} alt={s.alt} sizes="(min-width: 720px) 240px, 62vw" />
              <figcaption>{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="cc-wrap cc-picker">
        <div className="cc-seg" role="group" aria-label="App screens">
          {shots.map((s, i) => (
            <button key={s.caption} type="button" aria-current={i === active} onClick={() => show(i)}>
              {s.caption}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
