import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import icon from "@/assets/chess-clock/icon.png";
import shotStart from "@/assets/chess-clock/start.jpg";
import shotGame from "@/assets/chess-clock/game.jpg";
import shotSettings from "@/assets/chess-clock/settings.jpg";
import shotGameOver from "@/assets/chess-clock/game-over.jpg";
import { APP_NAME, APP_STORE_ID, APP_TAGLINE, Footer, StoreButton, SUPPORT_EMAIL } from "./_shared";
import { Shots } from "./_shots";

export const metadata: Metadata = {
  title: `${APP_NAME}: Support`,
  description: APP_TAGLINE,
  alternates: { canonical: "/chess-clock" },
  itunes: { appId: APP_STORE_ID },
  openGraph: {
    title: APP_NAME,
    description: APP_TAGLINE,
    url: "/chess-clock",
    siteName: "individual11",
    type: "website",
  },
  twitter: { card: "summary", title: APP_NAME, description: APP_TAGLINE },
};

const SHOTS = [
  { src: shotStart, caption: "Start", alt: "Start screen: both clocks at 10:00, black's half upside down at the top, each with a Clock Settings button" },
  { src: shotGame, caption: "In play", alt: "Game in progress: white's clock running and enlarged at the bottom, black's time in a strip at the top" },
  { src: shotSettings, caption: "Settings", alt: "Settings: playing times, per-move increment or delay, saved presets and colour schemes" },
  { src: shotGameOver, caption: "Game over", alt: "Game over: You win and You lose panels with number of moves and average move time" },
];

// Exact colours from the app's ClockTheme.swift: [dark, light].
const FREE_SCHEMES: [string, string, string][] = [
  ["Classic", "#212e3d", "#f2f2f2"],
  ["Mono", "#000000", "#ffffff"],
];
const PRO_SCHEMES: [string, string, string][] = [
  ["Tournament", "#456b40", "#ededd1"],
  ["Walnut", "#5c3821", "#f0d9b5"],
  ["Midnight", "#0f1a38", "#e0ebf7"],
  ["Rosewood", "#591f29", "#f5e6e0"],
];

function Swatches({ schemes }: { schemes: [string, string, string][] }) {
  return (
    <span className="cc-swatches">
      {schemes.map(([name, d, l]) => (
        <span
          key={name}
          className="cc-sw"
          title={name}
          style={{ "--d": d, "--l": l } as React.CSSProperties}
        />
      ))}
    </span>
  );
}

export default function ChessClockSupport() {
  return (
    <>
      <header className="cc-top">
        <div className="cc-wrap">
          <Link className="cc-back" href="/">
            ← individual11
          </Link>
          <div className="cc-hero">
            <Image className="cc-icon" src={icon} alt={`${APP_NAME} app icon`} sizes="(min-width: 900px) 128px, 96px" preload />
            <div>
              <h1>{APP_NAME}</h1>
              <p className="cc-tagline">{APP_TAGLINE}</p>
              <StoreButton />
            </div>
          </div>
        </div>
      </header>

      <Shots shots={SHOTS} />

      <main className="cc-wrap">
        <section aria-labelledby="features">
          <h2 id="features">What it does</h2>
          <div className="cc-plans">
            <div className="cc-plan cc-free">
              <div className="cc-plan-head">
                <h3>Free</h3>
                <span className="cc-price">Included</span>
              </div>
              <ul>
                <li>Six playing times, 2 min to 1 hour</li>
                <li>Increment or delay per move</li>
                <li>
                  Two color schemes: Classic, Mono <Swatches schemes={FREE_SCHEMES} />
                </li>
                <li>Sounds and haptics</li>
                <li>iPhone and iPad</li>
              </ul>
            </div>
            <div className="cc-plan cc-pro">
              <div className="cc-plan-head">
                <h3>Pro</h3>
                <span className="cc-price">One-time purchase, $1.99</span>
              </div>
              <ul>
                <li>Custom times</li>
                <li>Separate times for each player</li>
                <li>Saved presets (up to six)</li>
                <li>10-second low-time warning</li>
                <li>
                  Four extra color schemes <Swatches schemes={PRO_SCHEMES} />
                  <span className="cc-sub">Tournament, Walnut, Midnight, Rosewood</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="how">
          <h2 id="how">How to use it</h2>
          <ol className="cc-steps">
            <li>
              <span className="cc-n" aria-hidden="true">1</span>
              <p>Tap your side after each move.</p>
              <span className="cc-sub">Your opponent&apos;s clock starts.</span>
            </li>
            <li>
              <span className="cc-n" aria-hidden="true">2</span>
              <p>Swipe sideways to pause.</p>
              <span className="cc-sub">Then Resume, Settings or Restart.</span>
            </li>
            <li>
              <span className="cc-n" aria-hidden="true">3</span>
              <p>Settings is always close.</p>
              <span className="cc-sub">On the start screen, the pause menu and the game-over screen.</span>
            </li>
          </ol>
        </section>

        <section aria-labelledby="help">
          <h2 id="help">Help</h2>
          <details open>
            <summary>How do I restore Pro?</summary>
            <p>
              Go to <strong>Settings &gt; Unlock Pro &gt; Restore Purchase</strong>. Reinstalling the app on the same
              Apple ID restores it automatically.
            </p>
          </details>
          <details>
            <summary>How do I remove a saved preset?</summary>
            <p>Long-press it in Settings, then tap Remove.</p>
          </details>
          <details>
            <summary>Why did my game restart when I changed the time?</summary>
            <p>Changing the time during a paused game restarts the game. The app asks before it does.</p>
          </details>
          <details>
            <summary>Can I get a refund?</summary>
            <p>
              Refunds are handled by Apple at{" "}
              <a className="cc-link" href="https://reportaproblem.apple.com">
                reportaproblem.apple.com
              </a>
              .
            </p>
          </details>
        </section>

        <section aria-labelledby="get">
          <div className="cc-get">
            <Image className="cc-get-icon" src={icon} alt="" sizes="64px" />
            <div className="cc-get-text">
              <h2 id="get">{APP_NAME}</h2>
              <p>Free on iPhone and iPad.</p>
            </div>
            <StoreButton />
          </div>
        </section>

        <section className="cc-two">
          <div className="cc-privacy" aria-labelledby="privacy">
            <h2 id="privacy">Privacy</h2>
            <p>
              The app has no ads, no accounts and no analytics, and collects no data. Settings and saved presets stay on
              the device. Purchases are handled by Apple.
            </p>
            <p className="cc-note">
              This website uses Vercel Web Analytics, which is cookieless; the app itself sends nothing.
            </p>
            <Link className="cc-link" href="/chess-clock/privacy">
              Full privacy policy →
            </Link>
          </div>
          <div aria-labelledby="contact">
            <h2 id="contact">Contact</h2>
            <p className="cc-note">Questions, bugs or ideas: email me and I&apos;ll get back to you.</p>
            <a className="cc-mail" href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Modern Chess Clock")}`}>
              {SUPPORT_EMAIL}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
