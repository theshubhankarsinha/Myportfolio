import { useEffect, useState, useRef } from 'react';

export function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTime.current;

      if (timeDelta > 0) {
        const scrollDelta = currentScrollY - lastScrollY.current;
        const calculatedVelocity = Math.abs(scrollDelta / timeDelta);

        setVelocity(calculatedVelocity);
        setDirection(scrollDelta > 0 ? 'down' : 'up');

        lastScrollY.current = currentScrollY;
        lastTime.current = currentTime;
      }
    };

    const onScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return { velocity, direction };
}
