// The demo behind the popover on /headwaiter: made-up servers that start and stop on their own,
// following the app's rules (sort order, NEW dot, "Stopping…", Recently stopped). The server
// render and the first client render are the same still frame, so the page is complete without
// JavaScript.

export type Tile = { mark: string; color: string } | { icon: "shop" | "ml-api" } | { container: true };

export type DemoServer = {
  id: string;
  project: string;
  name: string;
  framework: string;
  subtitle: string;
  port: number;
  otherPort?: number;
  tile: Tile;
  /** Seconds it has been up in the first frame; undefined if it isn't running yet. */
  age?: number;
  isNew?: boolean;
  /** Stays up for the whole demo, so the list keeps its shape. */
  fixed?: boolean;
};

export type DemoProject = { id: string; name: string; path: string; worktree?: string };

// Sorted like the app: by project name, then path, with loose containers last.
export const PROJECTS: DemoProject[] = [
  { id: "blog", name: "blog", path: "~/code/blog" },
  { id: "design-system", name: "design-system", path: "~/code/design-system" },
  { id: "docs", name: "docs", path: "~/code/docs" },
  { id: "links", name: "links", path: "~/code/links" },
  { id: "ml-api", name: "ml-api", path: "~/code/ml-api" },
  { id: "my-shop", name: "my-shop", path: "~/code/my-shop" },
  { id: "wt-checkout", name: "my-shop", path: "~/code/my-shop/.c…ktrees/checkout-fix", worktree: "checkout-fix" },
  { id: "wt-search", name: "my-shop", path: "~/code/my-shop/.c…trees/search-filters", worktree: "search-filters" },
  { id: "recipes", name: "recipes", path: "~/code/recipes" },
  { id: "docker", name: "Docker", path: "docker://" },
];

// Tile marks and colors are the app's own (FrameworkStyle.swift).
const NEXT: Tile = { mark: "N", color: "next" };
const VITE: Tile = { mark: "V", color: "vite" };

export const SERVERS: DemoServer[] = [
  { id: "blog", project: "blog", name: "blog", framework: "Astro", subtitle: "dev", port: 4321, tile: { mark: "A", color: "astro" } },
  { id: "storybook", project: "design-system", name: "storybook", framework: "Storybook", subtitle: "storybook", port: 6006, tile: { mark: "S", color: "storybook" } },
  { id: "docs", project: "docs", name: "docs", framework: "Vite", subtitle: "dev", port: 5173, tile: VITE, age: 900 },
  { id: "links", project: "links", name: "links", framework: "Chi", subtitle: "go run ./cmd/links", port: 8081, tile: { mark: "Ch", color: "chi" } },
  { id: "ml-api", project: "ml-api", name: "ml-api", framework: "FastAPI", subtitle: "uvicorn app.main:app", port: 8000, tile: { icon: "ml-api" }, age: 186_000, fixed: true },
  { id: "api", project: "my-shop", name: "@shop/api", framework: "Express", subtitle: "apps/api · dev", port: 4000, otherPort: 4001, tile: { mark: "Ex", color: "express" }, age: 8_040, fixed: true },
  { id: "web", project: "my-shop", name: "@shop/web", framework: "Next.js", subtitle: "apps/web · dev", port: 3000, tile: { icon: "shop" }, age: 60, isNew: true, fixed: true },
  { id: "admin", project: "my-shop", name: "admin", framework: "Vite", subtitle: "apps/admin · dev", port: 5175, tile: VITE },
  { id: "db", project: "my-shop", name: "db", framework: "postgres:16", subtitle: "container · my-shop", port: 5433, tile: { container: true }, age: 9_000, fixed: true },
  { id: "wt-checkout", project: "wt-checkout", name: "@shop/web", framework: "Next.js", subtitle: "apps/web · dev", port: 3100, tile: NEXT, age: 30, isNew: true },
  { id: "wt-search", project: "wt-search", name: "@shop/web", framework: "Next.js", subtitle: "apps/web · dev", port: 3101, tile: NEXT },
  { id: "recipes", project: "recipes", name: "recipes", framework: "Rails", subtitle: "bin/rails server", port: 3001, tile: { mark: "Ra", color: "rails" } },
  { id: "nginx", project: "docker", name: "cranky_turing", framework: "nginx:alpine", subtitle: "container", port: 8088, tile: { container: true }, age: 300 },
];

const BY_ID = new Map(SERVERS.map((s) => [s.id, s]));
const isContainer = (s: DemoServer) => "container" in s.tile;

/** A running server. `enter` and `leave` say whether its row or its whole card animates. */
export type Running = {
  /** Demo time it started, in seconds; negative for servers up before the demo began. */
  start: number;
  isNew: boolean;
  stopping?: boolean;
  enter?: "row" | "card";
  leave?: "row" | "card";
};

export type DemoState = {
  /** Demo time in seconds. Stands still while hidden or off screen. */
  now: number;
  running: ReadonlyMap<string, Running>;
  /** Recently stopped server ids, newest first. */
  history: readonly string[];
};

const INITIAL: DemoState = {
  now: 0,
  running: new Map(
    SERVERS.filter((s) => s.age !== undefined).map((s) => [s.id, { start: -s.age!, isNew: !!s.isNew }]),
  ),
  history: ["admin", "storybook", "blog"],
};

