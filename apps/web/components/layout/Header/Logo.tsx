import Link from "next/link";

import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <Link href="/" className={styles.logo}>
      <h2 className={styles.title}>
        پیش<span>گامان</span>
      </h2>

      <span className={styles.subtitle}>
        کارگزاری فنی، مهندسی و حقوقی
      </span>
    </Link>
  );
}