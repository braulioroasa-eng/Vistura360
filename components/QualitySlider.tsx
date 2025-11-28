import React, { useState } from 'react';

const QualitySlider: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(50);

  // Using a reliable high-res interior image
  const baseImage = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2600&auto=format&fit=crop";

  return (
    <div className="w-full py-20 bg-black relative overflow-hidden border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">La Diferencia Vistura</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Descubre por qué nuestra tecnología 4K True-View cambia tu experiencia remota.</p>
        </div>

        <div className="reveal delay-200 relative w-full max-w-5xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden border-4 border-zinc-800 shadow-2xl select-none group">
          
          {/* Background Image (After - The Good one) */}
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('${baseImage}')` }} 
          >
             <div className="absolute top-5 right-5 bg-vistura-accent/90 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">VISTURA 4K</div>
          </div>

          {/* Foreground Image (Before - Simulated Low Quality) */}
          <div 
            className="absolute inset-0 bg-cover bg-center border-r-2 border-white overflow-hidden"
            style={{ 
                width: `${sliderValue}%`, 
                backgroundImage: `url('${baseImage}')`,
                // Simulate bad quality with CSS filters
                filter: 'contrast(80%) brightness(70%) sepia(30%) blur(1px)'
            }}
          >
             <div className="absolute top-5 left-5 bg-black/80 backdrop-blur text-gray-300 px-4 py-2 rounded-full text-sm font-bold shadow-lg">ESTÁNDAR</div>
          </div>

          {/* Slider Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
          />

          {/* Slider Handle Visual */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"
            style={{ left: `${sliderValue}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform group-active:scale-110">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 9l-3 3 3 3m8-6l3 3-3 3" /></svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QualitySlider;