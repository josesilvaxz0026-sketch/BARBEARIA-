import { BarberService, BarberStaff, DaySchedule, InventoryItem, ShopInfo, Appointment, SubscriptionPlan } from '../types';
import luisHenriqueImg from '../assets/images/luis_henrique.jpg';
import lorranBarrosImg from '../assets/images/lorran_barros.jpg';
import corteFadeImg from '../assets/images/corte_fade.jpg';
import corteBarbaImg from '../assets/images/barba_logo_completa_1794264703981.jpg';
import corteNevouImg from '../assets/images/corte_nevou.jpg';
import corteFreestyleImg from '../assets/images/corte_freestyle.jpg';

export const INITIAL_SHOP_INFO: ShopInfo = {
  name: 'Lorran Barros Barbearias',
  whatsapp: '21979669281',
  whatsappFormatted: '(21) 97966-9281',
  address: 'Rua Coronel Júlio Braga, nº 78',
  neighborhood: 'Areia Branca',
  city: 'Belford Roxo - RJ',
  adminPin: '1234',
};

export const INITIAL_STAFF: BarberStaff[] = [
  {
    id: 'barber-lorran-barros',
    name: 'Lorran Barros',
    nickname: 'Lorran Barros',
    role: 'Master Barber & Visagista',
    avatarUrl: lorranBarrosImg,
    active: true,
  },
];

export interface HaircutItem {
  id: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  imageUrl: string;
  serviceId: string;
}

export const HAIRCUT_GALLERY: HaircutItem[] = [
  {
    id: 'cut-1',
    title: 'Degradê Navalhado (Skin Fade)',
    category: 'Corte Moderno',
    tag: 'Mais Pedido',
    description: 'Transição perfeita da pele até o topo texturizado com acabamento cirúrgico na navalha afiada.',
    imageUrl: corteFadeImg,
    serviceId: 'srv-corte-disfarcado',
  },
  {
    id: 'cut-2',
    title: 'Barboterapia & Alinhamento',
    category: 'Barba & Cuidados',
    tag: 'Relaxamento',
    description: 'Toalha quente vaporizada, óleos essenciais relaxantes e desenho impecável na navalha.',
    imageUrl: corteBarbaImg,
    serviceId: 'srv-barboterapia',
  },
  {
    id: 'cut-3',
    title: 'Nevou / Platinado Global',
    category: 'Química & Cor',
    tag: 'Tendência',
    description: 'Descoloração uniforme e saudável em tom branco polar com degradê nas laterais.',
    imageUrl: corteNevouImg,
    serviceId: 'srv-corte-disfarcado',
  },
  {
    id: 'cut-4',
    title: 'Freestyle & Risquinho na Régua',
    category: 'Design & Arte',
    tag: 'Destaque',
    description: 'Linhas geométricas simétricas e desenhos personalizados esculpidos com máxima precisão.',
    imageUrl: corteFreestyleImg,
    serviceId: 'srv-corte-disfarcado',
  },
];

