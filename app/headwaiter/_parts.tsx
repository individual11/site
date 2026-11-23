import type { StaticImageData } from "next/image";

// The bow tie from the app's menu bar icon (GlyphRefinedTie in the Headwaiter repo):
// one wing on a 19 x 10 grid, mirrored for the other, with a knot between them.
const WING =
  "M8.4 3.6C5.88 2.2 3.192 0 1.008.2Q.168.1.168 1.2C.336 2.6 1.176 3.8 1.092 5C1.176 6.2.336 7.4.168 8.8Q.168 9.9 1.008 9.8C3.192 10 5.88 7.8 8.4 6.4Q7.98 5 8.4 3.6Z";

function Tie({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 19 10" fill="currentColor" aria-hidden="true">
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="19" height="10">
        <rect width="19" height="10" fill="#fff" />
        <rect x="7.3" y="1.5" width="4.4" height="7" rx="2" fill="#000" />
      </mask>
      <g mask={`url(#${id})`}>
        <path d={WING} />
        <path d={WING} transform="matrix(-1 0 0 1 19 0)" />
      </g>
      <rect x="8.1" y="2.3" width="2.8" height="5.4" rx="1.4" />
    </svg>
  );
}

/** The menu bar item: the bow tie and the number of servers in the screenshot. */
export function MenuBarItem({ decorative = false }: { decorative?: boolean }) {
  return (
    <span className="hw-item" {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "7 dev servers running" })}>
      <Tie id={decorative ? "hw-knot-2" : "hw-knot"} />7
    </span>
  );
}

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
