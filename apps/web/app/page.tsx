import Process from "../components/home/Process";
import Statistics from "../components/home/Statistics";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import QuickServices from "../components/home/QuickServices";

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
      <QuickServices />
      <Statistics />
      <Process />
      <Footer />
    </main>
  );
}