import React from 'react';
import { useBarber } from '../context/BarberContext';
import { BarberStaff } from '../types';
import { Scissors, Calendar, Award, Star } from 'lucide-react';

interface SpecialistsSectionProps {
  onSelectBarber: (barber: BarberStaff) => void;
}

export const SpecialistsSection: React.FC<SpecialistsSectionProps> = ({ onSelectBarber }) => {
  const { staff } = useBarber();

  // Filter active staff (Lorran Barros)
  const activeSpecialists = staff.filter((b) => b.active);

  return (
    <section id="especialista" className="py-16 sm:py-20 border-t border-neutral-800/60 bg-[#090a0d]/70 backdrop-blur-[1px] scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-amber-400 font-semibold tracking-wider text-xs uppercase block mb-1">
            {activeSpecialists.length > 1 ? 'Nossa Equipe de Mestres' : 'Master Barber'} · Lorran Barros Barbearias
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
            {activeSpecialists.length > 1 ? 'Os Especialistas' : 'O Especialista'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Mãos experientes, navalha calibrada e atenção exclusiva a cada detalhe do seu visual.
          </p>
        </div>

        {/* Specialist Showcase - Adaptable Grid for 1 or more barbers */}
        <div
          className={`mx-auto mb-8 ${
            activeSpecialists.length === 1
              ? 'max-w-lg'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl'
          }`}
        >
          {activeSpecialists.map((barber) => (
            <div
              key={barber.id}
              className="group relative flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-neutral-800/90 hover:border-amber-500/50 transition-all duration-300 shadow-2xl hover:shadow-amber-500/10"
            >
              {/* Badge above avatar */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-400 mb-5 uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Atendimento Exclusivo</span>
              </div>

              {/* Circular Avatar Container - Proportional, pure circle */}
              <div className="relative mb-6">
                {/* Glow ring */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-amber-600/30 blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />

                {/* Pure Circular Frame */}
                <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-amber-500/50 group-hover:border-amber-400 transition-colors shadow-2xl bg-[#090a0d] flex items-center justify-center">
                  {barber.avatarUrl ? (
                    <img
                      src={barber.avatarUrl}
                      alt={barber.name}
                      className="w-full h-full object-cover transition-transform duration-300"
                      style={{
                        transform: `scale(${barber.avatarScale || 1}) translate(${barber.avatarOffsetX || 0}%, ${barber.avatarOffsetY || 0}%)`,
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                      <Scissors className="w-12 h-12 text-amber-400" />
                    </div>
                  )}
                </div>

                {/* Active check pill */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-0.5 rounded-full bg-neutral-900 border border-emerald-500/50 text-[10px] font-bold text-emerald-400 shadow-md whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Disponível para Agendamento</span>
                </div>
              </div>

              {/* Specialist Info */}
              <h3 className="font-heading text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                {barber.name}
              </h3>
              <p className="text-xs font-bold text-amber-400 mt-1 uppercase tracking-widest">
                {barber.role}
              </p>

              {/* Rating stars */}
              <div className="flex items-center gap-1 mt-2 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-neutral-400 font-semibold ml-1.5">5.0 (Clientes Satisfeitos)</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 mt-3.5 mb-7 max-w-sm leading-relaxed">
                Referência em degradê milimétrico na régua, visagismo masculino personalizado, barboterapia tradicional com toalha quente e químicos de alta performance.
              </p>

              {/* Direct Booking CTA */}
              <button
                type="button"
                onClick={() => onSelectBarber(barber)}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar com {barber.name}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
