import type { Viewport } from "next";
import "./chess-clock.css";

// The rest of the site is brutalist; these pages take their look from the app
// itself (Classic colour scheme, system font). Styles are scoped under `.cc`.
export const viewport: Viewport = {
  themeColor: "#212e3d",
};

export default function ChessClockLayout({ children }: LayoutProps<"/chess-clock">) {
  return <div className="cc">{children}</div>;
}
