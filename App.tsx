import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import QualitySlider from './components/QualitySlider';
import ServicesSection from './components/ServicesSection';
import ChatWidget from './components/ChatWidget';
import { Property, PropertyType } from './types';

// Dummy Data with Working Unsplash Images
const SAMPLE_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Loft Moderno Centro',
    price: '$24,000 MXN',
    location: 'Centro Histórico, CDMX',
    type: PropertyType.RENT,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop', // Dark interior loft
    beds: 1,
    baths: 1,
    sqft: 85,
    has4kTour: true,
    description: "Espacio industrial reconvertido con acabados de concreto pulido e iluminación inteligente Lutron. Ideal para nómadas digitales que buscan inspiración en el corazón de la ciudad. Aislamiento acústico de grado estudio.",
    amenities: ["Smart Home", "Seguridad 24/7", "Gym", "Coworking", "Internet Fibra Óptica"]
  },
  {
    id: '2',
    title: 'Penthouse Skyline',
    price: '$12.5 MDP',
    location: 'Santa Fe, CDMX',
    type: PropertyType.SALE,
    image: 'https://images.unsplash.com/photo-1512918760513-95f6929c3c38?q=80&w=1200&auto=format&fit=crop', // Luxury apt
    beds: 3,
    baths: 3.5,
    sqft: 240,
    has4kTour: true,
    description: "Vistas panorámicas de 360 grados sobre el distrito financiero. Acabados en mármol negro Monterrey y madera de nogal. Sistema de domótica completo controlado por voz y acceso biométrico directo al elevador.",
    amenities: ["Alberca Infinita", "Helipuerto", "Spa Privado", "Cine en Casa", "Concierge"]
  },
  {
    id: '3',
    title: 'Estudio Industrial',
    price: '$18,500 MXN',
    location: 'Roma Norte, CDMX',
    type: PropertyType.RENT,
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=1200&auto=format&fit=crop', // Industrial vibe
    beds: 1,
    baths: 1,
    sqft: 65,
    has4kTour: false,
    description: "Minimalismo puro en la zona más vibrante de la ciudad. Doble altura, ventanales de piso a techo y una cocina de chef compacta con electrodomésticos Smeg negros. Perfecto para un estilo de vida urbano y dinámico.",
    amenities: ["Roof Garden Común", "Bicipuerto", "Pet Friendly", "Seguridad CCTV"]
  },
  {
    id: '4',
    title: 'Residencia Bosques',
    price: '$28 MDP',
    location: 'Bosques de las Lomas',
    type: PropertyType.SALE,
    image: 'https://images.unsplash.com/photo-1600596542815-e495d9159fb2?q=80&w=1200&auto=format&fit=crop', // Big house
    beds: 4,
    baths: 5,
    sqft: 520,
    has4kTour: true,
    description: "Arquitectura brutalista contemporánea rodeada de naturaleza. Espacios abiertos que fluyen hacia el jardín zen privado. Cuenta con paneles solares, captación pluvial y cargadores para vehículos eléctricos.",
    amenities: ["Jardín Privado", "Cava de Vinos", "Paneles Solares", "Cuarto de Servicio", "Seguridad Armada"]
  },
  {
    id: '5',
    title: 'Casa Familiar Valle',
    price: '$8.5 MDP',
    location: 'Del Valle, CDMX',
    type: PropertyType.SALE,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop', // Suburban house
    beds: 3,
    baths: 3,
    sqft: 280,
    has4kTour: true,
    description: "El equilibrio perfecto entre diseño moderno y calidez familiar. Recién remodelada con pisos de ingeniería y cocina de cuarzo. Ubicación estratégica cerca de los mejores colegios y parques de la zona.",
    amenities: ["2 Estacionamientos", "Family Room", "Bodega", "Circuito Cerrado", "Terraza"]
  },
  {
    id: '6',
    title: 'Apartamento Polanco',
    price: '$45,000 MXN',
    location: 'Polanco V Sección',
    type: PropertyType.RENT,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop', // Bright apartment
    beds: 2,
    baths: 2,
    sqft: 110,
    has4kTour: false,
    description: "Lujo discreto a pasos de Masaryk. Interiorismo de autor, totalmente amueblado con piezas de diseño. Incluye servicio de limpieza y mantenimiento. Listo para habitar inmediatamente.",
    amenities: ["Amueblado", "Valet Parking", "Gimnasio", "Business Center", "Aire Acondicionado"]
  }
];

const App: React.FC = () => {
  const [searchMode, setSearchMode] = useState<'all' | 'rent' | 'sale'>('all');
  const [searchText, setSearchText] = useState('');

  // Functional filtering logic
  const filteredProperties = SAMPLE_PROPERTIES.filter(p => {
    // Filter by Mode
    const matchesMode = 
      searchMode === 'all' ? true :
      searchMode === 'rent' ? p.type === PropertyType.RENT :
      searchMode === 'sale' ? p.type === PropertyType.SALE : true;

    // Filter by Text (Title or Location)
    const query = searchText.toLowerCase();
    const matchesText = 
      p.title.toLowerCase().includes(query) || 
      p.location.toLowerCase().includes(query);

    return matchesMode && matchesText;
  });

  return (
    <div className="min-h-screen bg-vistura-bg text-white selection:bg-vistura-primary selection:text-white">
      <Navbar />
      
      <main>
        <Hero 
          currentMode={searchMode}
          onSearchModeChange={setSearchMode}
          onSearchTextChange={setSearchText}
          searchText={searchText}
        />

        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[500px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 reveal">
             <div>
                <h2 className="text-3xl font-bold mb-2">Propiedades Destacadas</h2>
                <p className="text-gray-400">
                  {filteredProperties.length} propiedades encontradas en tu búsqueda.
                </p>
             </div>
             <div className="flex gap-2 bg-slate-900/50 p-1 rounded-full border border-white/5">
                <button 
                  onClick={() => setSearchMode('all')}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${searchMode === 'all' ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                >Todo</button>
                <button 
                   onClick={() => setSearchMode('rent')}
                   className={`px-4 py-2 rounded-full text-sm transition-all ${searchMode === 'rent' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >Renta</button>
                <button 
                   onClick={() => setSearchMode('sale')}
                   className={`px-4 py-2 rounded-full text-sm transition-all ${searchMode === 'sale' ? 'bg-vistura-accent text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                >Venta</button>
             </div>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 reveal bg-slate-900/30 rounded-3xl border border-white/5 border-dashed">
              <div className="inline-block p-4 rounded-full bg-slate-800 mb-4 text-gray-400">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No se encontraron resultados</h3>
              <p className="text-gray-400">Intenta ajustar tus filtros o buscar otra ubicación.</p>
              <button onClick={() => {setSearchText(''); setSearchMode('all');}} className="mt-4 text-vistura-primary hover:text-white underline">
                Limpiar búsqueda
              </button>
            </div>
          )}
        </section>

        <QualitySlider />
        
        <ServicesSection />
      </main>

      <footer className="bg-vistura-dark border-t border-white/5 py-12 text-center text-gray-500 text-sm reveal">
        <p>&copy; 2024 Vistura360. Todos los derechos reservados.</p>
      </footer>

      <ChatWidget />
    </div>
  );
};

export default App;