import React, { useState, useEffect } from 'react';
import { Property, PropertyType } from '../types';

interface PropertyCardProps {
  property: Property;
  index: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Stagger animation delay based on index
  const delayClass = index % 3 === 0 ? '' : index % 3 === 1 ? 'delay-100' : 'delay-200';

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; }
  }, [isOpen]);

  return (
    <>
        {/* Card View */}
        <div 
            onClick={() => setIsOpen(true)}
            className={`reveal ${delayClass} group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-vistura-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-vistura-primary/20 hover:-translate-y-2 cursor-pointer`}
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <img 
                src={property.image} 
                alt={property.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent opacity-90" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                {property.type === PropertyType.RENT ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-vistura-primary/90 text-white backdrop-blur-sm shadow-lg shadow-blue-500/20">
                    EN RENTA
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-vistura-accent/90 text-white backdrop-blur-sm shadow-lg shadow-emerald-500/20">
                    EN VENTA
                    </span>
                )}
                
                {property.has4kTour && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-black/40 text-white border border-white/20 backdrop-blur-md animate-pulse">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                    TOUR 4K
                    </span>
                )}
                </div>

                {/* Price Tag Overlay */}
                <div className="absolute bottom-4 right-4">
                    <span className="text-xl font-bold text-white drop-shadow-lg">{property.price}</span>
                    {property.type === PropertyType.RENT && <span className="text-gray-300 text-sm drop-shadow-md">/mes</span>}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 relative">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-vistura-primary transition-colors">{property.title}</h3>
                <p className="text-gray-400 text-sm mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {property.location}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-zinc-800 pt-4">
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-300">{property.beds}</span> Hab.
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-300">{property.baths}</span> Baños
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-300">{property.sqft}</span> m²
                </div>
                </div>
                
                {/* Action Button (appears on hover) */}
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-vistura-primary flex items-center justify-center text-white shadow-lg transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
                </div>
            </div>
        </div>

        {/* EXPANDED MODAL VIEW */}
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500"
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                ></div>

                {/* Modal Content */}
                <div className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-900 rounded-3xl overflow-y-auto overflow-x-hidden border border-zinc-800 shadow-2xl animate-[float_0.5s_ease-out_forwards] transform transition-all">
                    
                    {/* Close Button */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                        className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black text-white p-2 rounded-full backdrop-blur-md transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <div className="grid md:grid-cols-2">
                        {/* Image Side */}
                        <div className="relative h-64 md:h-auto min-h-[400px]">
                            <img 
                                src={property.image} 
                                alt={property.title} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>
                            
                            {property.has4kTour && (
                                <div className="absolute bottom-6 left-6 right-6">
                                     <button className="w-full bg-vistura-primary/90 hover:bg-vistura-primary backdrop-blur-sm text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        Iniciar Recorrido 4K
                                     </button>
                                </div>
                            )}
                        </div>

                        {/* Details Side */}
                        <div className="p-8 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex gap-2 mb-2">
                                        {property.type === PropertyType.RENT ? (
                                            <span className="text-vistura-primary text-xs font-bold uppercase tracking-wider bg-vistura-primary/10 px-2 py-1 rounded">Renta</span>
                                        ) : (
                                            <span className="text-vistura-accent text-xs font-bold uppercase tracking-wider bg-vistura-accent/10 px-2 py-1 rounded">Venta</span>
                                        )}
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-1">{property.title}</h2>
                                    <p className="text-gray-400 flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {property.location}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white">{property.price}</div>
                                    <div className="text-sm text-gray-500">
                                        {property.sqft} m²
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-6 py-6 border-y border-zinc-800 mb-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{property.beds}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Recámaras</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{property.baths}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Baños</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{property.sqft}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Metros</div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-white mb-3">Descripción</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {property.description || "Esta propiedad exclusiva cuenta con acabados de primera calidad y una ubicación inigualable. Diseñada para un estilo de vida moderno y sofisticado."}
                                </p>
                            </div>

                            {property.amenities && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-white mb-3">Servicios y Amenidades</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {property.amenities.map((amenity, i) => (
                                            <span key={i} className="bg-zinc-800 text-gray-300 text-xs px-3 py-1 rounded-full border border-zinc-700">
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stylized Dark Map Placeholder */}
                            <div className="mt-auto">
                                <h3 className="text-lg font-semibold text-white mb-3">Ubicación</h3>
                                <div className="w-full h-40 bg-zinc-800 rounded-xl overflow-hidden relative group">
                                    {/* Simulated Map UI */}
                                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-99.1332,19.4326,12,0/800x200@2x?access_token=Pk.dummy')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
                                    <div className="absolute inset-0 bg-zinc-900/40"></div>
                                    
                                    {/* Map Grid Lines Overlay (Tech feel) */}
                                    <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                                    
                                    {/* Pin Pulse */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <span className="relative flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vistura-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-vistura-primary border-2 border-white"></span>
                                        </span>
                                    </div>

                                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-gray-400">
                                        Vistura Maps v2.0
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export default PropertyCard;