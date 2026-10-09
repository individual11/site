# individual11.com

Personal site of David Vogeleer. Next.js (App Router), deployed on Vercel.

- `components/LiquidShader.tsx`: WebGL domain-warped fbm background. Shows a still frame under `prefers-reduced-motion`, renders at lower resolution on touch devices, and pauses when the tab is hidden.
- `components/ConsoleEgg.tsx`: open devtools.
- `lib/site.ts`: name, tagline, links, email.
- `app/opengraph-image.tsx`: link-preview card (fonts in `assets/`).
- Analytics: Vercel Web Analytics (`@vercel/analytics`).

```bash
npm install
npm run dev
```
