import Link from "next/link";

export const APP_NAME = "Modern Chess Clock";
export const APP_TAGLINE = "A clean, modern chess clock for two players on iPhone and iPad.";
export const APP_STORE_ID = "972446900";
export const APP_STORE_URL = `https://apps.apple.com/app/id${APP_STORE_ID}`;
export const SUPPORT_EMAIL = "chessclock@individual11.com";

export function StoreButton() {
  return (
    <a className="cc-store" href={APP_STORE_URL}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>
        <small>Download on the</small>
        <b>App Store</b>
      </span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="cc-footer">
      <div className="cc-wrap">
        <Link href="/">individual11</Link>
        <span>
          <Link href="/chess-clock">{APP_NAME}</Link>
          {" · "}
          <Link href="/chess-clock/privacy">Privacy</Link>
        </span>
      </div>
    </footer>
  );
}
