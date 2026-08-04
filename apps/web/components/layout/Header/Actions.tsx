import Link from "next/link";

import styles from "./Actions.module.css";

export default function Actions() {
  return (
    <div className={styles.actions}>
      <Link
        href="/login"
        className={styles.login}
      >
        ورود کاربران
      </Link>

      <Link
        href="/register-request"
        className={styles.primary}
      >
        ثبت درخواست
      </Link>
    </div>
  );
}