import { useScrollProgress } from '../hooks/useScrollProgress';

export default function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent pointer-events-none">
      <div
        className="h-full transition-all duration-200 ease-out gpu-accelerated"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #00A9FF 0%, #FF7A59 100%)',
          boxShadow: '0 0 10px rgba(0, 169, 255, 0.5)',
        }}
      />
    </div>
  );
}
