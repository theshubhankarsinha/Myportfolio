import { Mail, Linkedin, Github, Send } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function ContactSection() {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = 'mailto:theshubhankarsinha@gmail.com';
  };

  return (
    <section id="contact" className="relative py-32 bg-gradient-to-b from-[#0A0A0A] to-[#121212] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#00A9FF]/50 to-transparent" />
      </div>

      <AnimatedSection className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00A9FF] via-[#00D4FF] to-[#FF7A59] bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Always open to discussing product strategy, innovation opportunities, or just having a great conversation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <button
            onClick={handleEmailClick}
            className="group relative px-8 py-10 bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl hover:border-[#00A9FF] smooth-transition hover:scale-105 text-center block cursor-pointer w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00A9FF]/0 via-[#00A9FF]/5 to-[#00A9FF]/0 opacity-0 group-hover:opacity-100 smooth-transition rounded-2xl pointer-events-none" />
            <div className="relative pointer-events-none">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#00A9FF]/10 rounded-full flex items-center justify-center group-hover:bg-[#00A9FF]/20 smooth-transition">
                <Mail className="w-8 h-8 text-[#00A9FF]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 smooth-transition">
                Drop me a line
              </p>
            </div>
          </button>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-10 bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl hover:border-[#00A9FF] smooth-transition hover:scale-105 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00A9FF]/0 via-[#00A9FF]/5 to-[#00A9FF]/0 opacity-0 group-hover:opacity-100 smooth-transition rounded-2xl" />
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#00A9FF]/10 rounded-full flex items-center justify-center group-hover:bg-[#00A9FF]/20 smooth-transition">
                <Linkedin className="w-8 h-8 text-[#00A9FF]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">LinkedIn</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 smooth-transition">
                Let's network
              </p>
            </div>
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-10 bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl hover:border-[#00A9FF] smooth-transition hover:scale-105 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00A9FF]/0 via-[#00A9FF]/5 to-[#00A9FF]/0 opacity-0 group-hover:opacity-100 smooth-transition rounded-2xl" />
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#00A9FF]/10 rounded-full flex items-center justify-center group-hover:bg-[#00A9FF]/20 smooth-transition">
                <Github className="w-8 h-8 text-[#00A9FF]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">GitHub</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 smooth-transition">
                Check out my code
              </p>
            </div>
          </a>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800/60 to-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-full">
            <Send className="w-5 h-5 text-[#FF7A59]" />
            <p className="text-gray-400">
              Response time: <span className="text-white font-medium">Usually within 24 hours</span>
            </p>
          </div>
        </div>
      </AnimatedSection>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00A9FF]/30 to-transparent" />
    </section>
  );
}
