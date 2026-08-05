import Section from "../../ui/Section";
import Card from "../../ui/Card";

import styles from "./Statistics.module.css";

const statistics = [
  {
    value: "12+",
    title: "سال تجربه",
  },
  {
    value: "3000+",
    title: "پرونده موفق",
  },
  {
    value: "98%",
    title: "رضایت مشتریان",
  },
  {
    value: "24/7",
    title: "پشتیبانی",
  },
];

export default function Statistics() {
  return (
    <Section className={styles.section}>
      <h2 className={styles.title}>
        چرا پیشگامان دیار آباد؟
      </h2>

      <p className={styles.subtitle}>
        تجربه، تخصص و همراهی در تمام مراحل ثبت رسمی اسناد
      </p>

      <div className={styles.grid}>
        {statistics.map((item) => (
          <Card key={item.title} className={styles.card}>
            <div className={styles.number}>
              {item.value}
            </div>

            <div className={styles.label}>
              {item.title}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}