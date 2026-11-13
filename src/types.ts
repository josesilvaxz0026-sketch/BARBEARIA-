export type AppointmentStatus = 'pendente' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';

export interface BarberService {
  id: string;
  name: string;
  category: 'cabelo' | 'barba' | 'combo' | 'quimica_tratamento' | 'outros';
  durationMinutes: number;
  price: number;
  description: string;
  popular?: boolean;
  consumables?: {
    itemId: string;
    quantity: number;
  }[];
}

export interface BarberStaff {
  id: string;
  name: string;
  nickname: string;
  role: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  avatarScale?: number;
  avatarOffsetX?: number;
  avatarOffsetY?: number;
  active: boolean;
  // Specific custom schedule per staff member (days active & custom shifts)
  workingDays?: number[]; // e.g. [1, 2, 3, 4, 5, 6]
  customHours?: {
    [dayOfWeek: number]: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
}

export interface Appointment {
  id: string;
  code: string; // e.g. BS-8421
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  barberId: string;
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  price: number;
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'consumo_interno' | 'pomadas_finalizadores' | 'barba' | 'higiene_descartaveis' | 'quimica' | 'bebidas' | 'outros';
  type: 'consumo_interno' | 'venda_cliente';
  currentStock: number;
  minStockAlert: number;
  costPrice: number;
  sellingPrice?: number;
  unit: 'un' | 'ml' | 'cx' | 'pct';
  lastRestocked?: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'entrada' | 'saida_atendimento' | 'saida_venda' | 'saida_perda' | 'ajuste';
  quantity: number;
  previousStock: number;
  newStock: number;
  notes?: string;
  timestamp: string;
  appointmentId?: string;
}

export interface DaySchedule {
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  dayName: string;
  enabled: boolean;
  openTime: string; // e.g. "09:00"
  closeTime: string; // e.g. "20:00"
  slotIntervalMinutes: number; // e.g. 30
  lunchBreakEnabled: boolean;
  lunchBreakStart?: string; // e.g. "12:00"
  lunchBreakEnd?: string; // e.g. "13:00"
  defaultCapacityPerSlot: number; // vagas por horário (e.g. 2 ou 3 cadeiras)
  // Horários customizados desativados ou com vagas diferenciadas:
  slotOverrides?: {
    [time: string]: {
      enabled: boolean;
      capacity?: number;
    };
  };
}

export interface ShopInfo {
  name: string;
  whatsapp: string; // e.g. 21979669281
  whatsappFormatted: string; // e.g. (21) 97966-9281
  address: string;
  neighborhood: string;
  city: string;
  adminPin: string; // Default '1234'
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  highlight?: boolean;
  tag?: string;
  features: string[];
  discountNotice?: string;
  description: string;
}

