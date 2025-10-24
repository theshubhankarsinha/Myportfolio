export default function TrainAnimation() {
  return (
    <div className="relative w-full h-64 overflow-visible bg-transparent mt-16">
      <div className="train-container">
        <div className="flex items-end gap-1">
          <div className="bullet-coach">
            <div className="w-36 h-24 bg-gradient-to-r from-[#FF7A59] to-[#E66649] rounded-l-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
              <div className="absolute top-3 left-3 right-3 bottom-3 border-2 border-white/20 rounded"></div>
              <span className="text-white font-bold text-2xl z-10 tracking-wide">Journey</span>
            </div>
            <div className="flex justify-around px-6 mt-0.5">
              <div className="w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600"></div>
              <div className="w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600"></div>
            </div>
          </div>

          <div className="bullet-coach">
            <div className="w-36 h-24 bg-gradient-to-r from-[#00A9FF] to-[#0090DD] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
              <div className="absolute top-3 left-3 right-3 bottom-3 border-2 border-white/20 rounded"></div>
              <span className="text-white font-bold text-2xl z-10 tracking-wide">To</span>
            </div>
            <div className="flex justify-around px-6 mt-0.5">
              <div className="w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600"></div>
              <div className="w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600"></div>
            </div>
          </div>

          <div className="bullet-coach">
            <div className="w-36 h-24 bg-gradient-to-r from-[#FF7A59] to-[#E66649] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
              <div className="absolute top-3 left-3 right-3 bottom-3 border-2 border-white/20 rounded"></div>
              <span className="text-white font-bold text-2xl z-10 tracking-wide">Excellence</span>
            </div>
            <div className="flex justify-around px-6 mt-0.5">
              <div className="w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600"></div>
              <div className="w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600"></div>
            </div>
          </div>

          <div className="bullet-engine relative">
            <div className="smoke-container absolute -top-16 right-8 w-32 h-32 z-50">
              <div className="smoke-puff smoke-1"></div>
              <div className="smoke-puff smoke-2"></div>
              <div className="smoke-puff smoke-3"></div>
              <div className="smoke-puff smoke-4"></div>
              <div className="smoke-puff smoke-5"></div>
            </div>
            <div className="relative">
              <div className="absolute -top-12 right-8 w-6 h-16 bg-gray-800 rounded-t-lg z-40">
                <div className="absolute top-0 left-0 right-0 h-3 bg-gray-900 rounded-t-lg"></div>
              </div>
              <div className="w-28 h-24 bg-gradient-to-r from-[#00A9FF] to-[#0090DD] relative overflow-hidden"
                   style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                <div className="absolute top-1/3 left-4 right-4 h-8 bg-white/10 backdrop-blur-sm rounded"></div>
                <div className="absolute top-2 left-4 w-4 h-6 bg-gray-700 rounded-sm"></div>
              </div>
              <div className="absolute bottom-2 left-8 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex justify-around px-4 mt-0.5">
              <div className="w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600"></div>
              <div className="w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[52px] left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent">
        <div className="absolute inset-0 flex justify-around items-center">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="w-3 h-1 bg-gray-700"></div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes trainMove {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100vw);
          }
        }

        @keyframes smokePuff {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.95;
          }
          40% {
            transform: translateY(-50px) translateX(15px) scale(2);
            opacity: 0.85;
          }
          70% {
            transform: translateY(-90px) translateX(25px) scale(3);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-130px) translateX(30px) scale(4);
            opacity: 0;
          }
        }

        .train-container {
          display: inline-flex;
          animation: trainMove 10s linear infinite;
          position: relative;
          z-index: 10;
        }

        .smoke-container {
          position: absolute;
          pointer-events: none;
        }

        .smoke-puff {
          position: absolute;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, #d0d0d0 0%, #b8b8b8 20%, #a0a0a0 35%, #888888 55%, #707070 75%, rgba(96, 96, 96, 0.3) 90%, transparent 100%);
          border-radius: 50%;
          box-shadow:
            0 0 20px rgba(192, 192, 192, 0.6),
            0 0 35px rgba(160, 160, 160, 0.4),
            0 0 50px rgba(128, 128, 128, 0.3),
            inset 0 0 15px rgba(200, 200, 200, 0.5);
          filter: blur(2px);
          animation: smokePuff 4.5s ease-out infinite;
        }

        .smoke-1 {
          animation-delay: 0s;
        }

        .smoke-2 {
          animation-delay: 0.7s;
        }

        .smoke-3 {
          animation-delay: 1.4s;
        }

        .smoke-4 {
          animation-delay: 2.1s;
        }

        .smoke-5 {
          animation-delay: 2.8s;
        }

        @media (max-width: 768px) {
          .bullet-engine {
            transform: scale(0.8);
          }
          .bullet-coach {
            transform: scale(0.8);
          }
        }

        @media (max-width: 480px) {
          .bullet-engine {
            transform: scale(0.6);
          }
          .bullet-coach {
            transform: scale(0.6);
          }
        }
      `}</style>
    </div>
  );
}
