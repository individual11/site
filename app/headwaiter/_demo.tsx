"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import mlApiIcon from "@/assets/headwaiter/demo-ml-api.webp";
import shopIcon from "@/assets/headwaiter/demo-shop.webp";
import {
  countRunning,
  getServerState,
  getState,
  PROJECTS,
  runDemo,
  SERVERS,
  subscribe,
  uptime,
  type DemoServer,
  type Running,
  type Tile,
} from "./_demo-store";
import { Tie } from "./_tie";

const useDemo = () => useSyncExternalStore(subscribe, getState, getServerState);

/** The menu bar item: the bow tie and how many servers the demo is running. */
export function MenuBarItem({ decorative = false }: { decorative?: boolean }) {
  const { servers } = countRunning(useDemo());
  return (
    <span
      className="hw-item"
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Headwaiter's menu bar icon" })}
    >
      <Tie id={decorative ? "hw-knot-2" : "hw-knot"} />
      {servers}
    </span>
  );
}

/** A live copy of the app's popover. Same layout as PopoverView.swift, in points. */
export function LivePopover() {
  const state = useDemo();
  const ref = useRef<HTMLDivElement>(null);
  const count = countRunning(state);

  useEffect(() => runDemo(ref.current!), []);

  return (
    <div className="hw-live">
      <div
        ref={ref}
        className="hw-shot hw-popover"
        role="img"
        aria-label="Headwaiter's menu bar popover listing sample dev servers grouped by project, with framework, port and uptime."
      >
        <div className="hw-p-head">
          <span className="hw-p-app">
            <Tie id="hw-knot-3" />
          </span>
          <div>
            <p className="hw-p-title">{count.servers} servers running</p>
            <p>across {count.projects} projects</p>
          </div>
          <Gear />
        </div>

        {PROJECTS.map((project) => {
          const rows = SERVERS.filter((s) => s.project === project.id && state.running.has(s.id));
          if (!rows.length) return null;
          const all = rows.map((s) => state.running.get(s.id)!);
          const entering = all.some((r) => r.enter === "card");
          const leaving = all.some((r) => r.leave === "card");
          return (
            <Collapse key={project.id} enter={entering} leave={leaving}>
              <div className="hw-p-card">
                <div className="hw-p-project">
                  <b>{project.name}</b>
                  {project.worktree && (
                    <span className="hw-p-badge">
                      <Branch />
                      {project.worktree}
                    </span>
                  )}
                  <span className="hw-p-path">{project.path}</span>
                </div>
                {rows.map((server) => (
                  <Row key={server.id} server={server} running={state.running.get(server.id)!} now={state.now} />
                ))}
              </div>
            </Collapse>
          );
        })}

        {state.history.length > 0 && (
          <div className="hw-p-card hw-p-history">
            <Chevron />
            <b>Recently stopped</b>
            <span className="hw-p-badge">{state.history.length}</span>
          </div>
        )}
        <p className="hw-p-foot">Quit</p>
      </div>
    </div>
  );
}

function Row({ server, running, now }: { server: DemoServer; running: Running; now: number }) {
  return (
    <Collapse enter={running.enter === "row"} leave={running.leave === "row"}>
      <div className={running.stopping ? "hw-p-row hw-p-stopping" : "hw-p-row"}>
        <TileMark tile={server.tile} isNew={running.isNew} />
        <div className="hw-p-name">
          <p>
            <b>{server.name}</b> <span>{server.framework}</span>
          </p>
          <p>{running.stopping ? "Stopping…" : server.subtitle}</p>
        </div>
        <div className="hw-p-port">
          <p>
            {server.otherPort && (
              <span className="hw-p-chip">
                +1
                <Chevron />
              </span>
            )}
            <b>:{server.port}</b>
          </p>
          <p>{uptime(now - running.start)}</p>
        </div>
        <span className="hw-p-slot">{running.stopping && <Spinner />}</span>
      </div>
      {server.otherPort && (
        <div className="hw-p-other">
          <Turn />
          <span>http://localhost:{server.otherPort}</span>
          <b>:{server.otherPort}</b>
        </div>
      )}
    </Collapse>
  );
}

/** Opens and closes with its content's height. Plain CSS: without support it just snaps. */
function Collapse({ enter, leave, children }: { enter: boolean; leave: boolean; children: React.ReactNode }) {
  return (
    <div className={`hw-collapse${enter ? " hw-enter" : ""}${leave ? " hw-leave" : ""}`}>
      <div>{children}</div>
    </div>
  );
}

function TileMark({ tile, isNew }: { tile: Tile; isNew: boolean }) {
  const dot = isNew && <i />;
  if ("icon" in tile) {
    const icon = tile.icon === "shop" ? shopIcon : mlApiIcon;
    return (
      <span className="hw-p-tile hw-p-favicon">
        {/* eslint-disable-next-line @next/next/no-img-element -- under 1 KB, already at its display size */}
        <img src={icon.src} width={18} height={18} alt="" />
        {dot}
      </span>
    );
  }
  if ("container" in tile) {
    return (
      <span className="hw-p-tile hw-t-docker">
        <Box />
      </span>
    );
  }
  return (
    <span className={`hw-p-tile hw-t-${tile.color}`}>
      {tile.mark}
      {dot}
    </span>
  );
}

// ---------- Glyphs ----------

const line = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Gear() {
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg className="hw-p-gear" viewBox="-8 -8 16 16" strokeWidth="1" {...line}>
      <circle r="5.1" />
      <circle r="2.1" />
      {teeth.map((angle) => (
        <path key={angle} transform={`rotate(${angle})`} d="M-1.1 -5.1L-.8 -6.7H.8L1.1 -5.1" />
      ))}
    </svg>
  );
}

const Chevron = () => (
  <svg className="hw-p-chevron" viewBox="0 0 6 10" strokeWidth="1.5" {...line}>
    <path d="M1.2 1.2 4.8 5 1.2 8.8" />
  </svg>
);

const Branch = () => (
  <svg viewBox="0 0 10 10" strokeWidth="1.1" {...line}>
    <path d="M5 9.2V6.1L1.6 1.6M5 6.1 8.4 1.6M1.5 4V1.5H4M6 1.5h2.5V4" />
  </svg>
);

const Turn = () => (
  <svg viewBox="0 0 10 9" strokeWidth="1.3" {...line}>
    <path d="M1.2 1v3.6c0 .8.4 1.2 1.2 1.2h6M6.4 3.4l2.4 2.4-2.4 2.4" />
  </svg>
);

const Box = () => (
  <svg viewBox="0 0 16 16" fill="#fff">
    <path d="M8 .9 14.2 4 11.6 5.3 5.4 2.2ZM4.2 2.8l6.2 3.1L8 7.1 1.8 4ZM1.2 5.1l6.2 3.1v6.9l-6.2-3.1ZM8.6 15.1V8.2l6.2-3.1V12Z" />
  </svg>
);

const Spinner = () => (
  <svg className="hw-p-spinner" viewBox="-6 -6 12 12" strokeWidth="1.5" {...line}>
    {Array.from({ length: 8 }, (_, i) => (
      <path key={i} d="M0 -2.6V-4.8" transform={`rotate(${i * 45})`} opacity={0.2 + i * 0.1} />
    ))}
  </svg>
);
