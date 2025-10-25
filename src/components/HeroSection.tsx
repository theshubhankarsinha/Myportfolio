import ParticleBackground from './ParticleBackground';
import AnimatedSection from './AnimatedSection';

export default function HeroSection() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen w-full bg-[#121212] flex items-center justify-center overflow-hidden">
      <ParticleBackground opacity={0.6} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        <AnimatedSection animation="scale-up" delay={200}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            <span className="bg-gradient-to-r from-[#00A9FF] via-white to-[#FF7A59] bg-clip-text text-transparent animate-gradient-shift">
              Shubhankar Sinha
            </span>
          </h1>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={400}>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-6 font-normal">
            Your next high-impact hire, ready to wear multiple hats and execute at high-velocity.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={600}>
          <p className="text-xl md:text-2xl lg:text-3xl text-[#00A9FF] mb-12 font-normal max-w-4xl mx-auto leading-relaxed">
            Building the systems, streamlining the operations, and managing the mission. From whiteboard to launch day.
          </p>
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
