import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import SplitCTA from "../components/SplitCTA";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <SplitCTA />
      <Carousel />
      <Footer />
    </main>
  );
}
