import React, { useState } from 'react';
import { useBarber } from '../context/BarberContext';
import { Appointment } from '../types';
import { Search, X, Calendar, Clock, Phone, AlertCircle, CheckCircle2, Scissors, Ban } from 'lucide-react';
import { Logo } from './Logo';

interface MyAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { getAppointmentsByPhone, cancelAppointment, generateWhatsAppLink } = useBarber();
  const [phoneSearch, setPhoneSearch] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [results, setResults] = useState<Appointment[]>([]);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneSearch.trim()) return;
    const res = getAppointmentsByPhone(phoneSearch);
    setResults(res);
    setHasSearched(true);
    setCancelSuccessMsg('');
  };

  const handleCancel = (id: string, code: string) => {
    if (window.confirm(`Tem certeza que deseja cancelar o agendamento #${code}? A vaga será liberada.`)) {
      cancelAppointment(id);
      setCancelSuccessMsg(`Agendamento #${code} cancelado com sucesso.`);
      // refresh search list
      setResults((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'cancelado' } : a))
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f1117] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#13161f]">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div>
              <h2 className="font-heading text-base font-bold text-white uppercase tracking-wide">
                Consultar Meus Agendamentos
              </h2>
              <p className="text-[11px] text-neutral-400">
                Digite seu número de telefone ou WhatsApp para buscar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="tel"
                placeholder="DDD + Seu número (ex: 21979669281)"
                value={phoneSearch}
                onChange={(e) => setPhoneSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-white placeholder-neutral-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </button>
          </form>

          {cancelSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{cancelSuccessMsg}</span>
            </div>
          )}

          {/* Results list */}
          {hasSearched && (
            <div className="space-y-3 pt-2">
              {results.length === 0 ? (
                <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl text-neutral-400 text-xs">
                  Nenhum agendamento encontrado para este número. Verifique o DDD e tente novamente.
                </div>
              ) : (
                results.map((apt) => {
                  const isCancelled = apt.status === 'cancelado';
                  const isDone = apt.status === 'concluido';
                  return (
                    <div
                      key={apt.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCancelled
                          ? 'bg-neutral-900/30 border-neutral-800 opacity-60'
                          : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-amber-400">
                            #{apt.code}
                          </span>
                          <h4 className="font-heading font-bold text-sm text-white mt-0.5">
                            {apt.serviceName}
                          </h4>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            isCancelled
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : isDone
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300 my-2.5">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{apt.date.split('-').reverse().join('/')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{apt.time} ({apt.durationMinutes} min)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Scissors className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{apt.barberName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-accent font-bold text-amber-400">
                          <span>R$ {apt.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>

                      {!isCancelled && !isDone && (
                        <div className="pt-2.5 mt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                          <a
                            href={generateWhatsAppLink(apt)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Abrir no WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleCancel(apt.id, apt.code)}
                            className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                          >
                            <Ban className="w-3 h-3" />
                            <span>Cancelar Horário</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
