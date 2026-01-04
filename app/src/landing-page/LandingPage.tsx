import { Navigate } from "react-router-dom";
import { useAuth } from "wasp/client/auth";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Curriculum from "./components/Curriculum";
import CodePreview from "./components/CodePreview";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import { faqs, testimonials, footerNavigation } from "./contentSections";

export default function LandingPage() {
  const { data: user, isLoading } = useAuth();

  // Redirect logged-in users to dashboard
  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="bg-[#09090b] text-white min-h-screen w-full relative overflow-x-hidden">
      {/* Global Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary gradient - top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] opacity-50" />

        {/* Secondary gradient - bottom right */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[100px] opacity-40" />

        {/* Accent gradient - left */}
        <div className="absolute top-1/2 -left-20 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[80px] opacity-30" />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <main className="relative z-10">
        <Hero />
        <Features />
        <CodePreview />
        <Curriculum />
        <Testimonials testimonials={testimonials} />
        <Pricing />
        <FAQ faqs={faqs} />
      </main>

      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}
