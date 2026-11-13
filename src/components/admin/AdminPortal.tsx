import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import { Logo } from '../Logo';
import { TabAgenda } from './TabAgenda';
import { TabHorariosVagas } from './TabHorariosVagas';
import { TabEstoque } from './TabEstoque';
import { TabServicosEquipe } from './TabServicosEquipe';
import { TabConfiguracoes } from './TabConfiguracoes';
import { TabMetricasRelatorios } from './TabMetricasRelatorios';
import {
  Calendar,
  Clock,
  Package,
  Scissors,
  Settings,
  LogOut,
  Eye,
  AlertTriangle,
  Lock,
  TrendingUp,
} from 'lucide-react';

interface AdminPortalProps {
  onBackToClientView: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToClientView }) => {
  const { logoutAdmin, lowStockItems, appointments, shopInfo } = useBarber();
  const [activeTab, setActiveTab] = useState<'agenda' | 'metricas' | 'horarios' | 'estoque' | 'servicos' | 'config'>(
    'agenda'
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAptsCount = appointments.filter(
    (a) => a.date === todayStr && a.status !== 'cancelado'
  ).length;

  const handleLogout = () => {
    logoutAdmin();
    onBackToClientView();
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-neutral-100 flex flex-col relative">
      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <div className="absolute w-[800px] h-[800px] rounded-full bg-amber-500/[0.03] blur-[160px] pointer-events-none" />
        <img
          src="/assets/aistudio/Logo_Lorran_Barros_Fundo_Transparente_368b3698.png"
          alt=""
          aria-hidden="true"
          className="w-[85vw] max-w-[750px] object-contain opacity-[0.05] select-none filter contrast-125"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#090a0d_95%)] pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Admin Header */}
        <header className="sticky top-0 z-40 bg-[#0e1015]/95 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Logo size={42} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black tracking-wider text-base sm:text-lg text-white uppercase">
                  {shopInfo.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wide">
                  Painel de Gestão
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium">
                {shopInfo.address}, {shopInfo.neighborhood} · {shopInfo.whatsappFormatted}
              </p>
            </div>
          </div>

          {/* Quick exit & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToClientView}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ver Site do Cliente</span>
            </button>

            <button
              onClick={handleLogout}
              title="Encerrar Sessão de Administrador"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-t border-neutral-800/60 pt-1">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'agenda'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda & Agendamentos</span>
            {todayAptsCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeTab === 'agenda' ? 'bg-neutral-950 text-amber-400' : 'bg-neutral-800 text-neutral-200'
                }`}
              >
                {todayAptsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('metricas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'metricas'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Vendas & Relatórios</span>
          </button>

          <button
            onClick={() => setActiveTab('horarios')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'horarios'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Vagas & Horários</span>
          </button>

          <button
            onClick={() => setActiveTab('estoque')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'estoque'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Controle de Estoque</span>
            {lowStockItems.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('servicos')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'servicos'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Serviços & Barbeiros</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'config'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'agenda' && <TabAgenda />}
        {activeTab === 'metricas' && <TabMetricasRelatorios />}
        {activeTab === 'horarios' && <TabHorariosVagas />}
        {activeTab === 'estoque' && <TabEstoque />}
        {activeTab === 'servicos' && <TabServicosEquipe />}
        {activeTab === 'config' && <TabConfiguracoes />}
      </main>
      </div>
    </div>
  );
};
