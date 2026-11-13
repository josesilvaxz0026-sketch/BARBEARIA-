import React from 'react';
import { useBarber } from '../context/BarberContext';
import { MapPin, Phone, ShieldCheck, Sparkles, Coffee, Wifi, Scissors, ExternalLink, Calendar } from 'lucide-react';

interface ShopFeaturesProps {
  onOpenBooking: () => void;
}

export const ShopFeatures: React.FC<ShopFeaturesProps> = ({ onOpenBooking }) => {
  const { shopInfo, staff } = useBarber();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${shopInfo.address}, ${shopInfo.neighborhood}, ${shopInfo.city}`
  )}`;

  return (
    <section className="py-16 sm:py-20 border-t border-neutral-800/60 bg-[#0b0c10]/75 backdrop-blur-[1px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Features / Differentials */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-amber-400 font-semibold tracking-wider text-xs uppercase block mb-1">
              Experiência Lorran Barros Barbearias
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
              Mais que um corte, um momento seu
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              Estrutura pensada para o seu conforto, pontualidade no horário marcado e atendimento personalizado.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-white uppercase">Corte Preciso</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Degradê limpo, alinhamento simétrico e acabamento impecável na navalha.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-white uppercase">Barboterapia</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Toalha quente com óleos essenciais para abrir os poros e relaxar a pele.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-white uppercase">Bebidas & Conforto</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Ambiente climatizado, café fresco e cervejas geladas disponíveis.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-white uppercase">Biossegurança</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Lâminas e golas 100% descartáveis e materiais rigorosamente esterilizados.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Banner Card */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-[#131620] to-neutral-900 border border-neutral-800 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-widest inline-block">
              Fácil Acesso
            </span>
            <h3 className="font-heading text-2xl font-black text-white uppercase">
              Venha Conhecer a Lorran Barros Barbearias
            </h3>
            <p className="text-sm text-neutral-300 max-w-xl">
              {shopInfo.address}, {shopInfo.neighborhood}, {shopInfo.city}. Localizada no coração de Areia Branca com estacionamento e fácil acesso.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-neutral-700"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Abrir no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </a>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Agora</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
