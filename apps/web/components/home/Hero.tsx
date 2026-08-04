export default function Hero() {
  return (
    <section
      style={{
        width: "100%",
        background:
          "linear-gradient(135deg,#0F4C81 0%, #154F8C 100%)",
        color: "white",
        padding: "90px 30px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "52px",
          marginBottom: "25px",
        }}
      >
        سامانه جامع خدمات ثبتی، حقوقی و مهندسی
      </h1>

      <h2
        style={{
          color: "#D4AF37",
          marginBottom: "35px",
          fontSize: "34px",
        }}
      >
        پیشگامان
      </h2>

      <p
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          lineHeight: "2",
          fontSize: "22px",
        }}
      >
        بستری هوشمند برای ثبت درخواست‌ها، مدیریت پرونده‌ها،
        پیگیری فرآیندهای ثبتی و دریافت خدمات تخصصی حقوقی،
        فنی و مهندسی.
      </p>

      <div
        style={{
          marginTop: "50px",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          style={{
            background: "#D4AF37",
            color: "#222",
            border: "none",
            padding: "16px 36px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          ثبت درخواست
        </button>

        <button
          style={{
            background: "transparent",
            color: "white",
            border: "2px solid white",
            padding: "16px 36px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          دریافت مشاوره
        </button>
      </div>
    </section>
  );
}