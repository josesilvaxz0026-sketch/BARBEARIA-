import React from 'react';
import { Logo } from './Logo';
import { useBarber } from '../context/BarberContext';
import { MapPin, Phone, Clock, Lock, ExternalLink, Calendar } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenMyAppointments: () => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenMyAppointments,
  onOpenAdminLogin,
}) => {
  const { shopInfo, schedule } = useBarber();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${shopInfo.address}, ${shopInfo.neighborhood}, ${shopInfo.city}`
  )}`;

  return (
    <footer className="bg-[#07080a]/90 backdrop-blur-[2px] border-t border-neutral-800/80 text-neutral-400 text-xs pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800/80">
          {/* Col 1: Brand & Logo */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <Logo size={46} />
              <div>
                <h3 className="font-heading font-black text-white text-base tracking-wider uppercase">
                  Lorran Barros
                </h3>
                <p className="text-[11px] text-amber-400 uppercase tracking-widest">
                  Barbearias
                </p>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Tradição, modernidade e corte impecável. Atendimento com agendamento online inteligente e sem filas.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar Agora</span>
              </button>
            </div>
          </div>

          {/* Col 2: Endereço & Localização */}
          <div id="localizacao" className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Localização
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2 text-neutral-300">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  {shopInfo.address}<br />
                  {shopInfo.neighborhood}, {shopInfo.city}
                </span>
              </p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-[11px] font-semibold transition-colors mt-1"
              >
                <span>Ver rota no Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 3: Horários de Atendimento */}
          <div id="horarios" className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Horários de Atendimento
            </h4>
            <ul className="space-y-1.5 text-xs">
              {schedule.map((day) => (
                <li key={day.dayOfWeek} className="flex justify-between py-0.5 border-b border-neutral-900">
                  <span className="text-neutral-400">{day.dayName}:</span>
                  <span className="font-medium text-neutral-200">
                    {day.enabled ? `${day.openTime} às ${day.closeTime}` : 'Fechado'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contato & Links Rápidos */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Contato & WhatsApp
            </h4>
            <p className="text-xs text-neutral-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{shopInfo.whatsappFormatted}</span>
            </p>
            <a
              href={`https://wa.me/55${shopInfo.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-900/50 text-emerald-400 text-xs font-semibold transition-colors"
            >
              <span>Falar direto pelo WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="pt-2">
              <button
                onClick={onOpenMyAppointments}
                className="text-xs text-amber-400 hover:underline block"
              >
                Já agendou? Consultar agendamento
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar with Copyright & Discreet Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Lorran Barros Barbearias. Todos os direitos reservados.</p>

          {/* Discreet Admin Login Link */}
          <button
            onClick={onOpenAdminLogin}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <Lock className="w-3.5 h-3.5 group-hover:text-amber-400" />
            <span>Área da Barbearia (Gestão & Estoque)</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
