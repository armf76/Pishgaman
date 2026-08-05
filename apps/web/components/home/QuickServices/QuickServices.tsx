import Section from "../../ui/Section";
import Card from "../../ui/Card";

import styles from "./QuickServices.module.css";

const services = [
  {
    title: "تبدیل اسناد عادی",
    text: "ثبت درخواست تبدیل سند عادی به سند رسمی",
    icon: "📄",
  },
  {
    title: "نقشه UTM",
    text: "تهیه و تأیید نقشه UTM توسط کارشناسان",
    icon: "📍",
  },
  {
    title: "مشاوره حقوقی",
    text: "بررسی وضعیت پرونده و دریافت مشاوره",
    icon: "⚖️",
  },
];

export default function QuickServices() {
  return (
    <Section className={styles.section}>
      <h2 className={styles.title}>
        خدمات اصلی
      </h2>

      <div className={styles.grid}>
        {services.map((service) => (
          <Card key={service.title} className={styles.card}>
            <div className={styles.icon}>
              {service.icon}
            </div>

            <h3>{service.title}</h3>

            <p>{service.text}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}