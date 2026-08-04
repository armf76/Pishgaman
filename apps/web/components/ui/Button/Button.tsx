type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

import styles from "./Button.module.css";

export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}