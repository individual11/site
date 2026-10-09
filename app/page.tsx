import LiquidShader from "@/components/LiquidShader";
import ConsoleEgg from "@/components/ConsoleEgg";
import CopyEmail from "@/components/CopyEmail";
import { EMAIL, LINKS, NAME, TAGLINE } from "@/lib/site";

export default function Home() {
  const [first, last] = NAME.split(" ");

  return (
    <>
      <LiquidShader />
      <ConsoleEgg />
      <main className="stage">
        <h1 className="name">
          <span>{first}</span>
          <span>{last}</span>
        </h1>
        <p className="tagline">{TAGLINE}</p>
        <nav className="links" aria-label="Elsewhere">
          <a className="btn" href={LINKS.linkedin} target="_blank" rel="me noopener">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a className="btn" href={LINKS.blog} target="_blank" rel="me noopener">
            Blog <span aria-hidden="true">↗</span>
          </a>
          <span className="email">
            <a className="btn btn-email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <CopyEmail email={EMAIL} />
          </span>
        </nav>
      </main>
      <footer className="footer">
        <span>INDIVIDUAL11.COM</span>
        <span className="hint">{"// devtools welcome"}</span>
      </footer>
    </>
  );
}
