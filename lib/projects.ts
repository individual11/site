/**
 * Portfolio projects, loaded from content/work at build time.
 *
 *   content/work/<slug>.md   one file per project (format: content/work/README.md)
 *   content/work/order.txt   display order, one slug per line
 *
 * Anything malformed stops the build with a message naming the file, so a
 * typo can't quietly break a page. Server-only: it reads the filesystem.
 */
import fs from "node:fs";
import path from "node:path";

export type Project = {
  slug: string;
  title: string;
  client?: string;
  year: string;
  role?: string;
  /** One line, shown on cards and in the scroll section. */
  summary: string;
  /** Paragraphs for the project page. */
  body: string[];
  /** Hard numbers worth calling out. */
  stats?: { value: string; label: string }[];
  tech?: string[];
  awards?: string[];
  links?: { label: string; href: string }[];
  /** Full film (Vimeo). Shown at the top of the project page in place of the loop or hero image. */
  video?: { id: string; url: string };
  /** true: full scroll section with its own particle formation. false: "More work" grid. */
  featured: boolean;
};

const DIR = path.join(process.cwd(), "content", "work");
const SCALARS = ["title", "client", "year", "role", "summary", "featured", "video"] as const;
const LISTS = ["stats", "awards", "tech", "links"] as const;
const REQUIRED = ["title", "year", "summary", "featured"] as const;

class ContentError extends Error {
  constructor(file: string, msg: string) {
    super(`content/work/${file}: ${msg}`);
    this.name = "ContentError";
  }
}

/** "value" or 'value' -> value (quotes are optional, for values that start with a quote) */
const unquote = (s: string) => {
  const t = s.trim();
  return t.length > 1 && (t[0] === '"' || t[0] === "'") && t.at(-1) === t[0] ? t.slice(1, -1) : t;
};

function pair(file: string, key: string, item: string, names: [string, string]) {
  const i = item.indexOf(" | ");
  if (i < 0) throw new ContentError(file, `each ${key} item needs "${names[0]} | ${names[1]}", got "${item}"`);
  return [item.slice(0, i).trim(), item.slice(i + 3).trim()] as const;
}

function parse(file: string, text: string): Project {
  const src = text.replace(/\r\n?/g, "\n");
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new ContentError(file, "must start with a --- block of fields and end it with ---");
  const [, head, rest] = m;

  const fields: Record<string, string> = {};
  const lists: Record<string, string[]> = {};
  let currentList: string | null = null;

  head.split("\n").forEach((raw, n) => {
    const line = raw.trimEnd();
    const where = `line ${n + 2}`;
    if (!line.trim()) return;
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item) {
      if (!currentList) throw new ContentError(file, `${where}: list item without a list name above it`);
      lists[currentList].push(unquote(item[1]));
      return;
    }
    const kv = line.match(/^([a-z]+):\s*(.*)$/);
    if (!kv) throw new ContentError(file, `${where}: expected "name: value", got "${line.trim()}"`);
    const [, key, value] = kv;
    if ((LISTS as readonly string[]).includes(key)) {
      if (value) throw new ContentError(file, `${where}: put ${key} items on their own lines, each starting with "  - "`);
      currentList = key;
      lists[key] = [];
    } else if ((SCALARS as readonly string[]).includes(key)) {
      currentList = null;
      fields[key] = unquote(value);
    } else {
      throw new ContentError(file, `${where}: unknown field "${key}" (allowed: ${[...SCALARS, ...LISTS].join(", ")})`);
    }
  });

  for (const key of REQUIRED) if (!fields[key]) throw new ContentError(file, `missing "${key}"`);
  if (fields.featured !== "true" && fields.featured !== "false")
    throw new ContentError(file, `"featured" must be true or false, got "${fields.featured}"`);

  const body = rest
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
  if (!body.length) throw new ContentError(file, "needs at least one paragraph of write-up after the --- block");

  const p: Project = {
    slug: file.replace(/\.md$/, ""),
    title: fields.title,
    year: fields.year,
    summary: fields.summary,
    body,
    featured: fields.featured === "true",
  };
  if (fields.client) p.client = fields.client;
  if (fields.role) p.role = fields.role;
  if (fields.video) {
    // Accepts vimeo.com/123, vimeo.com/manage/videos/123 or player.vimeo.com/video/123
    const v = fields.video.match(/^https?:\/\/(?:www\.|player\.)?vimeo\.com\/(?:manage\/videos\/|video\/)?(\d+)\b/);
    if (!v) throw new ContentError(file, `"video" needs a Vimeo link like https://vimeo.com/123456, got "${fields.video}"`);
    p.video = { id: v[1], url: `https://vimeo.com/${v[1]}` };
  }
  if (lists.stats?.length)
    p.stats = lists.stats.map((s) => {
      const [value, label] = pair(file, "stats", s, ["value", "label"]);
      return { value, label };
    });
  if (lists.awards?.length) p.awards = lists.awards;
  if (lists.tech?.length) p.tech = lists.tech;
  if (lists.links?.length)
    p.links = lists.links.map((s) => {
      const [label, href] = pair(file, "links", s, ["label", "url"]);
      if (!/^(https?:\/\/|\/)/.test(href)) throw new ContentError(file, `link "${label}" needs a full URL or a /path, got "${href}"`);
      return { label, href };
    });
  return p;
}

/** All shown projects, in order.txt order. */
export function getProjects(): Project[] {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md") && f !== "README.md");
  const bySlug = new Map(files.map((f) => [f.replace(/\.md$/, ""), f]));

  const order = fs
    .readFileSync(path.join(DIR, "order.txt"), "utf8")
    .split(/\r?\n/)
    .map((l, i) => ({ slug: l.trim(), line: i + 1 }))
    .filter(({ slug }) => slug && !slug.startsWith("#")); // "# slug" hides a project

  const seen = new Set<string>();
  const projects = order.map(({ slug, line }) => {
    if (seen.has(slug)) throw new ContentError("order.txt", `line ${line}: "${slug}" is listed twice`);
    seen.add(slug);
    const file = bySlug.get(slug);
    if (!file) throw new ContentError("order.txt", `line ${line}: no file named ${slug}.md`);
    return parse(file, fs.readFileSync(path.join(DIR, file), "utf8"));
  });
  if (!projects.length) throw new ContentError("order.txt", "lists no projects");
  return projects;
}
