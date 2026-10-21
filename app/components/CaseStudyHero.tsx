import type { ReactNode } from "react";
import { backdropStyle, type CaseBackdrop } from "./caseBackdrop";
import backdrop from "./CaseBackdrop.module.css";
import styles from "./CaseStudyHero.module.css";
import { HideNavWhileVisible } from "./HideNavWhileVisible";

/**
 * Full-bleed opening screen for a case study: the homepage card opened up. The
 * same speckled backdrop as the study's card, edge to edge and a screen tall,
 * with the white logo and title at the top and the live coded demo below at its
 * designed size (it scales down on smaller screens). The nav hides while it's in
 * view, and the backdrop carries on past the screen and fades into the page.
 */
export function CaseStudyHero({
  logos,
  headline,
  headlineClassName,
  headlineStyle,
  demo,
  backdrop: look,
}: {
  logos: { src: string; alt: string; cls?: string }[];
  headline: string;
  headlineClassName: string;
  headlineStyle?: React.CSSProperties;
  demo: ReactNode;
  backdrop: CaseBackdrop;
}) {
  return (
    <section className={styles.hero}>
      {/* Runs past the bottom of the screen and fades out there, so there's no edge */}
      <div className={`${styles.backdrop} ${backdrop.backdrop}`} style={backdropStyle(look, { screenTall: true })} />
      <div className={styles.heading}>
        <div className={styles.logos}>
          {logos.map((logo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={logo.alt} src={logo.src} alt={logo.alt} className={logo.cls ?? "h-6 w-auto"} />
          ))}
        </div>
        <h1 className={`${headlineClassName} ${styles.title}`} style={headlineStyle}>
          {headline}
        </h1>
      </div>
      <div className={styles.demo}>{demo}</div>
      <HideNavWhileVisible />
    </section>
  );
}
