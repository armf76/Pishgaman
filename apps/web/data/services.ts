import { Service } from "../types/service";

export const services: Service[] = [
  {
    id: "1",
    slug: "official-document",

    title: "تبدیل سند عادی به رسمی",

    category: "خدمات ثبتی",

    shortDescription:
      "ثبت درخواست تبدیل اسناد عادی به رسمی مطابق قانون جدید.",

    fullDescription:
      "انجام کلیه مراحل مربوط به تبدیل اسناد عادی به رسمی، بررسی مدارک، تشکیل پرونده و پیگیری تا پایان فرآیند.",

    estimatedTime: "۳۰ تا ۶۰ روز",

    basePrice: "طبق تعرفه",

    icon: "📄",

    color: "#0F4C81",

    isActive: true,
  },

  {
    id: "2",

    slug: "survey",

    title: "نقشه UTM",

    category: "خدمات فنی",

    shortDescription:
      "تهیه نقشه UTM برای پرونده‌های ثبتی.",

    fullDescription:
      "تهیه نقشه UTM توسط کارشناسان رسمی جهت ارائه به اداره ثبت.",

    estimatedTime: "۳ روز",

    basePrice: "طبق تعرفه",

    icon: "📍",

    color: "#198754",

    isActive: true,
  },

  {
    id: "3",

    slug: "legal",

    title: "مشاوره حقوقی",

    category: "خدمات حقوقی",

    shortDescription:
      "مشاوره تخصصی در امور ثبتی و ملکی.",

    fullDescription:
      "ارائه مشاوره حقوقی توسط کارشناسان و وکلای همکار مؤسسه.",

    estimatedTime: "رزرو آنلاین",

    basePrice: "طبق تعرفه",

    icon: "⚖️",

    color: "#C89B3C",

    isActive: true,
  },
];