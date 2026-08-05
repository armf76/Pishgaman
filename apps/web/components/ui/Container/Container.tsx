import React from "react";
import styles from "./Container.module.css";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      {children}
    </div>
  );
}