/** Servers that count: everything running except rows on their way out. */
export function countRunning(state: DemoState) {
  let servers = 0;
  const projects = new Set<string>();
  for (const [id, r] of state.running) {
    if (r.leave) continue;
    servers++;
    projects.add(BY_ID.get(id)!.project);
  }
  return { servers, projects: projects.size };
}

/** Same format as the app's Display.uptime. */
export function uptime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const pad = (n: number) => String(n).padStart(2, "0");
  if (s < 60) return `${s}s`;
  if (s < 3_600) return `${Math.floor(s / 60)}m`;
  if (s < 86_400) return `${Math.floor(s / 3_600)}h ${pad(Math.floor((s % 3_600) / 60))}m`;
  return `${Math.floor(s / 86_400)}d ${pad(Math.floor((s % 86_400) / 3_600))}h`;
}

// ---------- Store ----------

let state = INITIAL;
const listeners = new Set<() => void>();

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => void listeners.delete(listener);
};
export const getState = () => state;
export const getServerState = () => INITIAL;

function set(next: Partial<DemoState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function patch(id: string, change: Partial<Running>) {
  const running = new Map(state.running);
  const current = running.get(id);
  if (!current) return;
  running.set(id, { ...current, ...change });
  set({ running });
}

// ---------- What happens next ----------

const LEAVE_MS = 320;
const STOPPING_SECONDS = 2;
const COOLDOWN_SECONDS = 10;
const MIN_UPTIME_SECONDS = 6;
/** The app's list scrolls past this height, so the demo never grows that tall. */
const MAX_LIST_HEIGHT = 560;

const lastStopped = new Map<string, number>();
let stoppingId: string | null = null;
let stoppingUntil = 0;
let nextEventAt = 3;

const between = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

/** List height in the app's points: cards, their rows and gaps, plus Recently stopped. */
function listHeight(ids: string[]) {
  const projects = new Set(ids.map((id) => BY_ID.get(id)!.project));
  const others = ids.filter((id) => BY_ID.get(id)!.otherPort).length;
  return projects.size * (28 + 8) + ids.length * 43 + others * 24 + 30;
}

function start() {
  const up = [...state.running.keys()];
  const options = SERVERS.filter(
    (s) =>
      !state.running.has(s.id) &&
      state.now - (lastStopped.get(s.id) ?? -Infinity) >= COOLDOWN_SECONDS &&
      listHeight([...up, s.id]) <= MAX_LIST_HEIGHT,
  );
  if (!options.length) return false;
  const server = pick(options);
  const cardIsUp = up.some((id) => BY_ID.get(id)!.project === server.project);
  set({
    running: new Map(state.running).set(server.id, {
      start: state.now,
      isNew: !isContainer(server), // containers don't get the dot
      enter: cardIsUp ? "row" : "card",
    }),
    history: state.history.filter((id) => id !== server.id),
  });
  return true;
}

function beginStop() {
  const options = [...state.running].filter(
    ([id, r]) => !BY_ID.get(id)!.fixed && !r.leave && (r.start < 0 || state.now - r.start >= MIN_UPTIME_SECONDS),
  );
  if (!options.length) return false;
  stoppingId = pick(options)[0];
  stoppingUntil = state.now + STOPPING_SECONDS;
  patch(stoppingId, { stopping: true });
  return true;
}

function finishStop(id: string) {
  const server = BY_ID.get(id)!;
  const cardMates = [...state.running].some(([other, r]) => other !== id && !r.leave && BY_ID.get(other)!.project === server.project);
  lastStopped.set(id, state.now);
  patch(id, { leave: cardMates ? "row" : "card" });
  // The app remembers servers, not containers, and lists the last five.
  if (!isContainer(server)) set({ history: [id, ...state.history].slice(0, 5) });
  setTimeout(() => {
    const running = new Map(state.running);
    running.delete(id);
    set({ running });
  }, LEAVE_MS);
}

function tick() {
  set({ now: state.now + 1 });
  if (stoppingId) {
    if (state.now >= stoppingUntil) {
      finishStop(stoppingId);
      stoppingId = null;
      nextEventAt = state.now + between(2, 4);
    }
    return;
  }
  if (state.now < nextEventAt) return;
  const { servers } = countRunning(state);
  const startFirst = servers <= 5 || (servers < 8 && Math.random() < 0.55);
  if (startFirst ? start() || beginStop() : beginStop() || start()) nextEventAt = state.now + between(3, 5);
}

/** Runs the demo while `element` is on screen and the tab is visible. Under reduced motion it stays a still frame. */
export function runDemo(element: Element) {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let onScreen = false;
  let timer: ReturnType<typeof setInterval> | undefined;

  const update = () => {
    const shouldRun = onScreen && !document.hidden && !reducedMotion.matches;
    if (shouldRun && !timer) timer = setInterval(tick, 1000);
    if (!shouldRun && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };

  const observer = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    update();
  });
  observer.observe(element);
  document.addEventListener("visibilitychange", update);
  reducedMotion.addEventListener("change", update);

  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", update);
    reducedMotion.removeEventListener("change", update);
    clearInterval(timer);
  };
}