export const INITIAL_SERVICES: BarberService[] = [
  {
    id: 'srv-corte-simples',
    name: 'Corte Simples',
    category: 'cabelo',
    durationMinutes: 30,
    price: 25.0,
    description: 'Corte tradicional alinhado na máquina ou tesoura com acabamento limpo no pezinho.',
    popular: false,
    consumables: [
      { itemId: 'inv-laminas', quantity: 1 },
      { itemId: 'inv-golas', quantity: 1 },
    ],
  },
  {
    id: 'srv-corte-disfarcado',
    name: 'Corte Disfarçado',
    category: 'cabelo',
    durationMinutes: 40,
    price: 40.0,
    description: 'Degradê na régua (Fade, Low, Mid, Taper) com transição suave, textura no topo e acabamento cirúrgico.',
    popular: true,
    consumables: [
      { itemId: 'inv-laminas', quantity: 1 },
      { itemId: 'inv-golas', quantity: 1 },
    ],
  },
  {
    id: 'srv-corte-maquina-tesoura',
    name: 'Corte Máquina e Tesoura',
    category: 'cabelo',
    durationMinutes: 45,
    price: 50.0,
    description: 'Combinação técnica de máquina nas laterais com trabalho detalhado na tesoura para caimento perfeito.',
    popular: true,
    consumables: [
      { itemId: 'inv-laminas', quantity: 1 },
      { itemId: 'inv-golas', quantity: 1 },
    ],
  },
  {
    id: 'srv-corte-infantil',
    name: 'Corte Infantil',
    category: 'cabelo',
    durationMinutes: 40,
    price: 50.0,
    description: 'Atendimento paciente, cuidadoso e especializado para os pequenos ficarem no mais alto estilo.',
    popular: false,
    consumables: [
      { itemId: 'inv-laminas', quantity: 1 },
      { itemId: 'inv-golas', quantity: 1 },
    ],
  },
  {
    id: 'srv-combo-corte-barba',
    name: 'Combo Corte e Barba',
    category: 'combo',
    durationMinutes: 60,
    price: 60.0,
    description: 'O combo preferido: corte completo no seu estilo + alinhamento de barba com toalha e pós-barba.',
    popular: true,
    consumables: [
      { itemId: 'inv-laminas', quantity: 2 },
      { itemId: 'inv-golas', quantity: 1 },
      { itemId: 'inv-locao-pos', quantity: 1 },
    ],
  },
  {
    id: 'srv-barba-simples',
    name: 'Barba Simples',
    category: 'barba',
    durationMinutes: 25,
    price: 30.0,
    description: 'Aparação de volume, alinhamento e desenho das linhas da barba com navalha e hidratação.',
    popular: false,
    consumables: [
      { itemId: 'inv-laminas', quantity: 1 },
      { itemId: 'inv-locao-pos', quantity: 1 },
    ],
  },
  {
    id: 'srv-barboterapia',
    name: 'Barboterapia',
    category: 'barba',
    durationMinutes: 40,
    price: 40.0,
    description: 'Experiência relaxante com toalha quente vaporizada, óleos essenciais, esfoliação facial e navalha afiada.',
    popular: true,
    consumables: [
      { itemId: 'inv-laminas', quantity: 1 },
      { itemId: 'inv-locao-pos', quantity: 1 },
    ],
  },
  {
    id: 'srv-cavanhaque',
    name: 'Cavanhaque',
    category: 'barba',
    durationMinutes: 20,
    price: 25.0,
    description: 'Desenho simétrico, modelagem precisa e alinhamento exclusivo de cavanhaque na navalha.',
    popular: false,
    consumables: [{ itemId: 'inv-laminas', quantity: 1 }],
  },
  {
    id: 'srv-bigode',
    name: 'Bigode',
    category: 'barba',
    durationMinutes: 15,
    price: 10.0,
    description: 'Aparação de pelos rebeldes, alinhamento simétrico e acabamento fino na régua.',
    popular: false,
    consumables: [{ itemId: 'inv-laminas', quantity: 1 }],
  },
  {
    id: 'srv-pigmentacao',
    name: 'Pigmentação',
    category: 'quimica_tratamento',
    durationMinutes: 25,
    price: 25.0,
    description: 'Preenchimento e disfarce de falhas com pigmento especializado para barba ou acabamento de cabelo.',
    popular: false,
    consumables: [
      { itemId: 'inv-tonalizante', quantity: 1 },
      { itemId: 'inv-golas', quantity: 1 },
    ],
  },
  {
    id: 'srv-sobrancelha',
    name: 'Sobrancelha',
    category: 'outros',
    durationMinutes: 15,
    price: 12.0,
    description: 'Design e limpeza das sobrancelhas masculinas na navalha ou pinça mantendo a naturalidade.',
    popular: false,
    consumables: [{ itemId: 'inv-laminas', quantity: 1 }],
  },
  {
    id: 'srv-limpeza-pele-simples',
    name: 'Limpeza de Pele Simples',
    category: 'outros',
    durationMinutes: 30,
    price: 25.0,
    description: 'Higienização facial, esfoliação suave e hidratação para remoção de oleosidade e impurezas.',
    popular: false,
    consumables: [{ itemId: 'inv-golas', quantity: 1 }],
  },
  {
    id: 'srv-limpeza-pele-profunda',
    name: 'Limpeza de Pele Profunda',
    category: 'outros',
    durationMinutes: 45,
    price: 35.0,
    description: 'Higienização profunda, vapor, extração de cravos, máscara purificante e revitalização facial.',
    popular: true,
    consumables: [{ itemId: 'inv-golas', quantity: 1 }],
  },
  {
    id: 'srv-epilacao-nasal',
    name: 'Epilação Nasal',
    category: 'outros',
    durationMinutes: 15,
    price: 15.0,
    description: 'Remoção higiênica e rápida de pelos das narinas com cera morna hipoalergênica.',
    popular: false,
    consumables: [{ itemId: 'inv-golas', quantity: 1 }],
  },
];

