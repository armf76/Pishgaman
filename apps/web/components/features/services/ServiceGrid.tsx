import ServiceCard from "./ServiceCard";
import { services } from "../../../data/services";

export default function ServiceGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px",
        marginTop: "40px",
      }}
    >
      {services
        .filter((service) => service.isActive)
        .map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
          />
        ))}
    </div>
  );
}