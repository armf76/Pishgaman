import Section from "../../ui/Section";
import Card from "../../ui/Card";

import styles from "./Process.module.css";

const steps = [
  {
    number: "01",
    title: "ثبت درخواست",
    text: "ثبت اطلاعات اولیه و ایجاد پرونده",
  },
  {
    number: "02",
    title: "بررسی مدارک",
    text: "کنترل مدارک توسط کارشناسان",
  },
  {
    number: "03",
    title: "تهیه نقشه UTM",
    text: "انجام عملیات نقشه‌برداری",
  },
  {
    number: "04",
    title: "ثبت در سامانه",
    text: "ارسال پرونده به سامانه ثبت",
  },
  {
    number: "05",
    title: "صدور سند",
    text: "پیگیری تا صدور سند رسمی",
  },
];

export default function Process() {
  return (
    <Section className={styles.section}>
      <h2 className={styles.title}>
        مراحل انجام کار
      </h2>

      <p className={styles.subtitle}>
        مسیر تبدیل سند عادی به سند رسمی
      </p>

      <div className={styles.timeline}>
        {steps.map((step) => (
          <Card key={step.number} className={styles.card}>
            <div className={styles.circle}>
              {step.number}
            </div>

            <h3>{step.title}</h3>

            <p>{step.text}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}