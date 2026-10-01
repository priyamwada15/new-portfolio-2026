import Image from "next/image";
import styles from "./FunThingsLink.module.css";

/** Left, center (front), right, matching the hand-drawn fan. */
const CARDS = [
  { src: "/fun-things/terminal.avif", position: styles.left },
  { src: "/fun-things/mac.avif", position: styles.center },
  { src: "/fun-things/racing.avif", position: styles.right },
] as const;

/**
 * "fun things" link to the playground. On hover, three experiment screenshots fan out
 * of a stack above the words as a sneak peek.
 */
export function FunThingsLink({ className }: { className?: string }) {
  return (
    <span className={styles.wrap}>
      <a href="/playground" className={className}>
        fun things
      </a>
      <span className={styles.fan} aria-hidden="true">
        {CARDS.map(({ src, position }) => (
          <span key={src} className={`${styles.card} ${position}`}>
            <span className={styles.float}>
              {/* Eager: hidden until hover, so lazy loading can leave a blank card on first peek */}
              <Image src={src} alt="" fill sizes="120px" loading="eager" className={styles.image} />
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
