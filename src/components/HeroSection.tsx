import { useState, useEffect } from 'react';
import ParticleBackground from './ParticleBackground';
import AnimatedSection from './AnimatedSection';
import HeroCarousel from './HeroCarousel';
import { getActiveFeaturedProjects, type HeroFeaturedProject } from '../lib/heroProjectService';

export default function HeroSection() {
  const [featuredProjects, setFeaturedProjects] = useState<HeroFeaturedProject[]>([]);

  useEffect(() => {
    loadFeaturedProjects();
  }, []);

  const loadFeaturedProjects = async () => {
    const projects = await getActiveFeaturedProjects();
    setFeaturedProjects(projects);
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen w-full bg-[#121212] flex items-center justify-center overflow-hidden">
      <ParticleBackground opacity={0.4} />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
        <div className="text-center mb-16">
          <AnimatedSection animation="scale-up" delay={200}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight drop-shadow-2xl">
              <span className="bg-gradient-to-r from-[#00A9FF] via-white to-[#FF7A59] bg-clip-text text-transparent animate-gradient-shift">
                Shubhankar Sinha
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <p className="text-lg md:text-xl text-white/80 mb-8 font-light italic drop-shadow-lg">
              your next hire that can wear multiple hats, and wants to get things done
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
            <p className="text-xl md:text-2xl lg:text-3xl text-white mb-4 font-normal drop-shadow-lg">
              I translate strategic goals into executable plans.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={500}>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-12 font-normal max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Building the systems, streamlining the operations and managing the mission. From whiteboard to launch day.
            </p>
          </AnimatedSection>
        </div>

        <AnimatedSection animation="scale-up" delay={600}>
          <div className="w-full max-w-3xl mx-auto mb-12">
            <HeroCarousel projects={featuredProjects} />
          </div>
        </AnimatedSection>

        <AnimatedSection animation="scale-up" delay={800}>
          <button
            onClick={scrollToAbout}
            className="group relative px-10 py-4 bg-[#FF7A59] text-white text-lg font-semibold rounded-full transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(255,122,89,0.6)] focus:outline-none focus:ring-4 focus:ring-[#FF7A59]/50 animate-pulse-slow"
          >
            See The Process
            <span className="absolute inset-0 rounded-full bg-[#FF7A59] opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-300"></span>
          </button>
        </AnimatedSection>

      <style>{`
        @keyframes pulseSlow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 30px rgba(255, 122, 89, 0.5);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 0 40px rgba(255, 122, 89, 0.7);
          }
        }
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-shift {
          background-size: 200% auto;
          animation: gradientShift 5s ease-in-out infinite;
        }
      `}</style>
      </div>
    </section>
  );
}
