import type { Viewport } from "next";
import "./headwaiter.css";

// Like /chess-clock, this page takes its look from the app, not from the rest of
// the site. Styles are scoped under `.hw` and follow the system's light or dark setting.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f8ff" },
    { media: "(prefers-color-scheme: dark)", color: "#131a33" },
  ],
};

export default function HeadwaiterLayout({ children }: LayoutProps<"/headwaiter">) {
  return <div className="hw">{children}</div>;
}
