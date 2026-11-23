import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import LoopVideo from "@/components/work/LoopVideo";
import VimeoFilm from "@/components/work/VimeoFilm";
import { getProjects } from "@/lib/projects";
import { WORK_MEDIA } from "@/lib/work-media";
import { NAME } from "@/lib/site";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProjects().find((x) => x.slug === slug);
  if (!p) return {};
  const media = WORK_MEDIA[p.slug];
  const og = media?.loop?.poster ?? media?.images[0]?.src;
  return {
    title: `${p.title} · ${NAME}`,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      title: p.title,
      description: p.summary,
      url: `/work/${p.slug}`,
      siteName: "individual11",
      type: "article",
      ...(og ? { images: [og] } : {}),
    },
  };
}

// Params are read inside Suspense so navigations show the shell instantly
// (Cache Components); every slug is still prerendered via generateStaticParams.
export default function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<main className="w-detail" aria-busy="true" />}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}

async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = getProjects();
  const index = projects.findIndex((x) => x.slug === slug);
  if (index < 0) notFound();
  const p = projects[index];
  const media = WORK_MEDIA[p.slug];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  // Top slot: the full film if there is one, else the loop, else the first image
  const images = media?.images ?? [];
  const [heroImg, ...gallery] = p.video || media?.loop ? [undefined, ...images] : images;
  const meta = [p.client, p.year].filter(Boolean).join(" · ");

  return (
    <main className="w-detail">
      <Link href="/work" className="w-back">
        <span aria-hidden="true">←</span> All work
      </Link>

      <header className="w-detail-head">
        <p className="w-eyebrow">{meta}</p>
        <h1>{p.title}</h1>
        <p className="w-lede">{p.summary}</p>
        {p.role && <p className="w-role">{p.role}</p>}
      </header>

      {p.video ? (
        <VimeoFilm id={p.video.id} title={p.title} />
      ) : (
        media?.loop && <LoopVideo loop={media.loop} />
      )}
      {heroImg && (
        <figure className="w-hero-img">
          <Image src={heroImg.src} alt={heroImg.alt} width={heroImg.width} height={heroImg.height} sizes="(max-width: 1100px) 100vw, 1100px" priority />
        </figure>
      )}

      <div className="w-detail-body">
        <div className="w-copy">
          {p.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <aside className="w-facts">
          {p.stats && (
            <dl className="w-stats w-stats--stack">
              {p.stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {p.awards && (
            <div>
              <h2 className="w-eyebrow">Awards</h2>
              <ul className="w-list">
                {p.awards.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}
          {p.tech && (
            <div>
              <h2 className="w-eyebrow">Built with</h2>
              <ul className="w-tags">
                {p.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          {p.links && (
            <div>
              <h2 className="w-eyebrow">Links</h2>
              <ul className="w-list">
                {p.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target={l.href.startsWith("/") ? undefined : "_blank"} rel="noopener">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {gallery.length > 0 && (
        <ul className="w-gallery">
          {gallery.map((g) =>
            g ? (
              <li key={g.src} className={g.height > g.width ? "is-tall" : ""}>
                <Image src={g.src} alt={g.alt} width={g.width} height={g.height} sizes="(max-width: 759px) 100vw, 540px" />
              </li>
            ) : null,
          )}
        </ul>
      )}

      <nav className="w-pager" aria-label="More projects">
        <Link href={`/work/${prev.slug}`}>
          <span className="w-eyebrow">Previous</span>
          {prev.title}
        </Link>
        <Link href={`/work/${next.slug}`} className="is-next">
          <span className="w-eyebrow">Next</span>
          {next.title}
        </Link>
      </nav>
    </main>
  );
}
