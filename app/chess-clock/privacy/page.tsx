import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME, Footer, SUPPORT_EMAIL } from "../_shared";

export const metadata: Metadata = {
  title: `${APP_NAME}: Privacy Policy`,
  description: `${APP_NAME} collects no data. No ads, no accounts, no analytics.`,
  alternates: { canonical: "/chess-clock/privacy" },
  openGraph: {
    title: `${APP_NAME}: Privacy Policy`,
    description: `${APP_NAME} collects no data. No ads, no accounts, no analytics.`,
    url: "/chess-clock/privacy",
    siteName: "individual11",
    type: "website",
  },
  twitter: { card: "summary", title: `${APP_NAME}: Privacy Policy` },
};

export default function ChessClockPrivacy() {
  return (
    <>
      <header className="cc-top">
        <div className="cc-wrap">
          <Link className="cc-back" href="/chess-clock">
            ← {APP_NAME}
          </Link>
          <div className="cc-hero cc-hero-sm">
            <div>
              <h1>Privacy Policy</h1>
              <p className="cc-tagline">{APP_NAME} for iPhone and iPad. Last updated November 18, 2026.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="cc-wrap cc-prose">
        <section>
          <h2>The short version</h2>
          <p>
            {APP_NAME} collects no data. It has no ads, no accounts and no analytics, and it doesn&apos;t send anything
            from your device to me or to anyone else.
          </p>
        </section>

        <section>
          <h2>What stays on your device</h2>
          <p>
            Your settings (playing time, per-move bonus, color scheme, sounds and warnings) and any saved presets are
            stored only on your device. Deleting the app deletes them.
          </p>
        </section>

        <section>
          <h2>Purchases</h2>
          <p>
            The optional Pro upgrade is bought through Apple&apos;s App Store. Apple handles the payment; I never see
            your name, Apple ID or payment details. The app only asks Apple whether Pro has been purchased so it can
            unlock it. Apple&apos;s handling of your data is covered by{" "}
            <a className="cc-link" href="https://www.apple.com/legal/privacy/">
              Apple&apos;s privacy policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2>This website</h2>
          <p>
            individual11.com uses Vercel Web Analytics to count page views. It doesn&apos;t use cookies and doesn&apos;t
            identify individual visitors. This applies to the website only, not the app.
          </p>
        </section>

        <section>
          <h2>Email</h2>
          <p>
            If you email me for support, I use your message and address only to reply to you, and I don&apos;t share
            them.
          </p>
        </section>

        <section>
          <h2>Children</h2>
          <p>The app collects no data from anyone, including children.</p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>If this policy changes, the new version will be posted on this page with a new date.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about privacy:{" "}
            <a className="cc-link" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
