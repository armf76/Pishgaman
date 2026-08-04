interface ContainerProps {
  children: React.ReactNode;
}

import styles from "./Container.module.css";

export default function Container({
  children,
}: ContainerProps) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}