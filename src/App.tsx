import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import HomeSection from "./components/HomeSection";
import AboutSection from "./components/AboutSection";
import ExperienceTimeline from "./components/ExperienceTimeline";
import SkillsSection from "./components/SkillsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import AdminPage from "./pages/AdminPage";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollProgressBar from "./components/ScrollProgressBar";

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  // ✅ Chatbase chatbot embed
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.dataset.chatbotId = "E_9Waxlhpf_S92v0JbsVw"; // your bot ID
    script.dataset.domain = "shubhankarsinha.com"; // optional
    document.body.appendChild(script);
  }, []);

  const handleBackToPortfolio = () => {
    setShowAdmin(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (showAdmin) {
    return (
      <AuthProvider>
        <div className="relative">
          <AdminPage onBack={handleBackToPortfolio} />
        </div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <ScrollProgressBar />
        <Navigation />
        <HomeSection />
        <AboutSection />
        <ExperienceTimeline />
        <SkillsSection />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />

        <button
          onClick={() => setShowAdmin(true)}
          className="fixed bottom-8 right-8 w-12 h-12 bg-[#00A9FF] rounded-full flex items-center justify-center text-white text-xl font-bold hover:bg-[#0090DD] smooth-transition shadow-lg z-50 hover:scale-110"
          title="Admin Login"
        >
          A
        </button>
      </div>
    </AuthProvider>
  );
}

export default App;
