import { Service } from "../../../types/service";

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        textAlign: "right",
        borderTop: `6px solid ${service.color}`,
      }}
    >
      <div
        style={{
          fontSize: 42,
          marginBottom: 16,
        }}
      >
        {service.icon}
      </div>

      <h3>{service.title}</h3>

      <p
        style={{
          color: "#666",
          lineHeight: 1.8,
        }}
      >
        {service.shortDescription}
      </p>

      <small
        style={{
          color: "#999",
        }}
      >
        مدت انجام: {service.estimatedTime}
      </small>
    </div>
  );
}