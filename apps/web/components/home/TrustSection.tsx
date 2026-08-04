export default function TrustSection() {
  const items = [
    {
      title: "پرونده‌های در حال رسیدگی",
      value: "به‌زودی",
    },
    {
      title: "کارشناسان متخصص",
      value: "به‌زودی",
    },
    {
      title: "خدمات تخصصی",
      value: "به‌زودی",
    },
    {
      title: "رضایت مراجعان",
      value: "به‌زودی",
    },
  ];

  return (
    <section
      style={{
        background: "#ffffff",
        padding: "80px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#0F4C81",
            marginBottom: "15px",
            fontSize: "38px",
          }}
        >
          چرا می‌توانید به پیشگامان اعتماد کنید؟
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "50px",
            fontSize: "18px",
          }}
        >
          اطلاعات این بخش پس از آغاز بهره‌برداری سامانه به‌صورت
          لحظه‌ای نمایش داده خواهد شد.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "25px",
          }}
        >
          {items.map((item) => (
            <div
              key={item.title}
              style={{
                background: "#F8FAFC",
                borderRadius: "18px",
                padding: "35px",
                textAlign: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,.05)",
              }}
            >
              <h3
                style={{
                  color: "#0F4C81",
                  marginBottom: "20px",
                }}
              >
                {item.title}
              </h3>

              <div
                style={{
                  color: "#D4AF37",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}