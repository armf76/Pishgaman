import Link from "next/link";

import styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.link}>
        خانه
      </Link>

      <Link href="/services" className={styles.link}>
        خدمات
      </Link>

      <Link href="/about" className={styles.link}>
        درباره ما
      </Link>

      <Link href="/news" className={styles.link}>
        اخبار
      </Link>

      <Link href="/contact" className={styles.link}>
        تماس با ما
      </Link>
    </nav>
  );
}