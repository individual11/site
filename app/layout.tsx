import type { Metadata, Viewport } from "next";
import { Archivo_Black, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NAME, SITE_URL, TAGLINE } from "@/lib/site";
import "./globals.css";

const display = Archivo_Black({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${NAME} — individual11`,
  description: TAGLINE,
  alternates: { canonical: "/" },
  openGraph: {
    title: NAME,
    description: TAGLINE,
    url: "/",
    siteName: "individual11",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: NAME, description: TAGLINE },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
