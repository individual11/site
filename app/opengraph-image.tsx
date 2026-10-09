import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NAME, TAGLINE } from "@/lib/site";

export const alt = `${NAME} — ${TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [display, mono] = await Promise.all([
    readFile(join(process.cwd(), "assets/ArchivoBlack-Regular.ttf")),
    readFile(join(process.cwd(), "assets/JetBrainsMono-Bold.ttf")),
  ]);
  const [first, last] = NAME.toUpperCase().split(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          backgroundColor: "#0a0a0a",
          // a frozen nod to the liquid shader
          backgroundImage: [
            "radial-gradient(circle at 78% 22%, #f2f0e9 0%, rgba(242,240,233,0) 32%)",
            "radial-gradient(circle at 90% 85%, #22ff66 0%, rgba(34,255,102,0) 18%)",
            "radial-gradient(circle at 60% 110%, #6b6b66 0%, rgba(107,107,102,0) 40%)",
          ].join(", "),
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "flex-start",
            fontFamily: "Archivo Black",
            fontSize: 132,
            lineHeight: 0.86,
            color: "#0a0a0a",
            backgroundColor: "#f2f0e9",
            border: "6px solid #0a0a0a",
            boxShadow: "14px 14px 0 #22ff66",
            padding: "18px 22px 10px",
          }}
        >
          <span>{first}</span>
          <span>{last}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            marginTop: 44,
            marginLeft: 28,
            fontFamily: "JetBrains Mono",
            fontSize: 38,
            color: "#0a0a0a",
            backgroundColor: "#22ff66",
            border: "6px solid #0a0a0a",
            padding: "14px 24px",
            transform: "rotate(-1.2deg)",
          }}
        >
          {TAGLINE}
        </div>
        <div
          style={{
            position: "absolute",
            right: 72,
            bottom: 48,
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: 26,
            letterSpacing: 2,
            color: "#22ff66",
          }}
        >
          INDIVIDUAL11.COM
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo Black", data: display, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 700, style: "normal" },
      ],
    },
  );
}
