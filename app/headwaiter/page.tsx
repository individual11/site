import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import icon from "@/assets/headwaiter/icon.png";
import welcomeLight from "@/assets/headwaiter/welcome-light.webp";
import welcomeDark from "@/assets/headwaiter/welcome-dark.webp";
import statesLight from "@/assets/headwaiter/menubar-states-light.webp";
import statesDark from "@/assets/headwaiter/menubar-states-dark.webp";
import placeCard from "@/assets/headwaiter/place-card.svg";
import { LivePopover, MenuBarItem } from "./_demo";
import { Folder, Keys, Shot, TitleBar, Wallpaper } from "./_parts";

const APP_NAME = "Headwaiter";
const TITLE = "Headwaiter: keep track of the servers running on your Mac";
const DESCRIPTION =
  "Keep track of the servers running on your Mac. A free, open source menu bar app for developers.";

const REPO = "https://github.com/individual11/headwaiter";
const ISSUES = `${REPO}/issues`;
const BUILD = `${REPO}#build-and-run`;
// Each release must include the disk image under exactly this name.
const DOWNLOAD = `${REPO}/releases/latest/download/Headwaiter.dmg`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/headwaiter" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/headwaiter",
    siteName: "individual11",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FEATURES: [string, React.ReactNode][] = [
  [
    "Grouped by project",
    "Headwaiter reads your running processes, so each server shows its project, package and framework, not just a port number.",
  ],
  [
    "Open, copy, stop",
    <>
      Click to open a server. <span className="hw-nw">Option-click</span> to copy its URL. Stop it and the processes it
      started with one click.
    </>,
  ],
  [
    "From the keyboard",
    <>
      Type to filter by name, project, framework or port. Press Return to open a server,{" "}
      <Keys symbols="⌘C" say="Command-C" /> to copy its URL or <Keys symbols="⌘⌫" say="Command-Delete" /> to stop it.
    </>,
  ],
  [
    "Worktrees and agents",
    "Git worktrees get their own cards, so you can tell apart servers started from different branches.",
  ],
  ["Every port", "When a server listens on more than one port, expand its row to see the others."],
  [
    "Docker too",
    "Containers with published ports appear alongside your other servers. Compose containers join their project.",
  ],
  [
    "Finder and terminal",
    "Reveal a server's folder in Finder, or open it in the terminal you choose in Settings.",
  ],
  [
    "Notifications and log",
    "Get notified when a server starts, or stops without you stopping it. Keep a log of starts and stops on your Mac. Both are off by default.",
  ],
];

const DETECTS: [string, string][] = [
  [
    "Node, Bun, Deno",
    "Next.js, Vite, Remix, React Router, Astro, Expo, Storybook, Nest, Express, Fastify, Hono, Koa",
  ],
  ["Python", "Django, FastAPI, Uvicorn, Flask, Jupyter"],
  ["Go", "Gin, Echo, Fiber, Chi, Gorilla, Hugo"],
  ["Ruby", "Rails, Sinatra, Hanami, Jekyll, Puma, Rack"],
  ["Docker", "Docker Desktop, OrbStack, Colima, Rancher Desktop"],
];

