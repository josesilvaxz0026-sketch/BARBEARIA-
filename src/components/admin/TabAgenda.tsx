import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import { Appointment, AppointmentStatus } from '../../types';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  CheckCircle2,
  XCircle,
  Play,
  Plus,
  Filter,
  MessageCircle,
  Search,
  AlertTriangle,
} from 'lucide-react';

export const TabAgenda: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    cancelAppointment,
    services,
    staff,
    bookAppointment,
    shopInfo,
  } = useBarber();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [barberFilter, setBarberFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Manual booking modal in admin
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [manualName, setManualName] = useState<string>('');
  const [manualPhone, setManualPhone] = useState<string>('');
  const [manualServiceId, setManualServiceId] = useState<string>(services[0]?.id || '');
  const [manualBarberId, setManualBarberId] = useState<string>(staff[0]?.id || 'any');
  const [manualTime, setManualTime] = useState<string>('10:00');
  const [manualError, setManualError] = useState<string>('');

  // Filtered list
  const filteredAppointments = appointments.filter((apt) => {
    if (selectedDate && apt.date !== selectedDate) return false;
    if (statusFilter !== 'todos' && apt.status !== statusFilter) return false;
    if (barberFilter !== 'todos' && apt.barberId !== barberFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.clientName.toLowerCase().includes(q);
      const matchCode = apt.code.toLowerCase().includes(q);
      const matchPhone = apt.clientPhone.includes(q);
      if (!matchName && !matchCode && !matchPhone) return false;
    }
    return true;
  });

  // Calculate day stats
  const dayAppointments = appointments.filter(
    (a) => a.date === selectedDate && a.status !== 'cancelado'
  );
  const totalFaturamento = dayAppointments.reduce((acc, a) => acc + a.price, 0);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) {
      setManualError('Preencha nome e telefone do cliente.');
      return;
    }

    const res = bookAppointment({
      clientName: manualName,
      clientPhone: manualPhone,
      serviceId: manualServiceId,
      barberId: manualBarberId,
      date: selectedDate,
      time: manualTime,
      notes: 'Agendamento presencial / balcão',
    });

    if (res.success) {
      setIsManualModalOpen(false);
      setManualName('');
      setManualPhone('');
      setManualError('');
    } else {
      setManualError(res.error || 'Erro ao agendar.');
    }
  };

  const sendWhatsAppReminder = (apt: Appointment) => {
    const cleanPhone = apt.clientPhone.replace(/\D/g, '');
    const fullTarget = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const [year, month, day] = apt.date.split('-');
    const msg = `Olá ${apt.clientName}! 💈 Lembrando do seu corte na ${shopInfo.name} hoje (${day}/${month}) às ${apt.time} com ${apt.barberName}. Nos vemos em breve!`;
    window.open(`https://wa.me/${fullTarget}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <p className="text-xs text-neutral-400">Total Agendados Hoje</p>
          <p className="text-2xl font-black text-white font-accent mt-1">
            {dayAppointments.length} clientes
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <p className="text-xs text-neutral-400">Faturamento Previsto</p>
          <p className="text-2xl font-black text-amber-400 font-accent mt-1">
            R$ {totalFaturamento.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <p className="text-xs text-neutral-400">Concluídos</p>
          <p className="text-2xl font-black text-emerald-400 font-accent mt-1">
            {dayAppointments.filter((a) => a.status === 'concluido').length}
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="w-full h-full min-h-[58px] flex items-center justify-center gap-2 p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Agendamento Manual</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Selector */}
          <div className="flex items-center gap-1.5 bg-neutral-800/80 px-3 py-1.5 rounded-xl border border-neutral-700">
            <Calendar className="w-4 h-4 text-amber-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-white outline-none font-medium"
            />
          </div>

          {/* Quick Date buttons */}
          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedDate === todayStr ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-300'
            }`}
          >
            Hoje
          </button>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-800 text-xs text-neutral-200 border border-neutral-700 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
          >
            <option value="todos">Todos os Status</option>
            <option value="confirmado">Confirmados</option>
            <option value="em_andamento">Em Atendimento</option>
            <option value="concluido">Concluídos</option>
            <option value="cancelado">Cancelados</option>
          </select>

          {/* Barber Filter */}
          <select
            value={barberFilter}
            onChange={(e) => setBarberFilter(e.target.value)}
            className="bg-neutral-800 text-xs text-neutral-200 border border-neutral-700 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
          >
            <option value="todos">Todos os Barbeiros</option>
            {staff.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nickname}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, código ou fone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder-neutral-500 outline-none"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl text-neutral-400 text-xs">
            Nenhum agendamento encontrado para esta data ou filtros selecionados.
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const isCompleted = apt.status === 'concluido';
            const isCancelled = apt.status === 'cancelado';
            const inProgress = apt.status === 'em_andamento';

            return (
              <div
                key={apt.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCancelled
                    ? 'bg-neutral-950/40 border-neutral-900 opacity-50'
                    : isCompleted
                    ? 'bg-neutral-900/60 border-neutral-800'
                    : inProgress
                    ? 'bg-amber-500/5 border-amber-500/40 shadow-md shadow-amber-500/5'
                    : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Time & Client Info */}
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-16 h-16 rounded-xl bg-neutral-800 border border-neutral-700 flex flex-col items-center justify-center shrink-0">
                    <span className="font-accent font-black text-base text-amber-400">
                      {apt.time}
                    </span>
                    <span className="text-[10px] text-neutral-400">{apt.durationMinutes}m</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        #{apt.code}
                      </span>
                      <h4 className="font-heading font-bold text-base text-white">
                        {apt.clientName}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          isCancelled
                            ? 'bg-rose-500/15 text-rose-400'
                            : isCompleted
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : inProgress
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-sky-500/15 text-sky-400'
                        }`}
                      >
                        {apt.status === 'em_andamento' ? 'Em Atendimento' : apt.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-1">
                      <span className="text-white font-medium">{apt.serviceName}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-neutral-300">
                        <Scissors className="w-3 h-3 text-amber-400" />
                        {apt.barberName}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-neutral-300">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        {apt.clientPhone}
                      </span>
                      <span>·</span>
                      <span className="font-accent font-black text-amber-300">
                        R$ {apt.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    {apt.notes && (
                      <p className="text-[11px] text-amber-200/80 mt-1.5 bg-neutral-950/60 px-2.5 py-1 rounded-md inline-block">
                        Obs: {apt.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Admin Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
                  {/* WhatsApp Reminder */}
                  <button
                    onClick={() => sendWhatsAppReminder(apt)}
                    title="Enviar Lembrete no WhatsApp"
                    className="p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-900/50 text-emerald-400 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>

                  {!isCompleted && !isCancelled && (
                    <>
                      {apt.status !== 'em_andamento' ? (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'em_andamento')}
                          className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Iniciar</span>
                        </button>
                      ) : null}

                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'concluido', true)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Concluir (Baixar Estoque)</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Deseja realmente cancelar este agendamento?')) {
                            cancelAppointment(apt.id);
                          }
                        }}
                        className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Cancelar Agendamento"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Manual Booking Modal for Admin */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-heading text-base font-bold text-white uppercase mb-4">
              Novo Agendamento Presencial / Telefone
            </h3>

            {manualError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {manualError}
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Telefone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="(21) 9XXXX-XXXX"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Serviço</label>
                  <select
                    value={manualServiceId}
                    onChange={(e) => setManualServiceId(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} - R${s.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Barbeiro</label>
                  <select
                    value={manualBarberId}
                    onChange={(e) => setManualBarberId(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none"
                  >
                    {staff.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nickname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Data</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Horário</label>
                  <input
                    type="time"
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-xs text-neutral-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase cursor-pointer"
                >
                  Salvar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
