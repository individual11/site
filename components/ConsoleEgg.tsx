"use client";

import { useEffect } from "react";
import { SHADER_EVENT, type ShaderMode } from "./LiquidShader";
import { EMAIL, LINKS, NAME, TAGLINE } from "@/lib/site";

const BANNER = String.raw`
██╗███╗   ██╗██████╗ ██╗██╗   ██╗██╗██████╗ ██╗   ██╗ █████╗ ██╗     ██╗ ██╗
██║████╗  ██║██╔══██╗██║██║   ██║██║██╔══██╗██║   ██║██╔══██╗██║    ███║███║
██║██╔██╗ ██║██║  ██║██║██║   ██║██║██║  ██║██║   ██║███████║██║    ╚██║╚██║
██║██║╚██╗██║██║  ██║██║╚██╗ ██╔╝██║██║  ██║██║   ██║██╔══██║██║     ██║ ██║
██║██║ ╚████║██████╔╝██║ ╚████╔╝ ██║██████╔╝╚██████╔╝██║  ██║███████╗██║ ██║
╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═══╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝ ╚═╝`;

const ACID = "background:#22ff66;color:#0a0a0a;font-weight:700;padding:2px 6px;";
const INK = "background:#0a0a0a;color:#22ff66;font-weight:700;padding:2px 6px;";
const PLAIN = "color:inherit;font-weight:400;";

const MODES: ShaderMode[] = ["calm", "liquid", "chaos"];

declare global {
  interface Window {
    help?: () => void;
    whoami?: () => void;
    hire?: () => void;
    shader?: (mode?: string) => void;
  }
}

// StrictMode mounts effects twice in dev; only greet once per page load
let greeted = false;

export default function ConsoleEgg() {
  useEffect(() => {
    if (greeted) return;
    greeted = true;

    console.log(`%c${BANNER}`, "color:#22ff66;background:#0a0a0a;font-family:monospace;line-height:1.1;");
    console.log("%c YOU OPENED DEVTOOLS. %c good instinct. type %chelp()%c to see what else is in here.", ACID, PLAIN, INK, PLAIN);

    window.help = () => {
      console.log("%c COMMANDS ", ACID);
      console.table({
        "help()": "you are here",
        "whoami()": "who built this",
        "hire()": "start a conversation",
        "shader('calm' | 'liquid' | 'chaos')": "change the background",
      });
      console.log("%cthere may be one more. try being root.", "color:#888;font-style:italic;");
    };

    window.whoami = () => {
      console.log(`%c ${NAME.toUpperCase()} %c ${TAGLINE}`, ACID, PLAIN);
      console.log(`%clinkedin%c ${LINKS.linkedin}`, INK, PLAIN);
      console.log(`%cblog%c ${LINKS.blog}`, INK, PLAIN);
      console.log(`%cemail%c ${EMAIL}`, INK, PLAIN);
    };

    window.hire = () => {
      console.log("%c OPENING YOUR MAIL CLIENT… %c see you in the inbox.", ACID, PLAIN);
      const subject = encodeURIComponent("Found you in the console");
      window.location.href = `mailto:${EMAIL}?subject=${subject}`;
    };

    window.shader = (mode = "liquid") => {
      if (!MODES.includes(mode as ShaderMode)) {
        console.log(`%c NOPE %c modes: ${MODES.map((m) => `'${m}'`).join(", ")}`, ACID, PLAIN);
        return;
      }
      window.dispatchEvent(new CustomEvent(SHADER_EVENT, { detail: mode }));
      console.log(`%c SHADER → ${mode.toUpperCase()} `, ACID);
    };

    // typed bare, no parens: `sudo`
    Object.defineProperty(window, "sudo", {
      configurable: true,
      get() {
        return "nice try.";
      },
    });
  }, []);

  return null;
}
