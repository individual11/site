// The bow tie from the app's menu bar icon (GlyphRefinedTie in the Headwaiter repo):
// one wing on a 19 x 10 grid, mirrored for the other, with a knot between them.
export const WING =
  "M8.4 3.6C5.88 2.2 3.192 0 1.008.2Q.168.1.168 1.2C.336 2.6 1.176 3.8 1.092 5C1.176 6.2.336 7.4.168 8.8Q.168 9.9 1.008 9.8C3.192 10 5.88 7.8 8.4 6.4Q7.98 5 8.4 3.6Z";

/** `id` names the mask that cuts the gap around the knot; it must be unique on the page. */
export function Tie({ id }: { id: string }) {
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
