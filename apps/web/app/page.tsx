import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import Hero from "../components/home/Hero";
import TrustSection from "../components/home/TrustSection";

import ServiceSection from "../components/features/services/ServiceSection";

import Advertisement from "../components/home/Advertisement";
import News from "../components/home/News";
import About from "../components/home/About";

// موقتاً غیرفعال
// import Advertisement from "../components/home/Advertisement";
// import News from "../components/home/News";
// import About from "../components/home/About";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F5F7FA",
      }}
    >
      <Header />

      <Hero />

      <TrustSection />

      <ServiceSection />

      <Footer />
    </main>
  );
}