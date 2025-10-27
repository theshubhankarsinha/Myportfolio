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
    // STEP 1: Create the window.chatbase proxy object immediately
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      // Renamed '...arguments' to '...args' to fix strict mode error
      window.chatbase = (...args) => { 
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        // Renamed 'arguments' to 'args'
        window.chatbase.q.push(args); 
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q;
          }
          // Renamed '...args' here too
          return (...args) => target(prop, ...args);
        },
      });
    }

    // STEP 2: Define the function to load the script
    const onLoad = () => {
      // Don't load twice
      if (document.getElementById("E_9Waxlhpf_S92v0JbsVw")) {
        return;
      }
      
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      
      // Use .id and .domain (from the snippet) not dataset
      script.id = "E_9Waxlhpf_S92v0JbsVw"; 
      script.domain = "www.chatbase.co"; 
      
      document.body.appendChild(script);
    };

    // STEP 3: Call the load function safely
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      // Cleanup the event listener
      return () => window.removeEventListener("load", onLoad);
    }
  }, []); // The empty array ensures this runs only once

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
