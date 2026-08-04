type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
};

export default function Button({
  children,
  variant = "primary",
  onClick,
}: ButtonProps) {
  const background =
    variant === "primary" ? "#0F4C81" : "#D4AF37";

  return (
    <button
      onClick={onClick}
      style={{
        background,
        color: "#fff",
        border: "none",
        borderRadius: "12px",
        padding: "15px 32px",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: 600,
        transition: ".2s",
      }}
    >
      {children}
    </button>
  );
}