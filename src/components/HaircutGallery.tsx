import React, { useState } from 'react';
import { HAIRCUT_GALLERY, HaircutItem } from '../data/initialData';
import { useBarber } from '../context/BarberContext';
import { BarberService } from '../types';
import { Scissors, Sparkles, ZoomIn, X, Calendar, ArrowRight } from 'lucide-react';

interface HaircutGalleryProps {
  onSelectServiceById: (serviceId: string) => void;
}

export const HaircutGallery: React.FC<HaircutGalleryProps> = ({ onSelectServiceById }) => {
  const { services } = useBarber();
  const [selectedPhoto, setSelectedPhoto] = useState<HaircutItem | null>(null);

  return (
    <section id="galeria" className="py-16 sm:py-20 border-t border-neutral-800/60 bg-[#0b0c10]/75 backdrop-blur-[1px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-amber-400 font-semibold tracking-wider text-xs uppercase block mb-1">
              Portfólio Lorran Barros Barbearias
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
              Galeria de Cortes & Estilos
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Confira os estilos mais pedidos na barbearia, executados com perfeição por Lorran Barros. Escolha a sua referência e garanta o seu horário.
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HAIRCUT_GALLERY.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-neutral-900/60 border border-neutral-800/80 overflow-hidden hover:border-amber-500/50 hover:bg-neutral-900 transition-all duration-300 shadow-xl"
            >
              {/* Photo Container */}
              <div
                onClick={() => setSelectedPhoto(item)}
                className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950 cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />

                {/* Tag */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-900/90 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Zoom hover indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="p-2.5 rounded-full bg-neutral-900/90 text-white border border-neutral-700 shadow-lg">
                    <ZoomIn className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="font-heading text-base font-bold text-white group-hover:text-amber-400 transition-colors mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Direct Action */}
                <button
                  type="button"
                  onClick={() => onSelectServiceById(item.serviceId)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 hover:border-amber-500 text-amber-300 hover:text-neutral-950 font-bold text-xs uppercase tracking-wide transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agendar este Estilo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl cursor-default"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/60 hover:bg-black text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full max-h-[60vh] sm:max-h-[65vh] bg-neutral-950 flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full max-h-[60vh] sm:max-h-[65vh] object-contain"
              />
            </div>

            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {selectedPhoto.category} · {selectedPhoto.tag}
                </span>
                <h3 className="font-heading text-xl font-bold text-white mt-0.5">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-md">
                  {selectedPhoto.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const srvId = selectedPhoto.serviceId;
                  setSelectedPhoto(null);
                  onSelectServiceById(srvId);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar este Corte</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
