import { useState, useEffect } from 'react';
import { Feather, Sparkles, BookOpen, Coffee, ArrowRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function BlogSection() {
  const [currentTopic, setCurrentTopic] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const topics = [
    'Product Strategy & Innovation',
    'Leadership & Team Building',
    'Tech Trends & Insights',
    'Startup Journey Stories',
    'Growth & Scaling Tips'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTopic((prev) => (prev + 1) % topics.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <section id="blog" className="relative py-32 bg-gradient-to-b from-[#0A0A0A] via-[#121212] to-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00A9FF] rounded-full filter blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF7A59] rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00A9FF] rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <AnimatedSection className="relative max-w-6xl mx-auto px-6 text-center">
        <div className="mb-8 inline-block">
          <div className="relative">
            <Coffee className="w-16 h-16 text-[#00A9FF] mb-4 mx-auto animate-bounce" style={{ animationDuration: '2s' }} />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#FF7A59] animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00A9FF] via-[#00D4FF] to-[#FF7A59] bg-clip-text text-transparent">
          Brewing Fresh Content
        </h2>

        <p className="text-2xl text-gray-300 mb-4 font-light">
          Watch this space for insights & stories
        </p>

        <div className="flex items-center justify-center gap-3 mb-12 h-12">
          <Feather className="w-6 h-6 text-[#FF7A59] animate-pulse" />
          <div className="text-xl text-[#00A9FF] font-medium min-w-[300px] text-center">
            <span className="inline-block animate-fade-in" key={currentTopic}>
              {topics[currentTopic]}
            </span>
          </div>
          <BookOpen className="w-6 h-6 text-[#FF7A59] animate-pulse" />
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="group relative px-4 py-3 bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-lg hover:border-[#00A9FF] smooth-transition hover:scale-105 cursor-default"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#00A9FF]/0 via-[#00A9FF]/10 to-[#00A9FF]/0 opacity-0 group-hover:opacity-100 smooth-transition rounded-lg" />
                <span className="relative text-sm text-gray-400 group-hover:text-white smooth-transition">
                  {topic}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-[#00A9FF]/50 smooth-transition">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#FF7A59]" />
              <h3 className="text-xl font-semibold text-white">Get Notified</h3>
              <Sparkles className="w-5 h-5 text-[#FF7A59]" />
            </div>

            <p className="text-gray-400 text-sm mb-6">
              Be the first to read new posts when they drop
            </p>

            {subscribed ? (
              <div className="py-4 px-6 bg-gradient-to-r from-[#00A9FF]/20 to-[#FF7A59]/20 border border-[#00A9FF] rounded-xl">
                <p className="text-[#00A9FF] font-medium">
                  Thanks! We'll notify you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00A9FF] smooth-transition"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#00A9FF] to-[#0090DD] text-white font-medium rounded-xl hover:scale-105 smooth-transition shadow-lg shadow-[#00A9FF]/30 flex items-center gap-2 group"
                >
                  <span>Notify Me</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 smooth-transition" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="text-gray-500 text-sm">
          <p>In the meantime, feel free to explore my portfolio and experience</p>
        </div>
      </AnimatedSection>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) translateX(10px);
            opacity: 0.6;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
