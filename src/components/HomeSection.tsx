import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import * as Icons from 'lucide-react';
import { getPortfolioPlaybooks, type PortfolioPlaybook } from '../lib/portfolioService';
import ParticleBackground from './ParticleBackground';
import AnimatedSection from './AnimatedSection';

export default function HomeSection() {
  const [playbooks, setPlaybooks] = useState<PortfolioPlaybook[]>([]);
  const [selectedPlaybook, setSelectedPlaybook] = useState<PortfolioPlaybook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaybooks();
  }, []);

  const loadPlaybooks = async () => {
    const data = await getPortfolioPlaybooks();
    setPlaybooks(data);
    setLoading(false);
  };

  const scrollToPortfolio = () => {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (portfolioGrid) {
      portfolioGrid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCardClick = (playbook: PortfolioPlaybook) => {
    setSelectedPlaybook(playbook);
  };

  const handleClose = () => {
    setSelectedPlaybook(null);
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-12 h-12" /> : null;
  };

  return (
    <section id="home" className="relative min-h-screen w-full bg-[#121212] overflow-hidden">
      <ParticleBackground opacity={0.6} />

      <div className="relative z-10 h-[50vh] flex items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">
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
              onClick={scrollToPortfolio}
              className="group relative px-10 py-4 bg-[#FF7A59] text-white text-lg font-semibold rounded-full transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(255,122,89,0.6)] focus:outline-none focus:ring-4 focus:ring-[#FF7A59]/50 animate-pulse-slow"
            >
              See My Work
              <span className="absolute inset-0 rounded-full bg-[#FF7A59] opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-300"></span>
            </button>
          </AnimatedSection>
        </div>
      </div>

      <div id="portfolio-grid" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="scale-up" threshold={0.3}>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-center">
              <span className="bg-gradient-to-r from-[#00A9FF] via-white to-[#FF7A59] bg-clip-text text-transparent">
                The Conductor's Lab
              </span>
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={200} threshold={0.3}>
            <p className="text-xl text-gray-400 mb-16 text-center max-w-3xl mx-auto">
              A showcase of frameworks, not just projects. Here are the playbooks I've built for turning ideas into real-world impact.
            </p>
          </AnimatedSection>

          {loading ? (
            <div className="text-white text-xl text-center py-12">Loading playbooks...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {playbooks.map((playbook, index) => (
                <AnimatedSection
                  key={playbook.id}
                  animation="scale-up"
                  delay={300 + index * 100}
                  threshold={0.2}
                >
                  <button
                    onClick={() => handleCardClick(playbook)}
                    className="group bg-[#1A1A1A] rounded-2xl p-8 border-2 border-transparent hover:border-[#FF7A59] smooth-transition cursor-pointer text-left hover:shadow-[0_0_30px_rgba(255,122,89,0.3)] hover:-translate-y-2 gpu-accelerated w-full h-full"
                  >
                    {playbook.icon_name && (
                      <div className="text-[#00A9FF] mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#FF7A59]">
                        {getIcon(playbook.icon_name)}
                      </div>
                    )}

                    <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-[#FF7A59] transition-colors">
                      {playbook.title}
                    </h4>

                    <p className="text-gray-400 leading-relaxed">
                      {playbook.teaser}
                    </p>
                  </button>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPlaybook && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 transition-opacity duration-300 animate-fade-in"
            onClick={handleClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <div
              className="pointer-events-auto bg-[#1A1A1A] border-2 border-[#FF7A59] rounded-3xl shadow-[0_0_60px_rgba(255,122,89,0.5)] max-w-6xl w-full max-h-[90vh] overflow-y-auto transform premium-transition animate-scale-up hover:shadow-[0_0_80px_rgba(255,122,89,0.6)] gpu-accelerated"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 w-10 h-10 bg-[#FF7A59]/20 hover:bg-[#FF7A59] text-white rounded-full flex items-center justify-center smooth-transition hover:scale-110 z-10"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                <div className="flex flex-col items-center justify-center gap-3">
                  {selectedPlaybook.mvp_url ? (
                    <>
                      <a
                        href={selectedPlaybook.mvp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block w-full"
                      >
                        {selectedPlaybook.image_url ? (
                          <div className="relative overflow-hidden rounded-2xl">
                            <img
                              src={selectedPlaybook.image_url}
                              alt={selectedPlaybook.title}
                              className="w-full aspect-[4/3] object-cover shadow-2xl smooth-transition group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 smooth-transition" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 smooth-transition">
                              <div className="bg-[#00A9FF] rounded-full p-4 shadow-[0_0_30px_rgba(0,169,255,0.8)]">
                                <ExternalLink className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#00A9FF]/20 to-[#FF7A59]/20 rounded-2xl flex items-center justify-center border-2 border-[#00A9FF]/30 smooth-transition group-hover:border-[#00A9FF] group-hover:shadow-[0_0_30px_rgba(0,169,255,0.3)]">
                            {selectedPlaybook.icon_name && (
                              <div className="text-[#00A9FF] opacity-30 group-hover:opacity-50 smooth-transition">
                                {getIcon(selectedPlaybook.icon_name) && (
                                  <div style={{ transform: 'scale(4)' }}>
                                    {getIcon(selectedPlaybook.icon_name)}
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 smooth-transition">
                              <div className="bg-[#00A9FF] rounded-full p-4 shadow-[0_0_30px_rgba(0,169,255,0.8)]">
                                <ExternalLink className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          </div>
                        )}
                      </a>
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Click image to view live project
                      </p>
                    </>
                  ) : (
                    selectedPlaybook.image_url ? (
                      <img
                        src={selectedPlaybook.image_url}
                        alt={selectedPlaybook.title}
                        className="w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#00A9FF]/20 to-[#FF7A59]/20 rounded-2xl flex items-center justify-center border-2 border-[#00A9FF]/30">
                        {selectedPlaybook.icon_name && (
                          <div className="text-[#00A9FF] opacity-30">
                            {getIcon(selectedPlaybook.icon_name) && (
                              <div style={{ transform: 'scale(4)' }}>
                                {getIcon(selectedPlaybook.icon_name)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>

                <div className="space-y-6">
                  <h3 className="text-4xl font-bold text-white">
                    {selectedPlaybook.title}
                  </h3>

                  <div className="space-y-4">
                    <h4 className="text-2xl font-semibold text-[#00A9FF]">
                      The Challenge
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedPlaybook.challenge}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-2xl font-semibold text-[#00A9FF]">
                      My "Conductor" Actions
                    </h4>
                    <ul className="space-y-3">
                      {selectedPlaybook.actions.map((action, idx) => (
                        <li key={idx} className="text-gray-300 leading-relaxed flex items-start">
                          <span className="text-[#FF7A59] mr-3 mt-1.5 text-xl">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-2xl font-semibold text-[#00A9FF]">
                      The Result
                    </h4>
                    <p className="text-gray-300 leading-relaxed font-medium">
                      {selectedPlaybook.result}
                    </p>
                  </div>

                  {selectedPlaybook.mvp_url && (
                    <div className="pt-4">
                      <a
                        href={selectedPlaybook.mvp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00A9FF] to-[#0090DD] text-white text-base font-semibold rounded-full smooth-transition hover:scale-105 hover:shadow-[0_0_30px_rgba(0,169,255,0.5)] focus:outline-none focus:ring-4 focus:ring-[#00A9FF]/50"
                      >
                        <ExternalLink className="w-5 h-5" />
                        View Live MVP
                        <span className="absolute inset-0 rounded-full bg-[#00A9FF] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
    </section>
  );
}
