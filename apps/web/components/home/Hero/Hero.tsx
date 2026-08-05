import Section from "../../ui/Section";
import Button from "../../ui/Button";

import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <Section className={styles.hero}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <span className={styles.badge}>
            سامانه هوشمند ثبت اسناد
          </span>

          <h1 className={styles.title}>
            تبدیل اسناد عادی
            <br />
            به اسناد رسمی
          </h1>

          <p className={styles.description}>
            پیشگامان دیار آباد، همراه شما در تمام مراحل ثبت رسمی املاک،
            پیگیری پرونده‌ها، مشاوره حقوقی و خدمات ثبتی.
          </p>

          <div className={styles.actions}>
            <Button>
              شروع درخواست
            </Button>

            <Button variant="outline">
              مشاوره رایگان
            </Button>
          </div>
        </div>

        <div className={styles.image}>
          <div className={styles.placeholder}>
            تصویر اصلی Hero
          </div>
        </div>
      </div>
    </Section>
  );
}