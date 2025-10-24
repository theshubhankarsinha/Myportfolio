import { useState, useEffect } from 'react';
import { ExternalLink, User, ChevronDown, ChevronUp } from 'lucide-react';
import { getTestimonials, type Testimonial } from '../lib/testimonialService';
import AnimatedSection from './AnimatedSection';

const TRUNCATE_LENGTH = 180;

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    const data = await getTestimonials();
    setTestimonials(data);
    setLoading(false);
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const shouldTruncate = (quote: string) => quote.length > TRUNCATE_LENGTH;

  const getTruncatedQuote = (quote: string) => {
    if (quote.length <= TRUNCATE_LENGTH) return quote;
    return quote.substring(0, TRUNCATE_LENGTH).trim() + '...';
  };

  if (loading) {
    return null;
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1A1A1A] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection animation="fade-up" delay={0}>
          <h2 className="text-5xl font-bold text-white text-center mb-4">
            The Ovation
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            What my mentors, managers, and colleagues have to say.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection
              key={testimonial.id}
              animation="fade-up"
              delay={index * 0.1}
            >
              <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-gray-800 hover:border-[#00A9FF]/50 transition-all duration-300 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  {testimonial.profile_image_url ? (
                    <img
                      src={testimonial.profile_image_url}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#00A9FF]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-[#00A9FF] flex items-center justify-center">
                      <User className="w-8 h-8 text-[#00A9FF]" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.title}</p>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    "{expandedIds.has(testimonial.id)
                      ? testimonial.quote
                      : getTruncatedQuote(testimonial.quote)}"
                  </p>

                  {shouldTruncate(testimonial.quote) && (
                    <button
                      onClick={() => toggleExpanded(testimonial.id)}
                      className="inline-flex items-center gap-2 text-[#00A9FF] hover:text-[#0090DD] font-medium transition-colors duration-200 mb-4"
                    >
                      {expandedIds.has(testimonial.id) ? (
                        <>
                          Read Less
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Read More
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {testimonial.linkedin_url && (
                  <a
                    href={testimonial.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#00A9FF] text-white font-semibold rounded-lg hover:bg-[#0090DD] transition-all duration-200 hover:scale-105 w-fit"
                  >
                    View on LinkedIn
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
