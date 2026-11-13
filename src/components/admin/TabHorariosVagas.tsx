import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import { DaySchedule } from '../../types';
import {
  Clock,
  Users,
  Check,
  Ban,
  Sliders,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from 'lucide-react';

export const TabHorariosVagas: React.FC = () => {
  const { shopInfo, schedule, updateDaySchedule, updateSlotCapacityOverride, getAvailableSlotsForDate } =
    useBarber();

  const [activeDayOfWeek, setActiveDayOfWeek] = useState<number>(1); // Default Segunda
  const [successNotice, setSuccessNotice] = useState<string>('');

  const currentDayConfig = schedule.find((s) => s.dayOfWeek === activeDayOfWeek) || schedule[0];

  const handleUpdate = (updates: Partial<DaySchedule>) => {
    updateDaySchedule(activeDayOfWeek, updates);
    showNotice('Configurações de horários e vagas atualizadas com sucesso!');
  };

  const showNotice = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(''), 3500);
  };

  // Generate slots for preview and individual override
  const [startH, startM] = currentDayConfig.openTime.split(':').map(Number);
  const [closeH, closeM] = currentDayConfig.closeTime.split(':').map(Number);
  const interval = currentDayConfig.slotIntervalMinutes || 30;

  const previewSlots: string[] = [];
  const startMin = startH * 60 + startM;
  const closeMin = closeH * 60 + closeM;

  for (let m = startMin; m < closeMin; m += interval) {
    const hh = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    previewSlots.push(`${hh}:${mm}`);
  }

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-900 to-[#12151e] border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider block mb-1">
            Controle Total de Capacidade
          </span>
          <h2 className="font-heading text-xl font-black text-white uppercase">
            Horários de Funcionamento & Vagas por Horário
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Configure quantas vagas simultâneas a {shopInfo.name} disponibiliza para agendamento online. Quando os clientes marcam pelo site, as vagas são consumidas automaticamente.
          </p>
        </div>
      </div>

      {successNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Day of Week Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {schedule.map((day) => (
          <button
            key={day.dayOfWeek}
            type="button"
            onClick={() => setActiveDayOfWeek(day.dayOfWeek)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeDayOfWeek === day.dayOfWeek
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            <span>{day.dayName}</span>
            <span
              className={`w-2 h-2 rounded-full ${day.enabled ? 'bg-emerald-400' : 'bg-neutral-600'}`}
            />
          </button>
        ))}
      </div>

      {/* Main Configuration Card for the Selected Day */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-6">
        {/* Header Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
          <div>
            <h3 className="font-heading text-lg font-bold text-white uppercase">
              {currentDayConfig.dayName}
            </h3>
            <p className="text-xs text-neutral-400">
              {currentDayConfig.enabled
                ? 'Barbearia aberta para agendamentos neste dia'
                : 'Barbearia fechada neste dia (nenhum horário disponível para clientes)'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleUpdate({ enabled: !currentDayConfig.enabled })}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              currentDayConfig.enabled
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                : 'bg-rose-500/15 border border-rose-500/40 text-rose-400 hover:bg-rose-500/25'
            }`}
          >
            {currentDayConfig.enabled ? (
              <>
                <Check className="w-4 h-4" />
                <span>Dia Ativo (Aberto)</span>
              </>
            ) : (
              <>
                <Ban className="w-4 h-4" />
                <span>Dia Desativado (Fechado)</span>
              </>
            )}
          </button>
        </div>

        {currentDayConfig.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Opening Time */}
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-2">
                Horário de Abertura
              </label>
              <div className="flex items-center gap-2 bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-800">
                <Clock className="w-4 h-4 text-amber-400" />
                <input
                  type="time"
                  value={currentDayConfig.openTime}
                  onChange={(e) => handleUpdate({ openTime: e.target.value })}
                  className="bg-transparent text-sm text-white font-medium outline-none w-full"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1.5">
                Primeiro horário disponível para os clientes
              </p>
            </div>

            {/* Closing Time */}
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-2">
                Horário de Fechamento
              </label>
              <div className="flex items-center gap-2 bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-800">
                <Clock className="w-4 h-4 text-amber-400" />
                <input
                  type="time"
                  value={currentDayConfig.closeTime}
                  onChange={(e) => handleUpdate({ closeTime: e.target.value })}
                  className="bg-transparent text-sm text-white font-medium outline-none w-full"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1.5">
                Término do atendimento na barbearia
              </p>
            </div>

            {/* Interval between slots */}
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-2">
                Intervalo entre Horários
              </label>
              <select
                value={currentDayConfig.slotIntervalMinutes}
                onChange={(e) => handleUpdate({ slotIntervalMinutes: Number(e.target.value) })}
                className="w-full bg-neutral-900 text-sm text-white font-medium px-3 py-2 rounded-xl border border-neutral-800 outline-none cursor-pointer"
              >
                <option value={20}>20 em 20 minutos</option>
                <option value={30}>30 em 30 minutos (Recomendado)</option>
                <option value={40}>40 em 40 minutos</option>
                <option value={45}>45 em 45 minutos</option>
                <option value={60}>60 em 60 minutos (1 hora)</option>
              </select>
              <p className="text-[10px] text-neutral-500 mt-1.5">
                Define a grade de horários mostrada no site
              </p>
            </div>

            {/* VAGAS SIMULTÂNEAS (CAPACIDADE PADRÃO POR HORÁRIO) */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Vagas por Horário
                </label>
                <Users className="w-4 h-4 text-amber-400" />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleUpdate({
                      defaultCapacityPerSlot: Math.max(1, currentDayConfig.defaultCapacityPerSlot - 1),
                    })
                  }
                  className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-black text-sm flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <div className="flex-1 text-center py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 font-accent font-black text-xl text-amber-400">
                  {currentDayConfig.defaultCapacityPerSlot} {currentDayConfig.defaultCapacityPerSlot === 1 ? 'vaga' : 'vagas'}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdate({
                      defaultCapacityPerSlot: Math.min(10, currentDayConfig.defaultCapacityPerSlot + 1),
                    })
                  }
                  className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-black text-sm flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
              <p className="text-[10px] text-amber-200/70 mt-1.5">
                Capacidade padrão de clientes no mesmo horário
              </p>
            </div>
          </div>
        )}

        {/* Lunch Break Configuration */}
        {currentDayConfig.enabled && (
          <div className="pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-heading text-sm font-bold text-white uppercase">
                  Pausa de Intervalo / Almoço
                </h4>
                <p className="text-xs text-neutral-400">
                  Bloqueia automaticamente os horários dentro deste intervalo
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleUpdate({
                    lunchBreakEnabled: !currentDayConfig.lunchBreakEnabled,
                    lunchBreakStart: currentDayConfig.lunchBreakStart || '12:00',
                    lunchBreakEnd: currentDayConfig.lunchBreakEnd || '13:00',
                  })
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  currentDayConfig.lunchBreakEnabled
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {currentDayConfig.lunchBreakEnabled ? 'Pausa Ativada' : 'Sem Pausa'}
              </button>
            </div>

            {currentDayConfig.lunchBreakEnabled && (
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <label className="text-[11px] text-neutral-400 block mb-1">Início da Pausa</label>
                  <input
                    type="time"
                    value={currentDayConfig.lunchBreakStart || '12:00'}
                    onChange={(e) => handleUpdate({ lunchBreakStart: e.target.value })}
                    className="bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-white font-medium outline-none w-full"
                  />
                </div>
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <label className="text-[11px] text-neutral-400 block mb-1">Fim da Pausa</label>
                  <input
                    type="time"
                    value={currentDayConfig.lunchBreakEnd || '13:00'}
                    onChange={(e) => handleUpdate({ lunchBreakEnd: e.target.value })}
                    className="bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-white font-medium outline-none w-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* FINE-GRAINED SLOT OVERRIDES (AJUSTE FINO POR HORÁRIO) */}
        {currentDayConfig.enabled && (
          <div className="pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-heading text-sm font-bold text-white uppercase">
                  Ajuste Fino de Horários Individuais ({currentDayConfig.dayName})
                </h4>
                <p className="text-xs text-neutral-400">
                  Clique para bloquear um horário específico ou mudar o número de vagas naquele horário exato (ex: horários de pico).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {previewSlots.map((timeStr) => {
                const override = currentDayConfig.slotOverrides?.[timeStr];
                const isEnabled = override?.enabled !== undefined ? override.enabled : true;
                const capacity = override?.capacity !== undefined
                  ? override.capacity
                  : currentDayConfig.defaultCapacityPerSlot;

                return (
                  <div
                    key={timeStr}
                    className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                      !isEnabled
                        ? 'bg-neutral-950/40 border-neutral-800/60 opacity-60'
                        : 'bg-neutral-950 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-bold text-white">{timeStr}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateSlotCapacityOverride(
                            activeDayOfWeek,
                            timeStr,
                            !isEnabled,
                            capacity
                          )
                        }
                        title={isEnabled ? 'Bloquear horário' : 'Ativar horário'}
                        className={`p-1 rounded-md text-[10px] font-bold cursor-pointer ${
                          isEnabled
                            ? 'text-emerald-400 hover:bg-emerald-950/40'
                            : 'text-rose-400 hover:bg-rose-950/40'
                        }`}
                      >
                        {isEnabled ? 'Ativo' : 'Bloqueado'}
                      </button>
                    </div>

                    {isEnabled ? (
                      <div className="flex items-center justify-between bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                        <button
                          type="button"
                          onClick={() =>
                            updateSlotCapacityOverride(
                              activeDayOfWeek,
                              timeStr,
                              true,
                              Math.max(1, capacity - 1)
                            )
                          }
                          className="w-5 h-5 rounded text-neutral-400 hover:text-white bg-neutral-800 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-[11px] font-bold text-amber-400">
                          {capacity} {capacity === 1 ? 'vaga' : 'vagas'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateSlotCapacityOverride(
                              activeDayOfWeek,
                              timeStr,
                              true,
                              Math.min(10, capacity + 1)
                            )
                          }
                          className="w-5 h-5 rounded text-neutral-400 hover:text-white bg-neutral-800 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-center text-neutral-500 py-1 font-medium">
                        Indisponível
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
