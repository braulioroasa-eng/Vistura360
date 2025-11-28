import React, { useEffect, useState } from 'react';

interface HeroProps {
  onSearchModeChange: (mode: 'all' | 'rent' | 'sale') => void;
  currentMode: 'all' | 'rent' | 'sale';
  onSearchTextChange: (text: string) => void;
  searchText: string;
}

const Hero: React.FC<HeroProps> = ({ onSearchModeChange, currentMode, onSearchTextChange, searchText }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 opacity-60">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}
          poster="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop"
        >
          {/* Reliable Pexels Video URL - Architectural Walkthrough */}
          <source src="https://videos.pexels.com/video-files/7578546/7578546-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          Su navegador no soporta video HTML5.
        </video>
        
        {/* Gradients to blend video with black background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h1 className="reveal text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 drop-shadow-2xl">
          Vistura<span className="text-vistura-primary">360</span>:
          <br />
          <span className="text-4xl md:text-6xl text-gray-200 font-light mt-2 block">Habita antes de llegar.</span>
        </h1>
        
        <p className="reveal delay-100 text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
          El futuro del sector inmobiliario. Explora propiedades en venta y renta con inmersión total.
        </p>

        {/* Search Component */}
        <div className="reveal delay-200 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-2 rounded-3xl max-w-3xl mx-auto shadow-2xl hover:shadow-vistura-primary/20 transition-shadow duration-300">
          <div className="flex flex-col md:flex-row gap-2">
            
            {/* Mode Toggles */}
            <div className="flex bg-black/50 rounded-2xl p-1 shrink-0">
              <button 
                onClick={() => onSearchModeChange('rent')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform ${currentMode === 'rent' ? 'bg-vistura-primary text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                RENTAR
              </button>
              <button 
                onClick={() => onSearchModeChange('sale')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform ${currentMode === 'sale' ? 'bg-vistura-accent text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                COMPRAR
              </button>
            </div>

            {/* Input */}
            <div className="flex-1 relative group">
                <input 
                    type="text" 
                    value={searchText}
                    onChange={(e) => onSearchTextChange(e.target.value)}
                    placeholder="Busca por Ciudad, Colonia o Título..." 
                    className="w-full h-full bg-transparent text-white px-4 py-3 md:py-0 focus:outline-none placeholder-gray-400 text-lg transition-colors group-hover:placeholder-gray-300"
                />
            </div>

            {/* Search Button (Visual mainly, since input filters real-time) */}
            <button className="bg-white text-black px-8 py-3 rounded-2xl font-bold hover:bg-gray-200 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Buscar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;