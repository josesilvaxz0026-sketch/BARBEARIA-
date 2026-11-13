import React from 'react';
import { Logo } from './Logo';
import { useBarber } from '../context/BarberContext';
import { Calendar, Phone, MapPin, Clock, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenMyAppointments: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenMyAppointments }) => {
  const { shopInfo, isDateOpen } = useBarber();

  const todayStr = new Date().toISOString().split('T')[0];
  const isOpenToday = isDateOpen(todayStr);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 lg:py-24 border-b border-neutral-800/60 bg-gradient-to-b from-transparent via-[#0e1015]/40 to-transparent">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-neutral-700/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Main Luxury Logo Emblem - Transparent PNG with perfect centering and balance */}
        <div className="flex justify-center items-center mb-6 max-w-full px-2">
          <Logo
            withGlow
            className="h-28 sm:h-36 md:h-44 lg:h-48 max-w-[290px] sm:max-w-[390px] md:max-w-[460px] transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Status, Location & Contact Row with clear spacing */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-neutral-400 mb-6 font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-[11px] font-semibold text-neutral-300 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${isOpenToday ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isOpenToday ? 'Aberto Hoje' : 'Consultar Horários'}</span>
          </div>
          <span className="text-neutral-700 hidden sm:inline">·</span>
          <span className="inline-flex items-center gap-1.5 text-neutral-300">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Areia Branca, Belford Roxo</span>
          </span>
          <span className="text-neutral-700 hidden sm:inline">·</span>
          <span className="inline-flex items-center gap-1.5 text-neutral-300">
            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{shopInfo.whatsappFormatted}</span>
          </span>
        </div>

        {/* Big Headline */}
        <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase max-w-3xl mx-auto leading-tight sm:leading-none mb-5">
          O seu estilo no <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">mais alto nível</span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Degradê navalhado, barboterapia tradicional com toalha quente e químicos especializados. Escolha seu barbeiro, selecione seu horário e garanta sua vaga sem filas.
        </p>

        {/* Primary Booking & Search Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-10">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-extrabold text-sm tracking-wide shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Meu Horário</span>
          </button>

          <button
            onClick={onOpenMyAppointments}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700/80 font-semibold text-sm transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Ver Meu Agendamento</span>
          </button>
        </div>

        {/* Confidence highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-800/60 max-w-2xl mx-auto text-left">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-neutral-900/40 border border-neutral-800/40">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-neutral-300 font-medium">Vagas controladas em tempo real</span>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-neutral-900/40 border border-neutral-800/40">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-neutral-300 font-medium">Confirmação direta no WhatsApp</span>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-neutral-900/40 border border-neutral-800/40">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-neutral-300 font-medium">Sem espera e sem atrasos</span>
          </div>
        </div>
      </div>
    </section>
  );
};
