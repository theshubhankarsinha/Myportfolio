import { useState, useEffect, useRef } from 'react';
import { Hand } from 'lucide-react';
import { getExperienceTimeline, type ExperienceItem } from '../lib/experienceService';
import ImageCarousel from './ImageCarousel';
import TrainAnimation from './TrainAnimation';
import ParticleBackground from './ParticleBackground';
import AnimatedSection from './AnimatedSection';


export default function ExperienceTimeline() {
  const [timelineData, setTimelineData] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [viewedItem, setViewedItem] = useState<string | null>(null);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    loadTimeline();
  }, []);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (const item of timelineData) {
          const element = itemRefs.current[item.id];
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const elementBottom = elementTop + rect.height;

            if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
              setViewedItem(item.id);
              break;
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [timelineData]);

  const loadTimeline = async () => {
    const data = await getExperienceTimeline();
    setTimelineData(data);
    setLoading(false);
  };

  const handleItemClick = (id: string) => {
    setActiveItem(activeItem === id ? null : id);
  };

  const handleClose = () => {
    setActiveItem(null);
  };

  if (loading) {
    return (
      <section id="experience" className="relative min-h-screen w-full bg-[#121212] py-24 px-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading experiences...</div>
      </section>
    );
  }

  if (timelineData.length === 0) {
    return (
      <section id="experience" className="relative min-h-screen w-full bg-[#121212] py-24 px-6 flex items-center justify-center">
        <div className="text-white text-xl">No experiences available yet.</div>
      </section>
    );
  }

  return (
    <section id="experience" className="relative min-h-screen w-full bg-[#121212] py-24 px-6 overflow-hidden">
      <ParticleBackground opacity={0.4} particleCount={40} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <AnimatedSection animation="scale-up" threshold={0.3}>
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-[#00A9FF] via-white to-[#FF7A59] bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={200} threshold={0.3}>
          <p className="text-xl text-gray-400 mb-20 text-center max-w-2xl mx-auto">
            A journey of building, scaling, and leading innovative teams. Click on any experience to learn more.
          </p>
        </AnimatedSection>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#00A9FF] via-[#FF7A59] to-[#00A9FF] opacity-50"></div>

          <div className="space-y-24">
            {timelineData.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => (itemRefs.current[item.id] = el)}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`w-full md:w-5/12 ${
                    index % 2 === 0 ? 'md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'
                  }`}
                >
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className="group w-full bg-[#1A1A1A] hover:bg-[#222222] border-2 border-transparent hover:border-[#FF7A59] rounded-2xl p-6 smooth-transition cursor-pointer text-left hover:scale-105 hover:shadow-[0_0_30px_rgba(255,122,89,0.3)] gpu-accelerated"
                  >
                    <div className="text-[#00A9FF] text-lg font-semibold mb-2">
                      {item.year}
                    </div>
                    <div className="text-white text-2xl font-bold group-hover:text-[#FF7A59] transition-colors">
                      {item.title}
                    </div>
                  </button>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#FF7A59] rounded-full border-4 border-[#121212] z-10 shadow-lg shadow-[#FF7A59]/50"></div>

                {viewedItem === item.id && (
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 z-20 animate-point ${
                      index % 2 === 0 ? 'right-[55%] md:right-[52%]' : 'left-[55%] md:left-[52%]'
                    }`}
                  >
                    <Hand
                      className={`w-8 h-8 text-[#FF7A59] drop-shadow-lg ${
                        index % 2 === 0 ? 'rotate-90' : '-rotate-90'
                      }`}
                      fill="#FF7A59"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeItem && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 transition-opacity duration-300 animate-fade-in"
            onClick={handleClose}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <div
              className="pointer-events-auto bg-[#1A1A1A] border-2 border-[#FF7A59] rounded-3xl shadow-[0_0_60px_rgba(255,122,89,0.5)] max-w-6xl w-full max-h-[90vh] overflow-y-auto transform premium-transition animate-scale-up hover:shadow-[0_0_80px_rgba(255,122,89,0.6)] gpu-accelerated"
              onClick={(e) => e.stopPropagation()}
            >
              {timelineData
                .filter((item) => item.id === activeItem)
                .map((item) => (
                  <div key={item.id} className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-4xl font-bold text-white mb-2">
                          {item.year}: {item.title}
                        </h3>
                        <p className="text-lg text-gray-400 italic">{item.intro}</p>
                      </div>

                      {item.moments.map((moment, idx) => (
                        <div key={idx} className="space-y-3">
                          <h4 className="text-2xl font-semibold text-[#00A9FF]">
                            {moment.heading}
                          </h4>
                          {moment.subtitle && (
                            <p className="text-lg text-gray-300">{moment.subtitle}</p>
                          )}
                          {moment.bullets && (
                            <ul className="space-y-2 ml-4">
                              {moment.bullets.map((bullet, bulletIdx) => (
                                <li
                                  key={bulletIdx}
                                  className="text-gray-300 leading-relaxed flex items-start"
                                >
                                  <span className="text-[#FF7A59] mr-3 mt-1.5">•</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-start">
                      {item.images.length > 0 ? (
                        <ImageCarousel images={item.images.map((img) => img.image_url)} />
                      ) : (
                        <div className="w-full aspect-[3/4] bg-gray-800/30 rounded-2xl flex items-center justify-center">
                          <p className="text-gray-500">No images available</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      <TrainAnimation />

      <style>{`
        @keyframes point {
          0%, 100% {
            transform: translateY(-50%) translateX(0);
          }
          50% {
            transform: translateY(-50%) translateX(8px);
          }
        }
        .animate-point {
          animation: point 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
