/**
 * Particle formations. Each draws a white silhouette into an offscreen canvas;
 * the engine samples it. Logic squares take the edge pixels (snapped to a grid),
 * creative dots take the interior. A shape can opt out of the edge/interior split
 * with `split: "halves"` (left half logic, right half creative) or by drawing
 * separate layers (see `layers`).
 */

export type Draw = (c: CanvasRenderingContext2D, w: number, h: number) => void;

export type Formation = {
  /** Default: edges -> logic, interior -> creative. */
  split?: "edges" | "halves";
  /** Optional separate layers: logic draws L targets (all pixels), creative draws R targets. */
  layers?: { logic: Draw; creative: Draw };
  draw?: Draw;
  /** Fraction of the region the shape fills. */
  pad?: number;
};

export function fit(c: CanvasRenderingContext2D, w: number, h: number, bw: number, bh: number, pad = 0.9) {
  const s = Math.min(w / bw, h / bh) * pad;
  c.translate((w - bw * s) / 2, (h - bh * s) / 2);
  c.scale(s, s);
}

const cut = (c: CanvasRenderingContext2D, f: () => void) => {
  c.globalCompositeOperation = "destination-out";
  f();
  c.globalCompositeOperation = "source-over";
};

function textFit(c: CanvasRenderingContext2D, w: number, h: number, text: string, font: string, pad = 0.9) {
  c.fillStyle = "#fff";
  c.textAlign = "center";
  c.textBaseline = "alphabetic";
  c.font = font.replace("{s}", "100");
  const tw = c.measureText(text).width / 100;
  const size = Math.min((w * pad) / tw, (h * pad) / 0.78);
  c.font = font.replace("{s}", size.toFixed(1));
  c.fillText(text, w / 2, (h + size * 0.72) / 2);
}

let displayFamily = '"Bricolage Grotesque"';
/** next/font gives the face a generated family name; the field passes it in. */
export function setDisplayFamily(family: string) {
  displayFamily = family;
}
const elevenFont = () => `800 {s}px ${displayFamily}, "Arial Black", sans-serif`;

