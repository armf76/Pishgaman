import React from "react";
import Container from "../Container";
import styles from "./Section.module.css";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export default function Section({
  children,
  className = "",
  id,
}: SectionProps) {
  return (
    <section id={id} className={`${styles.section} ${className}`}>
      <Container>
        {children}
      </Container>
    </section>
  );
}