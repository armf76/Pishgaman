import Section from "../../ui/Section";
import Card from "../../ui/Card";
import Button from "../../ui/Button";

import styles from "./QuickServices.module.css";

const services = [
  {
    title: "تبدیل اسناد عادی به رسمی",
    description:
      "ثبت درخواست، بررسی مدارک و پیگیری تبدیل اسناد عادی به اسناد رسمی.",
    icon: "/icons/document.svg",
    button: "شروع درخواست",
  },
  {
    title: "تهیه نقشه UTM",
    description:
      "تهیه و تأیید نقشه UTM توسط کارشناسان رسمی برای تشکیل پرونده.",
    icon: "/icons/map.svg",
    button: "درخواست نقشه",
  },
  {
    title: "مشاوره حقوقی",
    description:
      "دریافت مشاوره تخصصی در امور ثبتی، مالکیت و بررسی وضعیت پرونده.",
    icon: "/icons/legal.svg",
    button: "رزرو مشاوره",
  },
];

export default function QuickServices() {
  return (
    <Section className={styles.section}>
      <h2 className={styles.title}>خدمات اصلی</h2>

      <p className={styles.subtitle}>
        خدمات تخصصی کارگزاری ثبت اسناد در یک نگاه
      </p>

      <div className={styles.grid}>
        {services.map((service) => (
          <Card key={service.title} className={styles.card}>
            <div className={styles.iconWrapper}>
              <img
                src={service.icon}
                alt={service.title}
                className={styles.icon}
              />
            </div>

            <h3>{service.title}</h3>

            <p>{service.description}</p>

            <Button className={styles.button}>
              {service.button}
            </Button>
          </Card>
        ))}
      </div>
    </Section>
  );
}