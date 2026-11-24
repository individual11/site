"use client";

import { useEffect, useRef, useState } from "react";
import type { WorkLoop } from "@/lib/work-media";

/** Muted looping clip with a pause button. Starts paused under reduced motion. */
export default function LoopVideo({ loop }: { loop: WorkLoop }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const toggle = () => {
    const v = ref.current!;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else { v.pause(); setPlaying(false); }
  };

  return (
    <figure className="w-loop">
      <video
        ref={ref}
        src={loop.src}
        poster={loop.poster}
        width={loop.width}
        height={loop.height}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={loop.alt}
      />
      <button type="button" className="w-loop-btn" onClick={toggle}>
        {playing ? "Pause" : "Play"}
      </button>
    </figure>
  );
}
