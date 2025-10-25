import { useState, useEffect } from 'react';
import ParticleBackground from './ParticleBackground';
import AnimatedSection from './AnimatedSection';
import ImageCarousel from './ImageCarousel';
import { getAboutSection, getGalleryImages, type GalleryImage } from '../lib/aboutService';

export default function HeroSection() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      console.log('🎯 HeroSection: Loading gallery images...');
      setLoading(true);
      const images = await getGalleryImages();
      console.log('✅ HeroSection: Gallery images loaded:', images);
      console.log('📊 Number of images:', images.length);

      setGalleryImages(images);
    } catch (err) {
      console.error('❌ Error loading gallery images:', err);
    } finally {
      setLoading(false);
    }
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

      <div className="relative z-20 w-full h-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 px-6 lg:px-12 py-12">
        <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center items-start text-left">
          <AnimatedSection animation="scale-up" delay={200}>
            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-2xl">
              <span className="bg-gradient-to-r from-[#00A9FF] via-white to-[#FF7A59] bg-clip-text text-transparent animate-gradient-shift">
                Shubhankar Sinha
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
            <p className="text-sm md:text-base lg:text-lg text-white/80 mb-6 font-light italic drop-shadow-lg">
              your next hire that can wear multiple hats, and wants to get things done
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
            <p className="text-lg md:text-xl lg:text-xl text-white mb-4 font-normal drop-shadow-lg">
              I translate strategic goals into executable plans.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={500}>
            <p className="text-base md:text-lg text-white/90 mb-8 font-normal leading-relaxed drop-shadow-lg">
              Building the systems, streamlining the operations and managing the mission. From whiteboard to launch day.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="scale-up" delay={800}>
            <button
              onClick={scrollToAbout}
              className="group relative px-8 py-3 bg-[#FF7A59] text-white text-base font-semibold rounded-full transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(255,122,89,0.6)] focus:outline-none focus:ring-4 focus:ring-[#FF7A59]/50 animate-pulse-slow"
            >
              See The Process
              <span className="absolute inset-0 rounded-full bg-[#FF7A59] opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-300"></span>
            </button>
          </AnimatedSection>
        </div>

        <div className="w-full lg:w-[50%] xl:w-[55%] flex items-center justify-center">
          <AnimatedSection animation="scale-up" delay={600}>
            <div className="w-full max-w-md">
              {loading ? (
                <div className="w-full aspect-[3/4] bg-gray-800 rounded-lg animate-pulse" />
              ) : galleryImages.length > 0 ? (
                <ImageCarousel images={galleryImages.map(img => img.image_url)} />
              ) : (
                <div className="w-full aspect-[3/4] bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No images uploaded</p>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>

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
