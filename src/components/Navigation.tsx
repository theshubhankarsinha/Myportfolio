import { useState, useEffect } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);

        const sections = ['home', 'about', 'experience', 'skills', 'testimonials', 'blog', 'contact'];
        const scrollPosition = window.scrollY + 200;

        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const offsetTop = element.offsetTop;
            const offsetBottom = offsetTop + element.offsetHeight;

            if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
              setActiveSection(sectionId);
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
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About Me', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  const isActive = (href: string) => {
    const sectionId = href.replace('#', '');
    return activeSection === sectionId;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 smooth-transition gpu-accelerated ${
      scrolled
        ? 'bg-[#121212]/95 backdrop-blur-md border-b border-gray-800 shadow-lg shadow-[#00A9FF]/10'
        : 'bg-[#121212]/80 backdrop-blur-md border-b border-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-[#00A9FF] text-xl font-bold tracking-wide hover:scale-105 transition-transform duration-200 cursor-pointer">
            Shubhankar Sinha
          </div>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium smooth-transition hover:scale-105 ${
                    active
                      ? 'bg-[#00A9FF] text-white shadow-lg shadow-[#00A9FF]/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#FF7A59] rounded-full animate-expand" />
                  )}
                </a>
              );
            })}
          </div>

          <style>{`
            @keyframes expand {
              from {
                width: 0;
                opacity: 0;
              }
              to {
                width: 2rem;
                opacity: 1;
              }
            }
            .animate-expand {
              animation: expand 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}</style>

          <button className="md:hidden text-gray-300 hover:text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
