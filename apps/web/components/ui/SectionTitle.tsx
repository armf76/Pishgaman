type Props = {
  title: string;
  subtitle?: string;
};

export default function SectionTitle({
  title,
  subtitle,
}: Props) {
  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: "50px",
      }}
    >
      <h2
        style={{
          color: "#0F4C81",
          fontSize: "40px",
          marginBottom: "12px",
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          style={{
            color: "#666",
            fontSize: "18px",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}