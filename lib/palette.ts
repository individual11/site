/**
 * Portfolio colours. One source for both the CSS (injected as custom properties
 * by app/work/layout.tsx) and the particle canvas. Swap the whole palette here.
 *
 * Signal: logic = neon green squares, creative = bone-white dots.
 * Alternates explored in design/portfolio-concepts/eleven-palettes.html.
 */
export const PALETTE = {
  bg: "#0A0A0A",
  surface: "#121212",
  ink: "#F2EFE6",
  dim: "#8F8C84",
  accent: "#22FF66",
  logic: "#22FF66",
  creative: "#EDE6D6",
  /** "r,g,b" of ink, for the faint seam line on the canvas */
  seamRgb: "242,239,230",
} as const;

export const PALETTE_CSS = {
  "--w-bg": PALETTE.bg,
  "--w-surface": PALETTE.surface,
  "--w-ink": PALETTE.ink,
  "--w-dim": PALETTE.dim,
  "--w-accent": PALETTE.accent,
  "--w-logic": PALETTE.logic,
  "--w-creative": PALETTE.creative,
} as React.CSSProperties;
