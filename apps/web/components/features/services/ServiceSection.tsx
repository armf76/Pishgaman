import ServiceGrid from "./ServiceGrid";

export default function ServiceSection() {
  return (
    <section
      style={{
        padding: "90px 40px",
        background: "#F5F7FA",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "34px",
            marginBottom: "12px",
            color: "#0F4C81",
          }}
        >
          خدمات پیشگامان
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "50px",
            lineHeight: 1.8,
          }}
        >
          تمامی خدمات فنی، مهندسی، ثبتی و حقوقی مؤسسه به صورت
          یکپارچه از طریق سامانه قابل درخواست و پیگیری است.
        </p>

        <ServiceGrid />
      </div>
    </section>
  );
}