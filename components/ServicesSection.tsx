import React from 'react';

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-gradient-to-br from-black to-zinc-900 relative overflow-hidden border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <div className="reveal">
                <span className="text-vistura-primary font-bold tracking-wider uppercase text-sm mb-2 block">Para Propietarios y Agentes</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Vende más Rápido. <br/> Renta Antes.</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Las propiedades con Tours Vistura 4K reciben un 300% más de interacción. Nosotros nos encargamos de la fotografía, el alojamiento y los prospectos.
                </p>
                
                <ul className="space-y-4 mb-8">
                    {['Fotografía Profesional 4K HDR', 'Recorridos 3D Inmersivos', 'Descripciones Mejoradas por IA', 'Posicionamiento Premium'].map((item, i) => (
                        <li key={i} className="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
                            <div className="w-6 h-6 rounded-full bg-vistura-accent/20 flex items-center justify-center mr-3 text-vistura-accent">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            {item}
                        </li>
                    ))}
                </ul>

                <button className="bg-vistura-primary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-blue-900/50 hover:shadow-blue-500/50 hover:-translate-y-1">
                    Agendar Sesión
                </button>
            </div>

            <div className="relative reveal delay-200">
                <div className="absolute -inset-4 bg-vistura-accent/10 rounded-3xl blur-2xl animate-pulse"></div>
                <img 
                    src="https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=2669&auto=format&fit=crop" 
                    alt="Camera equipment" 
                    className="relative rounded-2xl shadow-2xl border border-zinc-800 w-full transform rotate-3 hover:rotate-0 transition-transform duration-500 animate-float"
                />
            </div>

        </div>
      </div>
    </section>
  );
};

export default ServicesSection;