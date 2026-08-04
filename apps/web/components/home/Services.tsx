export default function Services() {
  const services = [
    {
      title: "امور ثبتی",
      description:
        "تشکیل پرونده، تبدیل اسناد عادی به رسمی، پیگیری و خدمات ثبتی",
      icon: "🏛️",
    },
    {
      title: "خدمات حقوقی",
      description:
        "مشاوره، تنظیم قرارداد، بررسی اسناد و امور حقوقی",
      icon: "⚖️",
    },
    {
      title: "خدمات فنی و مهندسی",
      description:
        "نقشه‌برداری، UTM، تفکیک، جانمایی و خدمات مهندسی",
      icon: "📐",
    },
    {
      title: "پیگیری پرونده",
      description:
        "مشاهده وضعیت پرونده، بارگذاری مدارک و ارتباط با کارشناس",
      icon: "📂",
    },
  ];

  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "80px auto",
        padding: "0 20px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#0F4C81",
          fontSize: "38px",
          marginBottom: "15px",
        }}
      >
        خدمات پیشگامان
      </h2>

      <p
        style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "50px",
          fontSize: "18px",
        }}
      >
        خدمات تخصصی ثبتی، حقوقی و مهندسی در یک سامانه یکپارچه
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "25px",
        }}
      >
        {services.map((service) => (
          <div
            key={service.title}
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "30px",
              boxShadow: "0 10px 25px rgba(0,0,0,.08)",
            }}
          >
            <div
              style={{
                fontSize: "46px",
                marginBottom: "20px",
              }}
            >
              {service.icon}
            </div>

            <h3
              style={{
                color: "#0F4C81",
                marginBottom: "15px",
              }}
            >
              {service.title}
            </h3>

            <p
              style={{
                color: "#555",
                lineHeight: "1.9",
                minHeight: "90px",
              }}
            >
              {service.description}
            </p>

            <button
              style={{
                marginTop: "20px",
                background: "#D4AF37",
                color: "#222",
                border: "none",
                borderRadius: "8px",
                padding: "12px 20px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              مشاهده جزئیات
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}