export default function Headwaiter() {
  return (
    <>
      <Wallpaper />

      <header className="hw-bar">
        <Link href="/">← individual11</Link>
        <MenuBarItem />
      </header>

      <main>
        <div className="hw-hero">
          <div className="hw-who">
            <Image
              className="hw-icon"
              src={icon}
              alt="Headwaiter app icon: a white bow tie on a blue rounded square"
              sizes="(min-width: 980px) 168px, 120px"
              loading="eager"
            />
            <h1>{APP_NAME}</h1>
            <p className="hw-tag">Keep track of the servers running on your Mac.</p>
            <p className="hw-sub">See every local dev server by project. Open, copy or stop any of them from the menu bar.</p>
            <div className="hw-cta">
              <a className="hw-btn hw-btn-1" href={DOWNLOAD}>
                Download for Mac
              </a>
              <a className="hw-btn hw-btn-2" href={REPO}>
                View on GitHub
              </a>
            </div>
            <p className="hw-small">
              Free and open source (MIT). Beta. macOS&nbsp;15 or later, Apple silicon and Intel.
            </p>
          </div>
          <div className="hw-pop">
            {/* Narrow screens: the popover follows the text, so it hangs from its own piece of menu bar. */}
            <div className="hw-hang" aria-hidden="true">
              <MenuBarItem decorative />
            </div>
            <LivePopover />
          </div>
        </div>

        <div className="hw-desk">
          <section className="hw-features" aria-labelledby="features">
            <div className="hw-col">
              <div className="hw-win">
                <TitleBar>
                  <h2 id="features">Features</h2>
                </TitleBar>
                <div className="hw-form">
                  {FEATURES.map(([heading, text]) => (
                    <div key={heading}>
                      <h3>{heading}</h3>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="hw-col">
              <div className="hw-win">
                <TitleBar>
                  <h3>Private</h3>
                </TitleBar>
                <div className="hw-privacy">
                  <p>What Headwaiter sees stays on your Mac. No account, no analytics.</p>
                  <p>
                    This website uses Vercel Web Analytics, which is cookieless; the app has no analytics and contacts
                    GitHub only for updates.
                  </p>
                </div>
                <div className="hw-first">
                  <Shot
                    className="hw-shot"
                    light={welcomeLight}
                    dark={welcomeDark}
                    alt="Headwaiter's first-run card. It says the app reads files like package.json to show project names, and that what it reads never leaves your Mac."
                    lazy
                  />
                </div>
              </div>
              <figure className="hw-win hw-states">
                <Shot
                  light={statesLight}
                  dark={statesDark}
                  alt="Headwaiter's menu bar icon in five states: dimmed, dimmed with a dot, with a count of 3, with 3 and a dot, and with 12 and a dot."
                  lazy
                />
                <figcaption>
                  Dimmed when nothing&apos;s running. A count when something is. A dot when something changed since you
                  last looked.
                </figcaption>
              </figure>
            </div>
          </section>

          <section className="hw-win hw-list" aria-labelledby="detects">
            <TitleBar>
              <h2 id="detects">What it detects</h2>
            </TitleBar>
            {/* Explicit roles keep the table semantics when CSS turns it into a labeled list on phones. */}
            <table role="table">
              <thead role="rowgroup">
                <tr role="row">
                  <th role="columnheader" scope="col">
                    Runtime
                  </th>
                  <th role="columnheader" scope="col">
                    Frameworks and tools
                  </th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {DETECTS.map(([runtime, tools]) => (
                  <tr role="row" key={runtime}>
                    <th role="rowheader" scope="row" data-label="Runtime">
                      <span className="hw-name">
                        <Folder />
                        {runtime}
                      </span>
                    </th>
                    <td role="cell" data-label="Frameworks and tools">
                      {tools}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="hw-status">
              Some stacks, including Docker and Go, are newly supported. If something looks wrong,{" "}
              <a href={ISSUES}>open an issue</a>.
            </p>
          </section>

          <section className="hw-win hw-img" aria-labelledby="get">
            <TitleBar>
              <h2 id="get">Get it</h2>
            </TitleBar>
            {/* The download's own window, from scripts/dmg-background.swift in the Headwaiter repo. */}
            <div className="hw-dmg">
              <div className="hw-drag" aria-hidden="true">
                <div>
                  <Image src={icon} alt="" sizes="112px" />
                  <span>Headwaiter</span>
                </div>
                <svg className="hw-arrow" viewBox="0 0 101 24">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <circle key={i} cx={3 + i * 12} cy="12" r="2.5" opacity={0.25 + i * 0.11} />
                  ))}
                  <path d="M89 3l9 9-9 9" />
                </svg>
                <div>
                  <Folder className="hw-folder" />
                  <span>Applications</span>
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element -- an SVG, which the image optimizer skips */}
              <img
                className="hw-card"
                src={placeCard.src}
                width={placeCard.width}
                height={placeCard.height}
                loading="lazy"
                alt="A place card on a table: Your server will be right with you."
              />
            </div>
            <div className="hw-how">
              <p>
                Download the disk image, open it and drag Headwaiter to Applications. It&apos;s signed and notarized by
                Apple.
              </p>
              <p>Allow folder access when macOS asks, so it can show your project names.</p>
              <a className="hw-btn hw-btn-1" href={DOWNLOAD}>
                Download for Mac
              </a>
              <p>
                Headwaiter is in beta. It can update itself: it asks before checking automatically and before installing
                anything. Update checks contact GitHub.
              </p>
              <p>
                Prefer to build it? You need Xcode&nbsp;16 or later. <a href={BUILD}>The README has the steps.</a>
              </p>
              <p>
                Bugs and ideas: <a href={ISSUES}>GitHub issues</a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="hw-dock">
        <nav aria-label="Footer">
          <Link href="/">individual11</Link>
          <a href={REPO}>GitHub</a>
        </nav>
      </footer>
    </>
  );
}
