import React, { useState } from 'react';
import { useBarber } from '../context/BarberContext';
import { BarberService, SubscriptionPlan } from '../types';
import { Clock, Check, ArrowRight, Crown, Sparkles, ShieldCheck, MessageCircle, Star, Zap } from 'lucide-react';

interface ServicesListProps {
  onSelectService: (service: BarberService) => void;
}

export const ServicesList: React.FC<ServicesListProps> = ({ onSelectService }) => {
  const { services, subscriptionPlans, generatePlanWhatsAppLink } = useBarber();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const categories = [
    { id: 'todos', label: 'Todos os Serviços' },
    { id: 'cabelo', label: 'Cortes & Cabelo' },
    { id: 'barba', label: 'Barba & Terapia' },
    { id: 'combo', label: 'Combos' },
    { id: 'estetica', label: 'Estética & Cuidados' },
    { id: 'planos', label: 'Planos Mensais VIP' },
  ];

  const filteredServices = services.filter((srv) => {
    if (selectedCategory === 'todos') return true;
    if (selectedCategory === 'cabelo') return srv.category === 'cabelo';
    if (selectedCategory === 'barba') return srv.category === 'barba';
    if (selectedCategory === 'combo') return srv.category === 'combo';
    if (selectedCategory === 'estetica') {
      return srv.category === 'outros' || srv.category === 'quimica_tratamento';
    }
    return true;
  });

  return (
    <section id="servicos" className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-amber-400 font-semibold tracking-wider text-xs uppercase block mb-1">
            Catálogo Oficial · Lorran Barros Barbearias
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
            Serviços & Especialidades
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Valores atualizados, produtos profissionais de alta performance e atendimento exclusivo com Lorran Barros.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {cat.id === 'planos' && <Crown className="w-3.5 h-3.5 inline mr-1 text-amber-400" />}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid (shown when not solely filtering for plans) */}
      {selectedCategory !== 'planos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/50 hover:bg-neutral-900/90 transition-all duration-300 shadow-lg hover:shadow-amber-500/5"
            >
              {/* Header info */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {service.name}
                  </h3>
                  {service.popular && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wide">
                      Mais Pedido
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 mb-4">
                  {service.description}
                </p>
              </div>

              {/* Price, duration and button */}
              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-neutral-400 font-medium">R$</span>
                    <span className="text-2xl font-black text-white font-accent">
                      {service.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-0.5">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span>{service.durationMinutes} minutos</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectService(service)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 hover:border-amber-500 text-amber-300 hover:text-neutral-950 font-bold text-xs uppercase tracking-wide transition-all duration-200 cursor-pointer group-hover:bg-amber-500 group-hover:text-neutral-950"
                >
                  <span>Agendar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MONTHLY SUBSCRIPTION PLANS (PLANOS MENSAIS) */}
      <div id="planos-mensais" className="mt-8 pt-10 border-t border-neutral-800/80">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Crown className="w-3.5 h-3.5" />
            <span>Clube de Assinatura Mensal</span>
          </div>
          <h3 className="font-heading text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Planos Mensais LB
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Mantenha seu visual alinhado o mês inteiro com economia garantida e horário prioritário.
          </p>

          {/* Golden VIP discount alert */}
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/30 flex items-center justify-center gap-2 text-xs text-amber-300 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Planos Premium e Master têm 15% de desconto em qualquer serviço e produto na LB Barbearias!</span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl transition-all duration-300 ${
                plan.highlight
                  ? 'bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 scale-102 sm:-translate-y-2'
                  : 'bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Top Tag */}
              {plan.tag && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${
                      plan.highlight
                        ? 'bg-amber-500 text-neutral-950'
                        : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    }`}
                  >
                    {plan.tag}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-heading text-xl font-black text-white uppercase tracking-wide">
                    {plan.name}
                  </h4>
                  {plan.highlight ? (
                    <Crown className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Zap className="w-4 h-4 text-neutral-400" />
                  )}
                </div>

                <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mb-6 p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
                  <span className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider block">
                    Mensalidade
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-sm font-bold text-amber-400">R$</span>
                    <span className="font-accent font-black text-3xl sm:text-4xl text-white">
                      {plan.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">/{plan.period}</span>
                  </div>
                </div>

                {/* Exclusive Discount Highlight Badge */}
                {plan.discountNotice && (
                  <div className="mb-5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-[11px] text-amber-300 font-bold leading-tight">
                      {plan.discountNotice}
                    </span>
                  </div>
                )}

                {/* Features List */}
                <div className="space-y-2.5 mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    O que está incluso:
                  </span>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Subscription Action via WhatsApp */}
              <a
                href={generatePlanWhatsAppLink(plan)}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20 active:scale-95'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 active:scale-95'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Quero Assinar este Plano</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
