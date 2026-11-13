import React, { useState, useMemo } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface MonthStat {
  monthKey: string; // YYYY-MM
  label: string;
  shortLabel: string;
  revenue: number;
  clientCount: number;
  averageTicket: number;
  topService: string;
}

export const TabMetricasRelatorios: React.FC = () => {
  const { appointments, staff, services } = useBarber();
  const [selectedBarberFilter, setSelectedBarberFilter] = useState<string>('all');
  const [selectedMetricView, setSelectedMetricView] = useState<'faturamento' | 'clientes'>('faturamento');

  // Month names in pt-BR
  const MONTH_NAMES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const SHORT_MONTH_NAMES = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  // Calculate monthly stats for the last 4 calendar months
  const monthlyData = useMemo<MonthStat[]>(() => {
    const today = new Date();
    const months: MonthStat[] = [];

    // Filter appointments (concluded or confirmed)
    const validAppointments = appointments.filter((a) => {
      if (a.status === 'cancelado') return false;
      if (selectedBarberFilter !== 'all' && a.barberId !== selectedBarberFilter) return false;
      return true;
    });

    for (let i = 3; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

      // Find appointments in this month
      const monthApts = validAppointments.filter((a) => a.date.startsWith(monthKey));
      const revenue = monthApts.reduce((sum, a) => sum + (a.price || 0), 0);
      const clientCount = monthApts.length;
      const averageTicket = clientCount > 0 ? revenue / clientCount : 0;

      // Find top service
      const serviceCounts: { [name: string]: number } = {};
      monthApts.forEach((a) => {
        serviceCounts[a.serviceName] = (serviceCounts[a.serviceName] || 0) + 1;
      });
      let topService = 'Nenhum';
      let maxCount = 0;
      Object.entries(serviceCounts).forEach(([name, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topService = name;
        }
      });

      months.push({
        monthKey,
        label: `${MONTH_NAMES[month]} ${year}`,
        shortLabel: `${SHORT_MONTH_NAMES[month]}`,
        revenue,
        clientCount,
        averageTicket,
        topService,
      });
    }

    return months;
  }, [appointments, selectedBarberFilter]);

  // Current month vs Previous month comparison
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];

  const revenueDiff = currentMonth.revenue - previousMonth.revenue;
  const revenuePercent = previousMonth.revenue > 0
    ? ((revenueDiff / previousMonth.revenue) * 100).toFixed(1)
    : '0';

  const clientsDiff = currentMonth.clientCount - previousMonth.clientCount;
  const clientsPercent = previousMonth.clientCount > 0
    ? ((clientsDiff / previousMonth.clientCount) * 100).toFixed(1)
    : '0';

  const ticketDiff = currentMonth.averageTicket - previousMonth.averageTicket;

  // Max revenue and max clients for SVG bar scaling
  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 100);
  const maxClients = Math.max(...monthlyData.map((m) => m.clientCount), 10);

  // Daily appointments distribution for the current month
  const serviceDistribution = useMemo(() => {
    const valid = appointments.filter((a) => {
      if (a.status === 'cancelado') return false;
      if (selectedBarberFilter !== 'all' && a.barberId !== selectedBarberFilter) return false;
      return true;
    });

    const counts: { [srv: string]: { count: number; total: number } } = {};
    valid.forEach((a) => {
      if (!counts[a.serviceName]) {
        counts[a.serviceName] = { count: 0, total: 0 };
      }
      counts[a.serviceName].count += 1;
      counts[a.serviceName].total += a.price;
    });

    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [appointments, selectedBarberFilter]);

  // Total summary stats
  const totalRevenueAllTime = useMemo(() => {
    return appointments
      .filter((a) => a.status !== 'cancelado')
      .reduce((sum, a) => sum + (a.price || 0), 0);
  }, [appointments]);

  const totalClientsAllTime = useMemo(() => {
    return appointments.filter((a) => a.status !== 'cancelado').length;
  }, [appointments]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-neutral-900 via-[#131620] to-neutral-900 border border-neutral-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
              Painel de Desempenho
            </span>
            <span className="text-xs text-neutral-400">Tempo Real</span>
          </div>
          <h2 className="font-heading text-2xl font-black text-white uppercase tracking-tight mt-1">
            Gráficos de Vendas & Fluxo de Clientes
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Acompanhe o faturamento, volume de atendimentos e comparativos percentuais com os meses anteriores.
          </p>
        </div>

        {/* Barber Filter */}
        <div className="flex items-center gap-2.5 bg-neutral-950/70 p-2 rounded-2xl border border-neutral-800">
          <Filter className="w-4 h-4 text-amber-400 ml-1 shrink-0" />
          <span className="text-xs text-neutral-400 hidden sm:inline">Filtrar por:</span>
          <select
            value={selectedBarberFilter}
            onChange={(e) => setSelectedBarberFilter(e.target.value)}
            className="bg-neutral-900 border border-neutral-700/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-white outline-none cursor-pointer focus:border-amber-500"
          >
            <option value="all">Toda a Barbearia</option>
            {staff.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Highlight Cards with Month-over-Month Comparisons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Faturamento Mensal */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Faturamento no Mês
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-accent font-black text-2xl sm:text-3xl text-white">
            R$ {currentMonth.revenue.toFixed(2).replace('.', ',')}
          </p>

          <div className="flex items-center gap-1.5 mt-2.5 text-xs">
            {revenueDiff >= 0 ? (
              <span className="inline-flex items-center font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +{revenuePercent}%
              </span>
            ) : (
              <span className="inline-flex items-center font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                {revenuePercent}%
              </span>
            )}
            <span className="text-neutral-500 text-[11px]">vs. mês anterior (R$ {previousMonth.revenue.toFixed(0)})</span>
          </div>
        </div>

        {/* Card 2: Fluxo de Clientes */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Clientes Atendidos
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-accent font-black text-2xl sm:text-3xl text-white">
            {currentMonth.clientCount}{' '}
            <span className="text-sm font-normal text-neutral-400">clientes</span>
          </p>

          <div className="flex items-center gap-1.5 mt-2.5 text-xs">
            {clientsDiff >= 0 ? (
              <span className="inline-flex items-center font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +{clientsPercent}%
              </span>
            ) : (
              <span className="inline-flex items-center font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                {clientsPercent}%
              </span>
            )}
            <span className="text-neutral-500 text-[11px]">vs. mês anterior ({previousMonth.clientCount})</span>
          </div>
        </div>

        {/* Card 3: Ticket Médio */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Ticket Médio
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-accent font-black text-2xl sm:text-3xl text-white">
            R$ {currentMonth.averageTicket.toFixed(2).replace('.', ',')}
          </p>

          <div className="flex items-center gap-1.5 mt-2.5 text-xs">
            <span
              className={`inline-flex items-center font-bold px-2 py-0.5 rounded-full border ${
                ticketDiff >= 0
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-neutral-400 bg-neutral-800 border-neutral-700'
              }`}
            >
              {ticketDiff >= 0 ? `+R$ ${ticketDiff.toFixed(2)}` : `-R$ ${Math.abs(ticketDiff).toFixed(2)}`}
            </span>
            <span className="text-neutral-500 text-[11px]">por atendimento</span>
          </div>
        </div>

        {/* Card 4: Faturamento Histórico Acumulado */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Total Acumulado
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="font-accent font-black text-2xl sm:text-3xl text-emerald-400">
            R$ {totalRevenueAllTime.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-neutral-500 text-[11px] mt-2.5">
            {totalClientsAllTime} atendimentos registrados
          </p>
        </div>
      </div>

      {/* Main Interactive Comparison Chart: Meses Anteriores */}
      <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span>Comparativo de Meses Anteriores</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Evolução mês a mês de faturamento e volume de clientes na Lorran Barros Barbearias
            </p>
          </div>

          {/* Toggle metric view */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 self-start sm:self-auto">
            <button
              onClick={() => setSelectedMetricView('faturamento')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMetricView === 'faturamento'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Faturamento (R$)
            </button>
            <button
              onClick={() => setSelectedMetricView('clientes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMetricView === 'clientes'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Fluxo de Clientes
            </button>
          </div>
        </div>

        {/* Visual Bar Chart Comparison Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          {monthlyData.map((month, idx) => {
            const isLatest = idx === monthlyData.length - 1;
            const heightPercent = selectedMetricView === 'faturamento'
              ? (month.revenue === 0 ? 0 : Math.max(8, Math.round((month.revenue / maxRevenue) * 100)))
              : (month.clientCount === 0 ? 0 : Math.max(8, Math.round((month.clientCount / maxClients) * 100)));

            return (
              <div
                key={month.monthKey}
                className={`flex flex-col justify-end p-5 rounded-2xl border transition-all ${
                  isLatest
                    ? 'bg-gradient-to-t from-amber-500/10 via-neutral-900 to-neutral-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                {/* Value at top */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">
                      {month.shortLabel}
                    </span>
                    {isLatest && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-500 text-neutral-950">
                        Atual
                      </span>
                    )}
                  </div>
                  <p className="font-accent font-black text-lg sm:text-xl text-white mt-1">
                    {selectedMetricView === 'faturamento'
                      ? `R$ ${month.revenue.toFixed(0)}`
                      : `${month.clientCount} clientes`}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Média: R$ {month.averageTicket.toFixed(0)}/cliente
                  </p>
                </div>

                {/* Animated visual column bar */}
                <div className="w-full bg-neutral-900 rounded-xl h-36 p-1 flex items-end">
                  <div
                    className={`w-full rounded-lg transition-all duration-700 ${
                      isLatest
                        ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-neutral-700 hover:bg-neutral-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Label footer */}
                <div className="mt-3 pt-3 border-t border-neutral-800 text-center">
                  <p className="text-xs font-bold text-neutral-300">{month.label}</p>
                  <p className="text-[10px] text-amber-400/90 truncate mt-0.5">
                    Top: {month.topService}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytical comparison summary table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                <th className="py-2.5 px-3">Mês</th>
                <th className="py-2.5 px-3 text-right">Faturamento</th>
                <th className="py-2.5 px-3 text-right">Clientes Atendidos</th>
                <th className="py-2.5 px-3 text-right">Ticket Médio</th>
                <th className="py-2.5 px-3 text-right">Variação Faturamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {monthlyData.map((m, i) => {
                const prev = i > 0 ? monthlyData[i - 1] : null;
                const diff = prev ? m.revenue - prev.revenue : 0;
                const pct = prev && prev.revenue > 0 ? ((diff / prev.revenue) * 100).toFixed(1) : '-';

                return (
                  <tr key={m.monthKey} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <span>{m.label}</span>
                      {i === monthlyData.length - 1 && (
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-accent font-bold text-white">
                      R$ {m.revenue.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-neutral-300">
                      {m.clientCount}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-neutral-300">
                      R$ {m.averageTicket.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {prev ? (
                        <span
                          className={`font-bold inline-flex items-center gap-0.5 ${
                            diff >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {diff >= 0 ? `+${pct}%` : `${pct}%`}
                        </span>
                      ) : (
                        <span className="text-neutral-500">Base</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Services Ranking & Client Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most requested services */}
        <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider">
                Serviços Mais Lucrativos
              </h3>
              <p className="text-xs text-neutral-400">Classificação por receita total gerada</p>
            </div>
            <Award className="w-5 h-5 text-amber-400" />
          </div>

          <div className="space-y-3">
            {serviceDistribution.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-500">
                Nenhum atendimento registrado até o momento. Os serviços realizados aparecerão aqui.
              </div>
            ) : (
              serviceDistribution.slice(0, 5).map((item, idx) => {
                const maxSrvTotal = serviceDistribution[0]?.total || 1;
                const barWidth = Math.round((item.total / maxSrvTotal) * 100);

                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-neutral-200">
                        #{idx + 1} {item.name}
                      </span>
                      <span className="font-accent font-bold text-amber-400">
                        R$ {item.total.toFixed(2).replace('.', ',')} ({item.count} {item.count === 1 ? 'atendimento' : 'atendimentos'})
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Team Performance Overview */}
        <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider">
                Desempenho dos Profissionais
              </h3>
              <p className="text-xs text-neutral-400">Produtividade e faturamento por barbeiro</p>
            </div>
            <Users className="w-5 h-5 text-amber-400" />
          </div>

          <div className="space-y-3">
            {staff.map((barber) => {
              const barberApts = appointments.filter(
                (a) => a.barberId === barber.id && a.status !== 'cancelado'
              );
              const barberRevenue = barberApts.reduce((sum, a) => sum + (a.price || 0), 0);

              return (
                <div
                  key={barber.id}
                  className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/40 bg-neutral-900 shrink-0">
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
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-amber-400">
                          {barber.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{barber.name}</h4>
                      <p className="text-[11px] text-neutral-400">{barber.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-accent font-bold text-sm text-amber-400 block">
                      R$ {barberRevenue.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {barberApts.length} atendimentos
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
