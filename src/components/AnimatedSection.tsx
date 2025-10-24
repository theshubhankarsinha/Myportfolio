import { ReactNode } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-up' | 'blur-in';
  delay?: number;
  threshold?: number;
}

export default function AnimatedSection({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.2,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce: true });

  const animationClasses = {
    'fade-up': isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-12',
    'fade-down': isVisible ? 'animate-fade-in-down' : 'opacity-0 -translate-y-12',
    'fade-left': isVisible ? 'animate-fade-in-left' : 'opacity-0 translate-x-12',
    'fade-right': isVisible ? 'animate-fade-in-right' : 'opacity-0 -translate-x-12',
    'scale-up': isVisible ? 'animate-scale-up' : 'opacity-0 scale-90',
    'blur-in': isVisible ? 'animate-blur-in' : 'opacity-0 blur-sm',
  };

  return (
    <div
      ref={ref}
      className={`will-animate ${animationClasses[animation]} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
