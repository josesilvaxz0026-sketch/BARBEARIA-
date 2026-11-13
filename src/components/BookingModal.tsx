import React, { useState, useEffect } from 'react';
import { useBarber } from '../context/BarberContext';
import { BarberService, Appointment, BarberStaff } from '../types';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Share2,
} from 'lucide-react';
import { Logo } from './Logo';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: BarberService | null;
  preSelectedBarber?: BarberStaff | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedService,
  preSelectedBarber,
}) => {
  const {
    services,
    staff,
    shopInfo,
    getAvailableSlotsForDate,
    isDateOpen,
    bookAppointment,
    generateWhatsAppLink,
  } = useBarber();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedBarberId, setSelectedBarberId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Confirmation result
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Initialize service & barber when opened or changed
  useEffect(() => {
    if (preSelectedService) {
      setSelectedServiceId(preSelectedService.id);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }

    if (preSelectedBarber) {
      setSelectedBarberId(preSelectedBarber.id);
    } else if (staff.length > 0 && !selectedBarberId) {
      const activeBarber = staff.find((b) => b.active);
      if (activeBarber) setSelectedBarberId(activeBarber.id);
    }
  }, [preSelectedService, preSelectedBarber, services, staff, isOpen]);

  // Set default date to today
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
      setStep(preSelectedService ? 2 : 1);
      setErrorMessage('');
      setConfirmedAppointment(null);
    }
  }, [isOpen, preSelectedService]);

  if (!isOpen) return null;

  // Generate 14 upcoming dates
  const upcomingDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const isOpenDay = isDateOpen(dateStr);

    return {
      dateStr,
      dayNum: d.getDate(),
      monthNum: d.getMonth() + 1,
      dayName: dayNames[dayOfWeek],
      isToday: i === 0,
      isTomorrow: i === 1,
      isOpen: isOpenDay,
    };
  });

  // Available slots for selected date
  const availableSlots = selectedDate ? getAvailableSlotsForDate(selectedDate) : [];
  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedBarber = staff.find((b) => b.id === selectedBarberId);

  // Phone input formatting (XX) 9XXXX-XXXX
  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').substring(0, 11);
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `(${cleaned.substring(0, 2)}) ${cleaned.substring(2)}`;
    }
    if (cleaned.length > 7) {
      formatted = `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    }
    setClientPhone(formatted);
  };

  const handleNextToStep3 = () => {
    if (!selectedDate) {
      setErrorMessage('Por favor, selecione uma data.');
      return;
    }
    if (!selectedTime) {
      setErrorMessage('Por favor, selecione um horário disponível.');
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  const handleConfirmBooking = () => {
    if (!clientName.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }
    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Por favor, informe um telefone/WhatsApp válido com DDD.');
      return;
    }

    setErrorMessage('');
    const res = bookAppointment({
      clientName,
      clientPhone,
      serviceId: selectedServiceId,
      barberId: selectedBarberId,
      date: selectedDate,
      time: selectedTime,
      notes,
    });

    if (res.success && res.appointment) {
      setConfirmedAppointment(res.appointment);
      setStep(4);
    } else {
      setErrorMessage(res.error || 'Erro ao realizar agendamento.');
    }
  };

  // Google Calendar helper
  const getGoogleCalendarUrl = (apt: Appointment) => {
    const [year, month, day] = apt.date.split('-');
    const [hours, minutes] = apt.time.split(':');
    const startIso = `${year}${month}${day}T${hours}${minutes}00`;
    
    // Calculate end time
    const endMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10) + apt.durationMinutes;
    const endH = String(Math.floor(endMinutes / 60)).padStart(2, '0');
    const endM = String(endMinutes % 60).padStart(2, '0');
    const endIso = `${year}${month}${day}T${endH}${endM}00`;

    const title = encodeURIComponent(`Corte na ${shopInfo.name} - ${apt.serviceName}`);
    const details = encodeURIComponent(
      `Agendamento #${apt.code}\nServiço: ${apt.serviceName}\nProfissional: ${apt.barberName}\nTelefone: ${shopInfo.whatsappFormatted}\nEndereço: ${shopInfo.address}, ${shopInfo.neighborhood}, ${shopInfo.city}`
    );
    const location = encodeURIComponent(`${shopInfo.address}, ${shopInfo.neighborhood}, ${shopInfo.city}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0f1117] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-neutral-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#13161f]">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <h2 className="font-heading text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                {step === 4 ? 'Agendamento Confirmado' : 'Agendar Horário'}
              </h2>
              <p className="text-[11px] text-neutral-400">
                {step === 1 && 'Passo 1 de 3: Escolha o Serviço e Profissional'}
                {step === 2 && 'Passo 2 de 3: Escolha o Dia e Horário'}
                {step === 3 && 'Passo 3 de 3: Seus Dados para Confirmação'}
                {step === 4 && 'Vaga garantida com sucesso!'}
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: SERVICE & BARBER SELECTION */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  1. Selecione o Serviço Desejado
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {services.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        selectedServiceId === srv.id
                          ? 'bg-amber-500/10 border-amber-500 text-white'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-sm">{srv.name}</p>
                        <p className="text-xs text-neutral-400">{srv.durationMinutes} min</p>
                      </div>
                      <div className="text-right">
                        <span className="font-accent font-bold text-base text-amber-400">
                          R$ {srv.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  2. Escolha o Profissional
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBarberId('any')}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                      selectedBarberId === 'any'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <p className="font-bold text-white">Sem Preferência</p>
                    <p className="text-[11px] text-neutral-400">Primeiro disponível</p>
                  </button>
                  {staff
                    .filter((b) => b.active)
                    .map((barber) => (
                      <button
                        key={barber.id}
                        type="button"
                        onClick={() => setSelectedBarberId(barber.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex items-center gap-3 ${
                          selectedBarberId === barber.id
                            ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-md shadow-amber-500/5'
                            : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-amber-500/40 bg-neutral-950 flex items-center justify-center">
                          {barber.avatarUrl ? (
                            <img
                              src={barber.avatarUrl}
                              alt={barber.name}
                              className="w-full h-full object-cover"
                              style={{
                                transform: `scale(${barber.avatarScale || 1}) translate(${barber.avatarOffsetX || 0}%, ${barber.avatarOffsetY || 0}%)`,
                              }}
                            />
                          ) : (
                            <User className="w-5 h-5 text-neutral-400" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-white text-sm truncate">{barber.name}</p>
                          <p className="text-[10px] text-amber-400/90 truncate font-semibold uppercase">{barber.role}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME SELECTION WITH LIVE CAPACITY */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Date horizontal picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2.5">
                  1. Escolha a Data
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {upcomingDates.map((item) => (
                    <button
                      key={item.dateStr}
                      type="button"
                      disabled={!item.isOpen}
                      onClick={() => {
                        setSelectedDate(item.dateStr);
                        setSelectedTime('');
                      }}
                      className={`flex flex-col items-center justify-center min-w-[70px] py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                        !item.isOpen
                          ? 'opacity-35 bg-neutral-900/40 border-neutral-800 cursor-not-allowed'
                          : selectedDate === item.dateStr
                          ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/20 font-bold'
                          : 'bg-neutral-900/70 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800'
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider font-semibold">
                        {item.isToday ? 'Hoje' : item.isTomorrow ? 'Amanhã' : item.dayName}
                      </span>
                      <span className="text-base font-black my-0.5">{item.dayNum}</span>
                      <span className="text-[9px] opacity-75">
                        {!item.isOpen ? 'Fechado' : `${item.monthNum}/${item.dayNum}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots grid with slot availability */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    2. Escolha o Horário Disponível
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    Capacidade atualizada ao vivo
                  </span>
                </div>

                {availableSlots.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl text-neutral-400 text-xs">
                    Nenhum horário disponível para esta data. Por favor escolha outro dia.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                          !slot.isAvailable
                            ? 'bg-neutral-900/30 border-neutral-800/60 opacity-40 cursor-not-allowed text-neutral-500'
                            : selectedTime === slot.time
                            ? 'bg-amber-500 text-neutral-950 border-amber-400 font-extrabold shadow-md shadow-amber-500/20'
                            : 'bg-neutral-900/80 border-neutral-800 hover:border-amber-500/50 text-neutral-200'
                        }`}
                      >
                        <span className="text-sm font-bold">{slot.time}</span>
                        <span className="text-[10px] mt-0.5 font-medium">
                          {!slot.isAvailable ? (
                            'Esgotado'
                          ) : slot.availableSpots === 1 ? (
                            <span className={selectedTime === slot.time ? 'text-neutral-900' : 'text-amber-400 font-semibold'}>
                              1 vaga só!
                            </span>
                          ) : (
                            <span className={selectedTime === slot.time ? 'text-neutral-900' : 'text-emerald-400'}>
                              {slot.availableSpots} vagas
                            </span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: CLIENT DETAILS & SUMMARY */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800">
                  <span className="text-neutral-400">Serviço:</span>
                  <span className="font-bold text-white">{selectedService?.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800">
                  <span className="text-neutral-400">Profissional:</span>
                  <span className="font-bold text-white">
                    {selectedBarberId === 'any' ? 'Primeiro Disponível' : selectedBarber?.nickname}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800">
                  <span className="text-neutral-400">Data e Horário:</span>
                  <span className="font-bold text-amber-400">
                    {selectedDate.split('-').reverse().join('/')} às {selectedTime}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Valor Total:</span>
                  <span className="font-accent font-black text-lg text-white">
                    R$ {selectedService?.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Form Inputs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Seu Nome Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo Silva"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-white placeholder-neutral-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Seu WhatsApp com DDD *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="tel"
                    required
                    placeholder="(21) 99999-9999"
                    value={clientPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-white placeholder-neutral-500 outline-none"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Enviaremos a confirmação instantânea para este número.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Observações para o Barbeiro (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: alergia a lâmina, quero desenho no degradê, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs text-white placeholder-neutral-500 outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION & WHATSAPP AUTOMATION */}
          {step === 4 && confirmedAppointment && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-extrabold uppercase tracking-widest">
                  Código: {confirmedAppointment.code}
                </span>
                <h3 className="font-heading text-2xl font-black text-white mt-3 uppercase">
                  Agendamento Concluído!
                </h3>
                <p className="text-xs text-neutral-300 max-w-sm mx-auto mt-1">
                  Sua vaga na {shopInfo.name} está reservada.
                </p>
              </div>

              {/* Voucher Card */}
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Cliente:</span>
                  <span className="font-bold text-white">{confirmedAppointment.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Serviço:</span>
                  <span className="font-bold text-white">{confirmedAppointment.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Profissional:</span>
                  <span className="font-bold text-white">{confirmedAppointment.barberName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Data e Hora:</span>
                  <span className="font-bold text-amber-400">
                    {confirmedAppointment.date.split('-').reverse().join('/')} às {confirmedAppointment.time}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-neutral-800">
                  <span className="text-neutral-400">Endereço:</span>
                  <span className="font-medium text-neutral-300 text-right">
                    {shopInfo.address}, {shopInfo.neighborhood}
                  </span>
                </div>
              </div>

              {/* Automated WhatsApp Button */}
              <div className="space-y-2.5 max-w-md mx-auto">
                <a
                  href={generateWhatsAppLink(confirmedAppointment)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Enviar Confirmação no WhatsApp da Barbearia</span>
                </a>

                <a
                  href={getGoogleCalendarUrl(confirmedAppointment)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Salvar no Google Agenda</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Step navigation */}
        {step < 4 && (
          <div className="px-5 sm:px-6 py-3.5 border-t border-neutral-800 flex items-center justify-between bg-[#13161f]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>Avançar para Horários</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={handleNextToStep3}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>Avançar para Seus Dados</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-extrabold text-xs tracking-wide shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                <span>Confirmar Agendamento</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="px-5 sm:px-6 py-3.5 border-t border-neutral-800 flex justify-end bg-[#13161f]">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
