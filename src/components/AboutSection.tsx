import { useEffect, useState } from 'react';
import { Target, Wand2, Lightbulb, Mountain, Download } from 'lucide-react';
import { getAboutSection, getGalleryImages, type AboutSection as AboutSectionData, type GalleryImage } from '../lib/aboutService';
import ImageCarousel from './ImageCarousel';
import ParticleBackground from './ParticleBackground';
import AnimatedSection from './AnimatedSection';

export default function AboutSection() {
  const [aboutData, setAboutData] = useState<AboutSectionData | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAboutData() {
      const [data, images] = await Promise.all([
        getAboutSection(),
        getGalleryImages()
      ]);
      console.log('About data fetched:', data);
      console.log('Gallery images fetched:', images);
      setAboutData(data);
      setGalleryImages(images);
      setLoading(false);
    }
    loadAboutData();

    const interval = setInterval(loadAboutData, 5000);
    return () => clearInterval(interval);
  }, []);

  const contentBlocks = [
    {
      icon: Target,
      title: "My Mission",
      text: "I'm passionate about shipping ideas that solve real problems and drive measurable impact. I thrive at the intersection of business, technology, and strategy, using analytical thinking to fuel creative solutions."
    },
    {
      icon: Wand2,
      title: "My Approach: The \"Conductor\"",
      text: "I love to orchestrate the moving parts. My specialty is collaborating with cross-functional teams, breaking down complex challenges, and turning ambitious goals into executable plans. Whether it's a new product, a streamlined operation, or a strategic program, I'm the one who builds the bridge from idea to launch."
    },
    {
      icon: Lightbulb,
      title: "My Mindset",
      text: "I'm a continuous learner, always seeking new perspectives, thought-provoking discussions, and innovative ways to improve a process or a plan."
    },
    {
      icon: Mountain,
      title: "Off the Clock",
      text: "When I'm not in front of a whiteboard, you can find me de-stressing on a hike or analyzing the \"user experience\" of a new cocktail!"
    }
  ];

  const handleDownloadResume = () => {
    if (aboutData?.resume_url) {
      window.open(aboutData.resume_url, '_blank');
    }
  };

  return (
    <section id="about" className="relative w-full bg-[#121212] py-24 md:py-32 overflow-hidden">
      <ParticleBackground opacity={0.4} particleCount={40} />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <AnimatedSection animation="scale-up" threshold={0.3}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center leading-tight">
            <span className="bg-gradient-to-r from-[#00A9FF] via-white to-[#FF7A59] bg-clip-text text-transparent">
              The Method Behind the Madness.
            </span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <AnimatedSection animation="fade-right" delay={200} threshold={0.3}>
            <div className="flex items-start justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
              {loading ? (
                <div className="w-full aspect-[3/4] bg-gray-800 rounded-lg animate-pulse" />
              ) : galleryImages.length > 0 ? (
                <ImageCarousel images={galleryImages.map(img => img.image_url)} />
              ) : aboutData?.photo_url ? (
                <div className="relative group">
                  <img
                    src={aboutData.photo_url}
                    alt="Profile"
                    className="w-full aspect-[3/4] object-cover rounded-lg shadow-2xl"
                  />
                  <div className="absolute inset-0 rounded-lg border-2 border-[#FF7A59] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="w-full aspect-[3/4] bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No images uploaded</p>
                </div>
              )}
              </div>
            </div>
          </AnimatedSection>

          <div className="flex flex-col justify-center space-y-10">
            {contentBlocks.map((block, index) => {
              const Icon = block.icon;
              return (
                <AnimatedSection
                  key={index}
                  animation="fade-left"
                  delay={300 + index * 100}
                  threshold={0.3}
                >
                  <div className="space-y-3 smooth-transition hover:translate-x-2">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-[#00A9FF]" />
                    <h3 className="text-xl md:text-2xl font-bold text-[#00A9FF]">
                      {block.title}
                    </h3>
                  </div>
                  <p className="text-base md:text-lg text-[#E0E0E0] leading-relaxed pl-9">
                    {block.text}
                  </p>
                  </div>
                </AnimatedSection>
              );
            })}

            {aboutData?.resume_url && (
              <div className="pt-6 pl-9">
                <button
                  onClick={handleDownloadResume}
                  className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#FF7A59] text-white text-base font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,122,89,0.5)] focus:outline-none focus:ring-4 focus:ring-[#FF7A59]/50"
                >
                  <Download className="w-5 h-5" />
                  Download Resume
                  <span className="absolute inset-0 rounded-full bg-[#FF7A59] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
