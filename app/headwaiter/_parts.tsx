import type { StaticImageData } from "next/image";
import { WING } from "./_tie";

/** Desktop wallpaper: the bow tie's wings at three sizes, centered where the popover sits as the knot. */
export function Wallpaper() {
  return (
    <svg className="hw-paper" viewBox="0 0 1440 900" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <g className="hw-tie">
        {[150, 108, 68].map((scale, i) => (
          <g key={scale} className={`hw-w${i + 1}`}>
            <path transform={`scale(${scale}) translate(-8.15 -5)`} d={WING} />
            <path transform={`scale(${-scale} ${scale}) translate(-8.15 -5)`} d={WING} />
          </g>
        ))}
        <path
          className="hw-fold"
          d="M-60 -96Q-480 -320 -880 -390M-60 96Q-480 320 -880 390M60 -96Q480 -320 880 -390M60 96Q480 320 880 390"
        />
      </g>
    </svg>
  );
}

export function Folder({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 104 84" aria-hidden="true">
      <path
        fill="var(--folder-back)"
        d="M4 14a8 8 0 0 1 8-8h24c3 0 5 1 7 3l4 4c2 2 4 3 7 3h38a8 8 0 0 1 8 8v46a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8Z"
      />
      <path fill="var(--folder)" d="M4 32a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v38a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8Z" />
    </svg>
  );
}

/** A keyboard shortcut. Screen readers get words, since they read symbols like ⌫ inconsistently. */
export function Keys({ symbols, say }: { symbols: string; say: string }) {
  return (
    <span className="hw-nw">
      <span aria-hidden="true">{symbols}</span>
      <span className="hw-say">{say}</span>
    </span>
  );
}

/** Title bar of an inactive window: the popover has focus, so the window controls are gray. */
export function TitleBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="hw-tbar">
      <span className="hw-lights" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {children}
    </div>
  );
}

/**
 * A 2x app screenshot that follows the system theme. Served as-is: the files are lossless WebP,
 * already smaller than the image optimizer's output and free of its blur on small UI text.
 */
export function Shot({
  light,
  dark,
  alt,
  className,
  lazy = false,
}: {
  light: StaticImageData;
  dark: StaticImageData;
  alt: string;
  className?: string;
  lazy?: boolean;
}) {
  return (
    <picture>
      <source media="(prefers-color-scheme: dark)" srcSet={dark.src} />
      <img
        className={className}
        src={light.src}
        width={light.width / 2}
        height={light.height / 2}
        loading={lazy ? "lazy" : undefined}
        alt={alt}
      />
    </picture>
  );
}
