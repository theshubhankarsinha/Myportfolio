import { useState, useEffect } from 'react';
import { type HeroFeaturedProject } from '../lib/heroProjectService';

interface HeroCarouselProps {
  projects: HeroFeaturedProject[];
}

export default function HeroCarousel({ projects }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (projects.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
        setIsTransitioning(false);
      }, 300);
    }, 7000);

    return () => clearInterval(interval);
  }, [projects.length]);

  if (projects.length === 0) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#0A0A0A] border-2 border-[#00A9FF]/20 flex items-center justify-center">
        <p className="text-white/40 text-lg">No featured projects</p>
      </div>
    );
  }

  const currentProject = projects[currentIndex];

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,169,255,0.3)] border-2 border-[#00A9FF]/30 hover:border-[#00A9FF]/50 hover:shadow-[0_0_60px_rgba(0,169,255,0.5)] transition-all duration-500">
      <div className="relative w-full h-full overflow-hidden">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              pointerEvents: index === currentIndex ? 'auto' : 'none',
            }}
          >
            {project.image_url ? (
              project.mvp_url ? (
                <a
                  href={project.mvp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full group"
                  aria-label={`View ${project.title} live project`}
                >
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </a>
              ) : (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#0A0A0A]" />
            )}
          </div>
        ))}
      </div>

      {currentProject && (
        <div
          className={`absolute top-4 left-4 z-30 transition-opacity duration-500 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="backdrop-blur-md bg-black/40 px-5 py-2.5 rounded-full border border-white/10 shadow-lg">
            <p className="text-xs md:text-sm font-semibold text-white/90 tracking-wide">
              <span className="text-[#00A9FF]">Featured:</span> {currentProject.title}
            </p>
          </div>
        </div>
      )}

      {projects.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 300);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-[#FF7A59] w-12 shadow-lg shadow-[#FF7A59]/50'
                  : 'bg-white/30 w-6 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
