export default function Footer() {
  return (
    <footer
      style={{
        background: "#0F4C81",
        color: "white",
        marginTop: "80px",
        padding: "60px 40px 30px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "40px",
        }}
      >
        <div>
          <h3 style={{ color: "#D4AF37" }}>
            پیشگامان
          </h3>

          <p
            style={{
              lineHeight: "2",
            }}
          >
            سامانه جامع خدمات ثبتی،
            حقوقی و فنی مهندسی
          </p>
        </div>

        <div>
          <h3 style={{ color: "#D4AF37" }}>
            دسترسی سریع
          </h3>

          <p>خانه</p>
          <p>خدمات</p>
          <p>اخبار</p>
          <p>ثبت درخواست</p>
        </div>

        <div>
          <h3 style={{ color: "#D4AF37" }}>
            ارتباط با ما
          </h3>

          <p>رشت</p>

          <p>تلفن:</p>

          <p>ایمیل:</p>
        </div>
      </div>

      <hr
        style={{
          margin: "40px 0 20px",
          borderColor: "#ffffff33",
        }}
      />

      <p
        style={{
          textAlign: "center",
          color: "#dddddd",
          fontSize: "14px",
        }}
      >
        © تمامی حقوق این سامانه محفوظ است.
      </p>
    </footer>
  );
}