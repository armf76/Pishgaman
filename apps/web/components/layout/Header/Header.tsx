import Container from "../Container";

import Logo from "./Logo";
import Navigation from "./Navigation";
import Actions from "./Actions";

import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.inner}>
          <Logo />

          <Navigation />

          <Actions />
        </div>
      </Container>
    </header>
  );
}