export const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plano-simples',
    name: 'Plano Simples',
    price: 99.90,
    period: 'mês',
    highlight: false,
    tag: 'Econômico',
    description: 'Para quem gosta de manter o cabelo alinhado na régua toda semana.',
    features: [
      '4 Cortes no mês (1 por semana)',
      'Agendamento prioritário online',
      'Atendimento exclusivo com Lorran Barros',
      'Validade mensal com renovação automática opcional',
    ],
  },
  {
    id: 'plano-premium-lb',
    name: 'Plano Premium LB',
    price: 119.90,
    period: 'mês',
    highlight: true,
    tag: 'Mais Popular',
    description: 'Cabelo e olhar marcante impecáveis com desconto VIP em toda a barbearia.',
    discountNotice: '15% de desconto em qualquer serviço e produto na LB Barbearias',
    features: [
      '4 Cortes no mês',
      '2 Sobrancelhas no mês',
      '15% de desconto em qualquer serviço extra',
      '15% de desconto em produtos e pomadas',
      'Atendimento VIP prioritário',
    ],
  },
  {
    id: 'plano-master-lb',
    name: 'Plano Master LB',
    price: 149.90,
    period: 'mês',
    highlight: false,
    tag: 'Experiência Completa',
    description: 'O cuidado completo supremo: cabelo, barba e sobrancelha sempre impecáveis.',
    discountNotice: '15% de desconto em qualquer serviço e produto na LB Barbearias',
    features: [
      '4 Cortes no mês',
      '4 Barbas completas no mês',
      '2 Sobrancelhas no mês',
      '15% de desconto em qualquer serviço extra',
      '15% de desconto em produtos e pomadas',
      'Acesso VIP a horários especiais',
    ],
  },
];

export const INITIAL_INVENTORY: InventoryItem[] = [];

export const INITIAL_SCHEDULE: DaySchedule[] = [
  {
    dayOfWeek: 0, // Domingo
    dayName: 'Domingo',
    enabled: true,
    openTime: '09:00',
    closeTime: '14:00',
    slotIntervalMinutes: 30,
    lunchBreakEnabled: false,
    defaultCapacityPerSlot: 2, // 2 vagas simultâneas no domingo
  },
  {
    dayOfWeek: 1, // Segunda-feira
    dayName: 'Segunda-feira',
    enabled: true,
    openTime: '09:00',
    closeTime: '20:00',
    slotIntervalMinutes: 30,
    lunchBreakEnabled: true,
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:00',
    defaultCapacityPerSlot: 2, // 2 cadeiras/vagas
  },
  {
    dayOfWeek: 2, // Terça-feira
    dayName: 'Terça-feira',
    enabled: true,
    openTime: '09:00',
    closeTime: '20:00',
    slotIntervalMinutes: 30,
    lunchBreakEnabled: true,
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:00',
    defaultCapacityPerSlot: 2,
  },
  {
    dayOfWeek: 3, // Quarta-feira
    dayName: 'Quarta-feira',
    enabled: true,
    openTime: '09:00',
    closeTime: '20:00',
    slotIntervalMinutes: 30,
    lunchBreakEnabled: true,
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:00',
    defaultCapacityPerSlot: 2,
  },
  {
    dayOfWeek: 4, // Quinta-feira
    dayName: 'Quinta-feira',
    enabled: true,
    openTime: '09:00',
    closeTime: '20:00',
    slotIntervalMinutes: 30,
    lunchBreakEnabled: true,
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:00',
    defaultCapacityPerSlot: 3,
  },
  {
    dayOfWeek: 5, // Sexta-feira
    dayName: 'Sexta-feira',
    enabled: true,
    openTime: '08:30',
    closeTime: '20:30',
    slotIntervalMinutes: 30,
    lunchBreakEnabled: false,
    defaultCapacityPerSlot: 3, // 3 cadeiras na sexta de pico
  },
  {
    dayOfWeek: 6, // Sábado
    dayName: 'Sábado',
    enabled: true,
    openTime: '08:30',
    closeTime: '20:30',
    slotIntervalMinutes: 30,
    lunchBreakEnabled: false,
    defaultCapacityPerSlot: 3, // 3 cadeiras no sábado de pico
  },
];

// Helper to format ISO date YYYY-MM-DD
export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getFutureDateString = (daysAhead: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getPastDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_APPOINTMENTS: Appointment[] = [];

