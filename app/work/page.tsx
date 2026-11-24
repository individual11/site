import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ElevenField from "@/components/work/ElevenField";
import NextSection from "@/components/work/NextSection";
import CopyEmail from "@/components/CopyEmail";
import { getProjects, type Project } from "@/lib/projects";
import { WORK_MEDIA } from "@/lib/work-media";
import { EMAIL, NAME } from "@/lib/site";
import { workDisplay } from "./fonts";

export const metadata: Metadata = {
  title: `Work · ${NAME}`,
  description: "Selected work: campaigns, installations, platforms and the odd catapult.",
  alternates: { canonical: "/work" },
  openGraph: { title: `Work · ${NAME}`, url: "/work", siteName: "individual11", type: "website" },
};

/** "Cannes Lions 2017: 3 Gold..." -> "Cannes Lions" */
const showName = (award: string) => award.split(/ \d{4}:/)[0];

function cover(p: Project) {
  const m = WORK_MEDIA[p.slug];
  if (!m) return null;
  // Photos make better covers than video frames; fall back to the poster.
  if (m.images[0]) return m.images[0];
  if (m.loop) return { src: m.loop.poster, width: m.loop.width, height: m.loop.height, alt: m.loop.alt };
  return m.poster ?? null;
}

function FeaturedCard({ p, index }: { p: Project; index: number }) {
  const img = cover(p);
  const meta = [p.client, p.year].filter(Boolean).join(" · ");
  return (
    <article className={`w-card ${index % 2 ? "w-card--creative" : "w-card--logic"}`}>
      {img && (
        <Link href={`/work/${p.slug}`} className="w-card-media" tabIndex={-1} aria-hidden="true">
          <Image src={img.src} alt="" width={img.width} height={img.height} sizes="(max-width: 759px) 100vw, 440px" />
        </Link>
      )}
      <p className="w-eyebrow">{meta}</p>
      <h2>
        <Link href={`/work/${p.slug}`}>{p.title}</Link>
      </h2>
      <p className="w-lede">{p.summary}</p>
      {p.stats && (
        <dl className="w-stats">
          {p.stats.slice(0, 3).map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {p.awards && <p className="w-awards">{p.awards.map(showName).join(" · ")}</p>}
      {p.role && <p className="w-role">{p.role}</p>}
      <Link href={`/work/${p.slug}`} className="w-go">
        See the project <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

export default function WorkPage() {
  const projects = getProjects();
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);
  const stops = [
    { id: "top", label: "Intro" },
    ...featured.map((p) => ({ id: p.slug, label: p.title })),
    { id: "more", label: "More work" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <ElevenField fontFamily={workDisplay.style.fontFamily} />
      <NextSection stops={stops} />
      <main className="w-main">
        <section className="w-sec" id="top" data-formation="eleven" data-side="R" aria-labelledby="w-title">
          <span className="w-snap" aria-hidden="true" />
          <div className="w-card w-card--ink w-hero">
            <p className="w-eyebrow">
              <em>Work</em> · {NAME}
            </p>
            <h1 id="w-title">Both sides.</h1>
            <p className="w-lede">
              I&apos;ve been a creative technologist, a copywriter and a CTO. The squares are the logic. The dots are
              the creative. Every project here needed both.
            </p>
            <p className="w-hint">› Sweep your cursor across the line between the two 1s.</p>
          </div>
        </section>

        {featured.map((p, i) => (
          <section
            key={p.slug}
            id={p.slug}
            className={`w-sec ${i % 2 ? "w-sec--right" : ""}`}
            data-formation={p.slug}
            data-side={i % 2 ? "L" : "R"}
            aria-label={p.title}
          >
            <span className="w-snap" aria-hidden="true" />
            <FeaturedCard p={p} index={i} />
          </section>
        ))}

        <section className="w-more" id="more" aria-labelledby="w-more-title">
          <h2 id="w-more-title" className="w-more-title">
            More work
          </h2>
          <ul className="w-grid">
            {more.map((p) => {
              const img = cover(p);
              return (
                <li key={p.slug} className="w-tile">
                  <Link href={`/work/${p.slug}`}>
                    {img && (
                      <Image src={img.src} alt="" width={img.width} height={img.height} sizes="(max-width: 759px) 100vw, 360px" />
                    )}
                    <span className="w-eyebrow">{[p.client, p.year].filter(Boolean).join(" · ")}</span>
                    <span className="w-tile-title">{p.title}</span>
                    <span className="w-tile-sum">{p.summary}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="w-sec" id="contact" data-formation="eleven-mixed" data-side="R" aria-labelledby="w-contact">
          <span className="w-snap" aria-hidden="true" />
          <div className="w-card w-card--logic">
            <p className="w-eyebrow">Contact</p>
            <h2 id="w-contact">Let&apos;s build something.</h2>
            <div className="w-email">
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <CopyEmail email={EMAIL} />
            </div>
            <Link href="/" className="w-go">
              <span aria-hidden="true">←</span> Back to individual11.com
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
