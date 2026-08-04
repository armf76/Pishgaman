import { ReactNode } from "react";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

import styles from "./AppShell.module.css";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className={styles.layout}>
      <Topbar />

      <div className={styles.contentArea}>
        <Sidebar />

        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}