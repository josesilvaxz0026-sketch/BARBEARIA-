import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import { BarberService, BarberStaff } from '../../types';
import {
  Scissors,
  User,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Check,
  DollarSign,
  Camera,
  Calendar,
  Phone,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { PhotoCropModal } from '../PhotoCropModal';

const DAYS_OF_WEEK = [
  { id: 1, name: 'Segunda-feira', short: 'Seg' },
  { id: 2, name: 'Terça-feira', short: 'Ter' },
  { id: 3, name: 'Quarta-feira', short: 'Qua' },
  { id: 4, name: 'Quinta-feira', short: 'Qui' },
  { id: 5, name: 'Sexta-feira', short: 'Sex' },
  { id: 6, name: 'Sábado', short: 'Sáb' },
  { id: 0, name: 'Domingo', short: 'Dom' },
];

export const TabServicosEquipe: React.FC = () => {
  const {
    services,
    staff,
    createService,
    updateService,
    deleteService,
    createBarber,
    updateBarber,
    deleteBarber,
  } = useBarber();

  const [activeSection, setActiveSection] = useState<'equipe' | 'servicos'>('equipe');

  // Photo Crop Modal trigger
  const [cropModalBarber, setCropModalBarber] = useState<BarberStaff | null>(null);

  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<BarberService | null>(null);
  const [srvName, setSrvName] = useState<string>('');
  const [srvPrice, setSrvPrice] = useState<number>(35);
  const [srvDuration, setSrvDuration] = useState<number>(40);
  const [srvCategory, setSrvCategory] = useState<BarberService['category']>('cabelo');
  const [srvDescription, setSrvDescription] = useState<string>('');
  const [srvPopular, setSrvPopular] = useState<boolean>(false);

  // Barber Modal State (enhanced with schedules & working hours)
  const [isBarberModalOpen, setIsBarberModalOpen] = useState<boolean>(false);
  const [editingBarber, setEditingBarber] = useState<BarberStaff | null>(null);
  const [barberName, setBarberName] = useState<string>('');
  const [barberNickname, setBarberNickname] = useState<string>('');
  const [barberRole, setBarberRole] = useState<string>('Barbeiro Especialista');
  const [barberPhone, setBarberPhone] = useState<string>('');
  const [barberBio, setBarberBio] = useState<string>('');
  const [barberAvatar, setBarberAvatar] = useState<string>('');
  const [barberActive, setBarberActive] = useState<boolean>(true);
  const [barberWorkingDays, setBarberWorkingDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [barberCustomHours, setBarberCustomHours] = useState<{
    [dayOfWeek: number]: { enabled: boolean; start: string; end: string };
  }>({
    1: { enabled: true, start: '09:00', end: '20:00' },
    2: { enabled: true, start: '09:00', end: '20:00' },
    3: { enabled: true, start: '09:00', end: '20:00' },
    4: { enabled: true, start: '09:00', end: '20:00' },
    5: { enabled: true, start: '08:30', end: '20:30' },
    6: { enabled: true, start: '08:30', end: '20:30' },
    0: { enabled: false, start: '09:00', end: '14:00' },
  });

  // Open Service Modal
  const handleOpenCreateService = () => {
    setEditingService(null);
    setSrvName('');
    setSrvPrice(35);
    setSrvDuration(40);
    setSrvCategory('cabelo');
    setSrvDescription('');
    setSrvPopular(false);
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (srv: BarberService) => {
    setEditingService(srv);
    setSrvName(srv.name);
    setSrvPrice(srv.price);
    setSrvDuration(srv.durationMinutes);
    setSrvCategory(srv.category);
    setSrvDescription(srv.description);
    setSrvPopular(!!srv.popular);
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName.trim()) return;

    if (editingService) {
      updateService(editingService.id, {
        name: srvName.trim(),
        price: Number(srvPrice),
        durationMinutes: Number(srvDuration),
        category: srvCategory,
        description: srvDescription.trim(),
        popular: srvPopular,
      });
    } else {
      createService({
        name: srvName.trim(),
        price: Number(srvPrice),
        durationMinutes: Number(srvDuration),
        category: srvCategory,
        description: srvDescription.trim(),
        popular: srvPopular,
        consumables: [
          { itemId: 'inv-laminas', quantity: 1 },
          { itemId: 'inv-golas', quantity: 1 },
        ],
      });
    }

    setIsServiceModalOpen(false);
  };

  // Open Barber Modal
  const handleOpenCreateBarber = () => {
    setEditingBarber(null);
    setBarberName('');
    setBarberNickname('');
    setBarberRole('Barbeiro Especialista');
    setBarberPhone('');
    setBarberBio('');
    setBarberAvatar('');
    setBarberActive(true);
    setBarberWorkingDays([1, 2, 3, 4, 5, 6]);
    setBarberCustomHours({
      1: { enabled: true, start: '09:00', end: '20:00' },
      2: { enabled: true, start: '09:00', end: '20:00' },
      3: { enabled: true, start: '09:00', end: '20:00' },
      4: { enabled: true, start: '09:00', end: '20:00' },
      5: { enabled: true, start: '08:30', end: '20:30' },
      6: { enabled: true, start: '08:30', end: '20:30' },
      0: { enabled: false, start: '09:00', end: '14:00' },
    });
    setIsBarberModalOpen(true);
  };

  const handleOpenEditBarber = (b: BarberStaff) => {
    setEditingBarber(b);
    setBarberName(b.name);
    setBarberNickname(b.nickname);
    setBarberRole(b.role);
    setBarberPhone(b.phone || '');
    setBarberBio(b.bio || '');
    setBarberAvatar(b.avatarUrl || '');
    setBarberActive(b.active);
    setBarberWorkingDays(b.workingDays || [1, 2, 3, 4, 5, 6]);
    setBarberCustomHours(
      b.customHours || {
        1: { enabled: true, start: '09:00', end: '20:00' },
        2: { enabled: true, start: '09:00', end: '20:00' },
        3: { enabled: true, start: '09:00', end: '20:00' },
        4: { enabled: true, start: '09:00', end: '20:00' },
        5: { enabled: true, start: '08:30', end: '20:30' },
        6: { enabled: true, start: '08:30', end: '20:30' },
        0: { enabled: false, start: '09:00', end: '14:00' },
      }
    );
    setIsBarberModalOpen(true);
  };

  const handleToggleDay = (dayId: number) => {
    setBarberWorkingDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
    setBarberCustomHours((prev) => ({
      ...prev,
      [dayId]: {
        ...(prev[dayId] || { start: '09:00', end: '20:00' }),
        enabled: !prev[dayId]?.enabled,
      },
    }));
  };

  const handleHourChange = (dayId: number, field: 'start' | 'end', val: string) => {
    setBarberCustomHours((prev) => ({
      ...prev,
      [dayId]: {
        ...(prev[dayId] || { enabled: true, start: '09:00', end: '20:00' }),
        [field]: val,
      },
    }));
  };

  const handleSaveBarber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barberName.trim()) return;

    if (editingBarber) {
      updateBarber(editingBarber.id, {
        name: barberName.trim(),
        nickname: barberNickname.trim() || barberName.trim().split(' ')[0],
        role: barberRole.trim(),
        phone: barberPhone.trim() || undefined,
        bio: barberBio.trim() || undefined,
        avatarUrl: barberAvatar.trim() || editingBarber.avatarUrl || undefined,
        active: barberActive,
        workingDays: barberWorkingDays,
        customHours: barberCustomHours,
      });
    } else {
      createBarber({
        name: barberName.trim(),
        nickname: barberNickname.trim() || barberName.trim().split(' ')[0],
        role: barberRole.trim(),
        phone: barberPhone.trim() || undefined,
        bio: barberBio.trim() || undefined,
        avatarUrl: barberAvatar.trim() || undefined,
        active: barberActive,
        workingDays: barberWorkingDays,
        customHours: barberCustomHours,
      });
    }

    setIsBarberModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Section Switcher & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
          <button
            onClick={() => setActiveSection('equipe')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSection === 'equipe'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Equipe de Barbeiros ({staff.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('servicos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSection === 'servicos'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Serviços & Preços ({services.length})</span>
          </button>
        </div>

        {activeSection === 'equipe' ? (
          <button
            onClick={handleOpenCreateBarber}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Barbeiro</span>
          </button>
        ) : (
          <button
            onClick={handleOpenCreateService}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Serviço</span>
          </button>
        )}
      </div>

      {/* SECTION 1: EQUIPE DE BARBEIROS (Com foto de perfil, enquadramento e horários) */}
      {activeSection === 'equipe' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((barber) => (
              <div
                key={barber.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                  barber.active
                    ? 'bg-neutral-900/90 border-neutral-800 hover:border-amber-500/40 shadow-xl'
                    : 'bg-neutral-950/80 border-neutral-900 opacity-60'
                }`}
              >
                <div>
                  {/* Top Bar with Status and Role */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        barber.active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${barber.active ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
                      {barber.active ? 'Disponível no Site' : 'Pausa / Inativo'}
                    </span>

                    <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider">
                      {barber.role}
                    </span>
                  </div>

                  {/* Circular Avatar + Quick Crop/Photo Action */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative group shrink-0">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/50 bg-[#090a0d] shadow-lg flex items-center justify-center">
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
                          <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                            <User className="w-8 h-8 text-neutral-500" />
                          </div>
                        )}

                        {/* Hover Overlay to Edit Photo */}
                        <button
                          type="button"
                          onClick={() => setCropModalBarber(barber)}
                          title="Carregar ou Ajustar Foto de Perfil"
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white cursor-pointer rounded-full"
                        >
                          <Camera className="w-5 h-5 text-amber-400" />
                          <span className="text-[9px] font-bold mt-0.5">Ajustar</span>
                        </button>
                      </div>

                      {/* Small badge to trigger photo modal directly */}
                      <button
                        type="button"
                        onClick={() => setCropModalBarber(barber)}
                        title="Trocar Foto"
                        className="absolute -bottom-1 -right-1 p-1 rounded-full bg-neutral-900 border border-amber-500/50 text-amber-400 hover:text-white shadow-md cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="truncate">
                      <h4 className="font-heading font-bold text-lg text-white truncate">
                        {barber.name}
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Exibição: <strong className="text-neutral-200">{barber.nickname}</strong>
                      </p>
                      {barber.phone && (
                        <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{barber.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Working Days & Hours Preview Badge */}
                  <div className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 mb-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400 font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dias & Horários de Atendimento:</span>
                      </span>
                    </div>

                    {/* Small badges for active days */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {DAYS_OF_WEEK.map((d) => {
                        const isWorking = (barber.workingDays || [1, 2, 3, 4, 5, 6]).includes(d.id);
                        return (
                          <span
                            key={d.id}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isWorking
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-neutral-900 text-neutral-600 line-through'
                            }`}
                          >
                            {d.short}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setCropModalBarber(barber)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ajustar Foto</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditBarber(barber)}
                      title="Editar Dados e Horários"
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {staff.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Deseja remover ${barber.name} da equipe?`)) {
                            deleteBarber(barber.id);
                          }
                        }}
                        title="Excluir Barbeiro"
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: SERVIÇOS */}
      {activeSection === 'servicos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-heading font-bold text-base text-white">{srv.name}</h4>
                  {srv.popular && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Destaque
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4 line-clamp-2">
                  {srv.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="font-accent font-black text-lg text-white">
                    R$ {srv.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] text-neutral-500 block">
                    {srv.durationMinutes} minutos
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditService(srv)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Deseja excluir o serviço "${srv.name}"?`)) {
                        deleteService(srv.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SERVICE MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-heading text-base font-bold text-white uppercase mb-4">
              {editingService ? 'Editar Serviço' : 'Cadastrar Novo Serviço'}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Nome do Serviço *</label>
                <input
                  type="text"
                  required
                  value={srvName}
                  onChange={(e) => setSrvName(e.target.value)}
                  placeholder="Ex: Corte Degradê Navalhado"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Duração (Minutos) *</label>
                  <input
                    type="number"
                    step="5"
                    required
                    value={srvDuration}
                    onChange={(e) => setSrvDuration(parseInt(e.target.value, 10) || 30)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={srvDescription}
                  onChange={(e) => setSrvDescription(e.target.value)}
                  placeholder="Detalhes do serviço..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={srvPopular}
                  onChange={(e) => setSrvPopular(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <label htmlFor="popularCheck" className="text-xs text-neutral-300">
                  Marcar como Serviço em Destaque / Mais Pedido
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-xs text-neutral-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase cursor-pointer"
                >
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE BARBER CREATION / EDITING MODAL (COM HORÁRIOS E DIAS) */}
      {isBarberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 shadow-2xl my-auto text-neutral-100 flex flex-col space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="border-b border-neutral-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white uppercase">
                {editingBarber ? `Editar: ${editingBarber.name}` : 'Cadastrar Novo Barbeiro'}
              </h3>
              <p className="text-xs text-neutral-400">
                Configure os dados do profissional, especialidade e seus horários de atendimento exclusivos.
              </p>
            </div>

            <form onSubmit={handleSaveBarber} className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={barberName}
                    onChange={(e) => setBarberName(e.target.value)}
                    placeholder="Ex: Carlos Alexandre Santos"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Apelido no Site *</label>
                  <input
                    type="text"
                    required
                    value={barberNickname}
                    onChange={(e) => setBarberNickname(e.target.value)}
                    placeholder="Ex: Alexandre"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Especialidade / Cargo</label>
                  <input
                    type="text"
                    value={barberRole}
                    onChange={(e) => setBarberRole(e.target.value)}
                    placeholder="Ex: Especialista em Degradê & Barba"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    value={barberPhone}
                    onChange={(e) => setBarberPhone(e.target.value)}
                    placeholder="Ex: (21) 98765-4321"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Foto de perfil */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1">URL da Imagem de Perfil (Opcional)</label>
                <input
                  type="url"
                  value={barberAvatar}
                  onChange={(e) => setBarberAvatar(e.target.value)}
                  placeholder="https://... (ou use o botão 'Ajustar Foto' para carregar do dispositivo)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-amber-400/80 mt-1">
                  💡 Dica: Após salvar, você pode clicar em <strong>"Ajustar Foto"</strong> no card do barbeiro para carregar a foto do WhatsApp e regular o zoom circular.
                </p>
              </div>

              {/* HORÁRIOS E DIAS DE ATENDIMENTO DESTE BARBEIRO */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Dias & Horários de Trabalho deste Barbeiro</span>
                  </h4>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Marque os dias que este profissional atende e personalize os horários de início e término:
                </p>

                <div className="space-y-2.5 pt-1">
                  {DAYS_OF_WEEK.map((day) => {
                    const isChecked = barberWorkingDays.includes(day.id);
                    const hours = barberCustomHours[day.id] || { start: '09:00', end: '20:00' };

                    return (
                      <div
                        key={day.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl border text-xs gap-2 ${
                          isChecked
                            ? 'bg-neutral-900/90 border-amber-500/40 text-white'
                            : 'bg-neutral-950 border-neutral-900 text-neutral-500'
                        }`}
                      >
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleDay(day.id)}
                            className="rounded text-amber-500 focus:ring-0"
                          />
                          <span className="font-bold">{day.name}</span>
                        </label>

                        {isChecked && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-neutral-400">Das</span>
                            <input
                              type="time"
                              value={hours.start}
                              onChange={(e) => handleHourChange(day.id, 'start', e.target.value)}
                              className="px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-700 text-white text-xs font-mono outline-none focus:border-amber-500"
                            />
                            <span className="text-neutral-400">às</span>
                            <input
                              type="time"
                              value={hours.end}
                              onChange={(e) => handleHourChange(day.id, 'end', e.target.value)}
                              className="px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-700 text-white text-xs font-mono outline-none focus:border-amber-500"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Ativo */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="barberActiveCheck"
                  checked={barberActive}
                  onChange={(e) => setBarberActive(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <label htmlFor="barberActiveCheck" className="text-xs text-neutral-300 font-semibold cursor-pointer">
                  Profissional Ativo (clientes podem agendar horários com ele no site)
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsBarberModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Salvar Profissional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Crop Modal for adjusting original WhatsApp avatar */}
      <PhotoCropModal
        isOpen={!!cropModalBarber}
        onClose={() => setCropModalBarber(null)}
        barber={cropModalBarber}
      />
    </div>
  );
};
