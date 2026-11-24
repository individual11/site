import { Bricolage_Grotesque, Space_Mono } from "next/font/google";

export const workDisplay = Bricolage_Grotesque({
  variable: "--w-font-display",
  subsets: ["latin"],
});

export const workMono = Space_Mono({
  variable: "--w-font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});
