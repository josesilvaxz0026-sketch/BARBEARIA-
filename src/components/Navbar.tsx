import React from 'react';
import { Logo } from './Logo';
import { useBarber } from '../context/BarberContext';
import { Calendar, Phone, Lock, Search, Scissors, MapPin } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenMyAppointments: () => void;
  onOpenAdminLogin: () => void;
  onOpenAdminPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenMyAppointments,
  onOpenAdminLogin,
  onOpenAdminPortal,
}) => {
  const { shopInfo, isAdminLoggedIn } = useBarber();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#090a0d]/90 border-b border-neutral-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Logo & Brand Name */}
        <a href="#" className="flex items-center gap-3 group">
          <Logo size={46} className="transition-transform group-hover:scale-105 duration-300" />
          <div className="flex flex-col">
            <span className="font-heading font-black tracking-wider text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors uppercase leading-tight">
              Lorran Barros
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-neutral-400 font-medium uppercase">
              Barbearias · Belford Roxo
            </span>
          </div>
        </a>

        {/* Center / Navigation Links for desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-sm text-neutral-300 font-medium">
          <a href="#galeria" className="hover:text-amber-400 transition-colors">
            Cortes & Estilos
          </a>
          <a href="#especialista" className="hover:text-amber-400 transition-colors">
            Especialista
          </a>
          <a href="#servicos" className="hover:text-amber-400 transition-colors">
            Serviços
          </a>
          <a href="#planos-mensais" className="hover:text-amber-400 transition-colors text-amber-300/90 flex items-center gap-1">
            <span>Planos VIP</span>
          </a>
          <a href="#localizacao" className="hover:text-amber-400 transition-colors">
            Endereço
          </a>
          <button
            onClick={onOpenMyAppointments}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 text-neutral-400" />
            <span>Consultar</span>
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Direct WhatsApp link */}
          <a
            href={`https://wa.me/55${shopInfo.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Falar no WhatsApp"
            className="hidden sm:inline-flex items-center justify-center p-2 rounded-xl text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-900/40 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* Consultar agendamento (mobile only icon) */}
          <button
            onClick={onOpenMyAppointments}
            title="Meus Agendamentos"
            className="md:hidden inline-flex items-center justify-center p-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Primary CTA: Agendar Horário */}
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Horário</span>
          </button>

          {/* Discreet Admin Lock Button */}
          {isAdminLoggedIn ? (
            <button
              onClick={onOpenAdminPortal}
              title="Abrir Painel Administrativo"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Painel Ativo</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              title="Acesso da Barbearia (Restrito)"
              className="p-2 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              aria-label="Acesso Administrativo"
            >
              <Lock className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