export const FORMATIONS: Record<string, Formation> = {
  // Hero: the left 1 is logic, the right 1 is creative.
  eleven: { split: "halves", draw: (c, w, h) => textFit(c, w, h, "11", elevenFont(), 0.9) },

  // Closing: both species mixed through both 1s.
  "eleven-mixed": { draw: (c, w, h) => textFit(c, w, h, "11", elevenFont(), 0.62) },

  "donate-life": {
    draw: (c, w, h) => {
      fit(c, w, h, 220, 200);
      c.fillStyle = "#fff";
      c.beginPath();
      c.moveTo(110, 190);
      c.bezierCurveTo(20, 130, 0, 80, 20, 45);
      c.bezierCurveTo(42, 5, 95, 5, 110, 50);
      c.bezierCurveTo(125, 5, 178, 5, 200, 45);
      c.bezierCurveTo(220, 80, 200, 130, 110, 190);
      c.fill();
    },
  },

  "find-new-roads": {
    draw: (c, w, h) => {
      fit(c, w, h, 240, 260);
      c.fillStyle = "#fff";
      c.beginPath();
      c.roundRect(30, 20, 120, 220, 14); // pump body
      c.fill();
      c.fillRect(18, 236, 144, 18); // base
      cut(c, () => {
        c.beginPath();
        c.roundRect(48, 42, 84, 60, 6); // screen
        c.fill();
        c.fillRect(48, 120, 84, 8);
        c.fillRect(48, 138, 84, 8);
      });
      c.strokeStyle = "#fff";
      c.lineWidth = 10;
      c.lineCap = "round";
      c.beginPath(); // hose
      c.moveTo(150, 70);
      c.bezierCurveTo(215, 70, 215, 160, 196, 200);
      c.stroke();
      c.beginPath(); // nozzle
      c.roundRect(176, 196, 30, 44, 6);
      c.fill();
    },
  },

  buddy: {
    // One definition fanning out to five channels.
    draw: (c, w, h) => {
      fit(c, w, h, 300, 240);
      c.fillStyle = "#fff";
      c.strokeStyle = "#fff";
      c.lineWidth = 8;
      const hub = { x: 70, y: 120 };
      const ends = [30, 75, 120, 165, 210].map((y) => ({ x: 250, y }));
      for (const e of ends) {
        c.beginPath();
        c.moveTo(hub.x, hub.y);
        c.bezierCurveTo(160, hub.y, 160, e.y, e.x, e.y);
        c.stroke();
      }
      c.beginPath();
      c.roundRect(hub.x - 46, hub.y - 46, 92, 92, 12);
      c.fill();
      for (const e of ends) {
        c.beginPath();
        c.arc(e.x, e.y, 17, 0, Math.PI * 2);
        c.fill();
      }
    },
  },

  "microsoft-store": {
    // The wraparound wall: a wide band of screens.
    draw: (c, w, h) => {
      fit(c, w, h, 340, 170);
      c.fillStyle = "#fff";
      c.beginPath();
      c.moveTo(10, 30);
      c.quadraticCurveTo(170, 80, 330, 30);
      c.lineTo(330, 130);
      c.quadraticCurveTo(170, 180, 10, 130);
      c.closePath();
      c.fill();
      cut(c, () => {
        c.lineWidth = 5;
        for (let x = 52; x < 330; x += 42) {
          c.beginPath();
          c.moveTo(x, 20);
          c.lineTo(x, 170);
          c.stroke();
        }
      });
    },
  },

  "light-of-human-kindness": {
    // The wall and its pods.
    draw: (c, w, h) => {
      fit(c, w, h, 300, 200);
      c.fillStyle = "#fff";
      for (let y = 20; y <= 180; y += 26)
        for (let x = 20; x <= 280; x += 26) {
          const r = 6 + 4 * Math.abs(Math.sin(x * 0.07 + y * 0.05));
          c.beginPath();
          c.arc(x, y, r, 0, Math.PI * 2);
          c.fill();
        }
    },
  },

  flipdots: {
    // A space invader for the logic, the board's frame for the creative.
    layers: {
      logic: (c, w, h) => {
        const px = [
          "..x.....x..",
          "...x...x...",
          "..xxxxxxx..",
          ".xx.xxx.xx.",
          "xxxxxxxxxxx",
          "x.xxxxxxx.x",
          "x.x.....x.x",
          "...xx.xx...",
        ];
        fit(c, w, h, 15, 12, 0.75);
        c.fillStyle = "#fff";
        px.forEach((row, y) => [...row].forEach((ch, x) => ch === "x" && c.fillRect(x + 2, y + 2, 1, 1)));
      },
      creative: (c, w, h) => {
        fit(c, w, h, 15, 12, 0.95);
        c.strokeStyle = "#fff";
        c.lineWidth = 0.5;
        c.strokeRect(0.25, 0.25, 14.5, 11.5);
      },
    },
  },

  "one-small-tweet": {
    layers: {
      logic: (c, w, h) => {
        fit(c, w, h, 300, 240);
        c.fillStyle = "#fff";
        c.beginPath();
        c.arc(220, 70, 58, 0, Math.PI * 2);
        c.fill();
        cut(c, () => {
          c.beginPath();
          c.arc(220, 70, 50, 0, Math.PI * 2);
          c.fill();
        });
      },
      creative: (c, w, h) => {
        fit(c, w, h, 300, 240);
        c.fillStyle = "#fff";
        c.beginPath();
        c.arc(220, 70, 46, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = "#fff";
        c.lineWidth = 6;
        c.setLineDash([2, 14]);
        c.lineCap = "round";
        c.beginPath();
        c.moveTo(20, 230);
        c.bezierCurveTo(80, 200, 120, 120, 172, 100);
        c.stroke();
      },
    },
  },

  "cookie-blaster": {
    draw: (c, w, h) => {
      fit(c, w, h, 220, 220);
      c.fillStyle = "#fff";
      c.beginPath();
      c.arc(110, 110, 100, 0, Math.PI * 2);
      c.fill();
      const holes = [
        [196, 40, 34], // the bite
        [214, 86, 22],
        [70, 70, 9], // chips
        [120, 60, 9],
        [60, 130, 9],
        [110, 120, 9],
        [150, 150, 9],
        [95, 175, 9],
      ];
      cut(c, () => {
        for (const [x, y, r] of holes) {
          c.beginPath();
          c.arc(x, y, r, 0, Math.PI * 2);
          c.fill();
        }
      });
    },
  },
};
