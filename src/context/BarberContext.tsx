import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Appointment,
  AppointmentStatus,
  BarberService,
  BarberStaff,
  DaySchedule,
  InventoryItem,
  ShopInfo,
  StockMovement,
  SubscriptionPlan,
} from '../types';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_INVENTORY,
  INITIAL_SCHEDULE,
  INITIAL_SERVICES,
  INITIAL_SHOP_INFO,
  INITIAL_STAFF,
  INITIAL_SUBSCRIPTION_PLANS,
} from '../data/initialData';

export interface SlotAvailability {
  time: string;
  totalCapacity: number;
  bookedCount: number;
  availableSpots: number;
  isAvailable: boolean;
  isBlocked: boolean;
  blockReason?: string;
}

interface BarberContextType {
  shopInfo: ShopInfo;
  updateShopInfo: (info: Partial<ShopInfo>) => void;
  updateAdminPin: (newPin: string) => boolean;

  // Admin Auth
  isAdminLoggedIn: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;

  // Appointments
  appointments: Appointment[];
  bookAppointment: (data: {
    clientName: string;
    clientPhone: string;
    serviceId: string;
    barberId: string;
    date: string;
    time: string;
    notes?: string;
  }) => { success: boolean; appointment?: Appointment; error?: string };
  updateAppointmentStatus: (id: string, status: AppointmentStatus, autoDeductStock?: boolean) => void;
  cancelAppointment: (id: string) => void;
  getAppointmentsByPhone: (phone: string) => Appointment[];

  // Schedule & Capacity
  schedule: DaySchedule[];
  updateDaySchedule: (dayOfWeek: number, updates: Partial<DaySchedule>) => void;
  updateSlotCapacityOverride: (dayOfWeek: number, time: string, enabled: boolean, capacity?: number) => void;
  getAvailableSlotsForDate: (dateStr: string) => SlotAvailability[];
  isDateOpen: (dateStr: string) => boolean;

  // Inventory
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  addStockMovement: (
    itemId: string,
    type: StockMovement['type'],
    quantity: number,
    notes?: string,
    appointmentId?: string
  ) => boolean;
  createInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  lowStockItems: InventoryItem[];

  // Services & Staff
  services: BarberService[];
  staff: BarberStaff[];
  subscriptionPlans: SubscriptionPlan[];
  createService: (service: Omit<BarberService, 'id'>) => void;
  updateService: (id: string, updates: Partial<BarberService>) => void;
  deleteService: (id: string) => void;
  createBarber: (barber: Omit<BarberStaff, 'id'>) => void;
  updateBarber: (id: string, updates: Partial<BarberStaff>) => void;
  deleteBarber: (id: string) => void;

  // Helpers
  generateWhatsAppLink: (appointment: Appointment) => string;
  generatePlanWhatsAppLink: (plan: SubscriptionPlan) => string;
  clearManagementData: () => void;
  resetToDefaults: () => void;
  exportBackupJson: () => string;
  importBackupJson: (jsonStr: string) => boolean;
}

const BarberContext = createContext<BarberContextType | null>(null);

const STORAGE_KEYS = {
  SHOP_INFO: 'black_styllus_shop_info_v1',
  APPOINTMENTS: 'lb_barbearias_appointments_v2',
  SCHEDULE: 'black_styllus_schedule_v1',
  INVENTORY: 'lb_barbearias_inventory_v2',
  MOVEMENTS: 'lb_barbearias_movements_v2',
  SERVICES: 'lb_barbearias_services_v2',
  PLANS: 'lb_barbearias_plans_v1',
  STAFF: 'black_styllus_staff_v1',
  ADMIN_AUTH: 'black_styllus_admin_auth_v1',
};

export const BarberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Shop Info
  const [shopInfo, setShopInfo] = useState<ShopInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHOP_INFO);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.name || parsed.name.toLowerCase().includes('black styllus') || parsed.name === 'Lorran Barros Barbearia') {
          parsed.name = INITIAL_SHOP_INFO.name;
          localStorage.setItem(STORAGE_KEYS.SHOP_INFO, JSON.stringify(parsed));
        }
        return parsed;
      } catch {
        return INITIAL_SHOP_INFO;
      }
    }
    return INITIAL_SHOP_INFO;
  });

  // Admin Auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_APPOINTMENTS;
      }
    }
    return INITIAL_APPOINTMENTS;
  });

  // Schedule & Capacity
  const [schedule, setSchedule] = useState<DaySchedule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  // Inventory & Movements
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
    return saved ? JSON.parse(saved) : [];
  });

  // Services, Plans & Staff
  const [services, setServices] = useState<BarberService[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTION_PLANS;
  });

  const [staff, setStaff] = useState<BarberStaff[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clean out legacy default test profiles if any were saved, but preserve newly added barbers
        const filtered = parsed.filter(
          (b: any) =>
            !b.name?.toLowerCase().includes('luiz') &&
            !b.name?.toLowerCase().includes('luis') &&
            !b.name?.toLowerCase().includes('alexandre') &&
            !b.name?.toLowerCase().includes('thiago') &&
            !b.name?.toLowerCase().includes('marcos')
        );
        // Ensure Lorran Barros is always present
        if (!filtered.some((b: any) => b.id === 'barber-lorran-barros')) {
          filtered.unshift(INITIAL_STAFF[0]);
        }
        return filtered;
      } catch {
        return INITIAL_STAFF;
      }
    }
    return INITIAL_STAFF;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOP_INFO, JSON.stringify(shopInfo));
  }, [shopInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(subscriptionPlans));
  }, [subscriptionPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  }, [staff]);

  // Admin Auth functions
  const loginAdmin = useCallback(
    (pin: string) => {
      if (pin.trim() === shopInfo.adminPin) {
        setIsAdminLoggedIn(true);
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        return true;
      }
      return false;
    },
    [shopInfo.adminPin]
  );

  const logoutAdmin = useCallback(() => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }, []);

  const updateAdminPin = useCallback((newPin: string) => {
    if (newPin.trim().length >= 4) {
      setShopInfo((prev) => ({ ...prev, adminPin: newPin.trim() }));
      return true;
    }
    return false;
  }, []);

  const updateShopInfo = useCallback((info: Partial<ShopInfo>) => {
    setShopInfo((prev) => ({ ...prev, ...info }));
  }, []);

  // Check if a date string (YYYY-MM-DD) is open
  const isDateOpen = useCallback(
    (dateStr: string) => {
      if (!dateStr) return false;
      const parts = dateStr.split('-');
      if (parts.length !== 3) return false;
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const dayOfWeek = d.getDay();
      const dayConfig = schedule.find((s) => s.dayOfWeek === dayOfWeek);
      return !!dayConfig?.enabled;
    },
    [schedule]
  );

  // Time slot generator and availability calculation
  const getAvailableSlotsForDate = useCallback(
    (dateStr: string): SlotAvailability[] => {
      if (!dateStr) return [];
      const parts = dateStr.split('-');
      if (parts.length !== 3) return [];
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const dayOfWeek = d.getDay();
      const dayConfig = schedule.find((s) => s.dayOfWeek === dayOfWeek);

      if (!dayConfig || !dayConfig.enabled) {
        return [];
      }

      const [startHour, startMin] = dayConfig.openTime.split(':').map(Number);
      const [closeHour, closeMin] = dayConfig.closeTime.split(':').map(Number);
      const interval = dayConfig.slotIntervalMinutes || 30;

      const startTotalMinutes = startHour * 60 + startMin;
      const closeTotalMinutes = closeHour * 60 + closeMin;

      const lunchStartMin = dayConfig.lunchBreakEnabled && dayConfig.lunchBreakStart
        ? dayConfig.lunchBreakStart.split(':').map(Number)[0] * 60 + dayConfig.lunchBreakStart.split(':').map(Number)[1]
        : -1;
      const lunchEndMin = dayConfig.lunchBreakEnabled && dayConfig.lunchBreakEnd
        ? dayConfig.lunchBreakEnd.split(':').map(Number)[0] * 60 + dayConfig.lunchBreakEnd.split(':').map(Number)[1]
        : -1;

      // Filter active appointments for this date
      const activeBookingsForDate = appointments.filter(
        (a) => a.date === dateStr && a.status !== 'cancelado'
      );

      const slots: SlotAvailability[] = [];

      for (let m = startTotalMinutes; m < closeTotalMinutes; m += interval) {
        const hh = String(Math.floor(m / 60)).padStart(2, '0');
        const mm = String(m % 60).padStart(2, '0');
        const timeStr = `${hh}:${mm}`;

        // Check lunch pause
        let isLunch = false;
        if (dayConfig.lunchBreakEnabled && lunchStartMin >= 0 && lunchEndMin >= 0) {
          if (m >= lunchStartMin && m < lunchEndMin) {
            isLunch = true;
          }
        }

        // Check custom override for this specific time slot
        const override = dayConfig.slotOverrides?.[timeStr];
        const isEnabledSlot = override?.enabled !== undefined ? override.enabled : !isLunch;
        const totalCapacity = override?.capacity !== undefined
          ? override.capacity
          : dayConfig.defaultCapacityPerSlot;

        // Count booked appointments for this slot
        const bookedCount = activeBookingsForDate.filter((a) => a.time === timeStr).length;
        const availableSpots = Math.max(0, totalCapacity - bookedCount);

        slots.push({
          time: timeStr,
          totalCapacity,
          bookedCount,
          availableSpots,
          isAvailable: isEnabledSlot && availableSpots > 0,
          isBlocked: !isEnabledSlot,
          blockReason: isLunch ? 'Horário de Intervalo/Almoço' : (!isEnabledSlot ? 'Horário Bloqueado' : undefined),
        });
      }

      return slots;
    },
    [schedule, appointments]
  );

  // Booking action
  const bookAppointment = useCallback(
    (data: {
      clientName: string;
      clientPhone: string;
      serviceId: string;
      barberId: string;
      date: string;
      time: string;
      notes?: string;
    }) => {
      const selectedService = services.find((s) => s.id === data.serviceId);
      const selectedBarber = staff.find((b) => b.id === data.barberId) || {
        id: 'any',
        name: 'Qualquer Barbeiro Disponível',
        nickname: 'Equipe',
      };

      if (!selectedService) {
        return { success: false, error: 'Serviço selecionado não encontrado.' };
      }

      // Verify availability
      const slots = getAvailableSlotsForDate(data.date);
      const slot = slots.find((s) => s.time === data.time);

      if (!slot) {
        return { success: false, error: 'Horário indisponível na barbearia.' };
      }

      if (slot.isBlocked) {
        return { success: false, error: `Horário bloqueado (${slot.blockReason || 'indisponível'}).` };
      }

      if (slot.availableSpots <= 0) {
        return { success: false, error: 'Desculpe, todas as vagas para este horário já foram preenchidas.' };
      }

      // Generate random 4-digit code
      const randomCode = `LB-${Math.floor(1000 + Math.random() * 9000)}`;

      const newAppointment: Appointment = {
        id: `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        code: randomCode,
        clientName: data.clientName.trim(),
        clientPhone: data.clientPhone.trim(),
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        barberId: selectedBarber.id,
        barberName: selectedBarber.nickname || selectedBarber.name,
        date: data.date,
        time: data.time,
        price: selectedService.price,
        durationMinutes: selectedService.durationMinutes,
        status: 'confirmado',
        notes: data.notes?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      setAppointments((prev) => [newAppointment, ...prev]);

      return { success: true, appointment: newAppointment };
    },
    [services, staff, getAvailableSlotsForDate]
  );

  // Stock Movement & Auto-deduction
  const addStockMovement = useCallback(
    (
      itemId: string,
      type: StockMovement['type'],
      quantity: number,
      notes?: string,
      appointmentId?: string
    ): boolean => {
      const item = inventory.find((i) => i.id === itemId);
      if (!item) return false;

      const previousStock = item.currentStock;
      let newStock = previousStock;

      if (type === 'entrada') {
        newStock += quantity;
      } else {
        newStock = Math.max(0, previousStock - quantity);
      }

      const movement: StockMovement = {
        id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        itemId,
        itemName: item.name,
        type,
        quantity,
        previousStock,
        newStock,
        notes,
        timestamp: new Date().toISOString(),
        appointmentId,
      };

      setInventory((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? {
                ...i,
                currentStock: newStock,
                lastRestocked: type === 'entrada' ? new Date().toISOString().split('T')[0] : i.lastRestocked,
              }
            : i
        )
      );

      setStockMovements((prev) => [movement, ...prev]);
      return true;
    },
    [inventory]
  );

  // Update appointment status with optional stock auto-deduction
  const updateAppointmentStatus = useCallback(
    (id: string, status: AppointmentStatus, autoDeductStock = true) => {
      setAppointments((prev) =>
        prev.map((apt) => {
          if (apt.id === id) {
            // If finishing and deducting stock
            if (status === 'concluido' && apt.status !== 'concluido' && autoDeductStock) {
              const srv = services.find((s) => s.id === apt.serviceId);
              if (srv?.consumables && srv.consumables.length > 0) {
                srv.consumables.forEach((c) => {
                  addStockMovement(
                    c.itemId,
                    'saida_atendimento',
                    c.quantity,
                    `Consumo automático no atendimento #${apt.code} (${apt.clientName})`,
                    apt.id
                  );
                });
              }
            }
            return { ...apt, status };
          }
          return apt;
        })
      );
    },
    [services, addStockMovement]
  );

  const cancelAppointment = useCallback((id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelado' } : apt))
    );
  }, []);

  const getAppointmentsByPhone = useCallback(
    (phone: string) => {
      const cleanTarget = phone.replace(/\D/g, '');
      if (cleanTarget.length < 8) return [];
      return appointments.filter((a) => {
        const cleanApt = a.clientPhone.replace(/\D/g, '');
        return cleanApt.includes(cleanTarget) || cleanTarget.includes(cleanApt);
      });
    },
    [appointments]
  );

  // Schedule updates
  const updateDaySchedule = useCallback((dayOfWeek: number, updates: Partial<DaySchedule>) => {
    setSchedule((prev) =>
      prev.map((s) => (s.dayOfWeek === dayOfWeek ? { ...s, ...updates } : s))
    );
  }, []);

  const updateSlotCapacityOverride = useCallback(
    (dayOfWeek: number, time: string, enabled: boolean, capacity?: number) => {
      setSchedule((prev) =>
        prev.map((s) => {
          if (s.dayOfWeek === dayOfWeek) {
            const currentOverrides = s.slotOverrides || {};
            return {
              ...s,
              slotOverrides: {
                ...currentOverrides,
                [time]: {
                  enabled,
                  capacity: capacity !== undefined ? capacity : (currentOverrides[time]?.capacity ?? s.defaultCapacityPerSlot),
                },
              },
            };
          }
          return s;
        })
      );
    },
    []
  );

  // Inventory CRUD
  const createInventoryItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setInventory((prev) => [...prev, newItem]);
  }, []);

  const updateInventoryItem = useCallback((id: string, updates: Partial<InventoryItem>) => {
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }, []);

  const deleteInventoryItem = useCallback((id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // Low stock items memo
  const lowStockItems = useMemo(() => {
    return inventory.filter((item) => item.currentStock <= item.minStockAlert);
  }, [inventory]);

  // Services CRUD
  const createService = useCallback((service: Omit<BarberService, 'id'>) => {
    const newService: BarberService = {
      ...service,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [...prev, newService]);
  }, []);

  const updateService = useCallback((id: string, updates: Partial<BarberService>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const deleteService = useCallback((id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Staff CRUD
  const createBarber = useCallback((barber: Omit<BarberStaff, 'id'>) => {
    const newStaff: BarberStaff = {
      ...barber,
      id: `barber-${Date.now()}`,
    };
    setStaff((prev) => [...prev, newStaff]);
  }, []);

  const updateBarber = useCallback((id: string, updates: Partial<BarberStaff>) => {
    setStaff((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  }, []);

  const deleteBarber = useCallback((id: string) => {
    setStaff((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // WhatsApp Link Builder
  const generateWhatsAppLink = useCallback(
    (appointment: Appointment) => {
      const cleanPhone = shopInfo.whatsapp.replace(/\D/g, '');
      const fullTarget = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

      // Formatted date (DD/MM/YYYY)
      const [year, month, day] = appointment.date.split('-');
      const formattedDate = `${day}/${month}/${year}`;

      const text = `💈 *NOVO AGENDAMENTO - ${encodeURIComponent(shopInfo.name.toUpperCase())}* 💈%0A%0A` +
        `Olá! Gostaria de confirmar meu agendamento:%0A%0A` +
        `🔖 *Código:* ${appointment.code}%0A` +
        `👤 *Cliente:* ${appointment.clientName}%0A` +
        `📱 *Contato:* ${appointment.clientPhone}%0A` +
        `✂️ *Serviço:* ${appointment.serviceName}%0A` +
        `💈 *Profissional:* ${appointment.barberName}%0A` +
        `📅 *Data:* ${formattedDate}%0A` +
        `⏰ *Horário:* ${appointment.time}%0A` +
        `💰 *Valor:* R$ ${appointment.price.toFixed(2).replace('.', ',')}%0A` +
        (appointment.notes ? `📝 *Observação:* ${appointment.notes}%0A` : '') +
        `%0A📍 *Endereço:* ${shopInfo.address}, ${shopInfo.neighborhood}, ${shopInfo.city}%0A%0A` +
        `Obrigado!`;

      return `https://wa.me/${fullTarget}?text=${text}`;
    },
    [shopInfo]
  );

  const generatePlanWhatsAppLink = useCallback(
    (plan: SubscriptionPlan) => {
      const cleanPhone = shopInfo.whatsapp.replace(/\D/g, '');
      const fullTarget = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
      const text =
        `*SOLICITAÇÃO DE PLANO MENSAL - LB BARBEARIAS*%0A%0A` +
        `Olá! Tenho interesse em assinar o *${plan.name}*.%0A%0A` +
        `💰 *Investimento:* R$ ${plan.price.toFixed(2).replace('.', ',')}/${plan.period}%0A` +
        `👑 *Benefícios inclusos:*%0A` +
        plan.features.map((f) => `• ${f}`).join('%0A') +
        (plan.discountNotice ? `%0A%0A✨ *Vantagem Exclusiva:* ${plan.discountNotice}` : '') +
        `%0A%0AComo faço para ativar minha assinatura?`;

      return `https://wa.me/${fullTarget}?text=${text}`;
    },
    [shopInfo.whatsapp]
  );

  // Backup & Reset
  const clearManagementData = useCallback(() => {
    setAppointments([]);
    setInventory([]);
    setStockMovements([]);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify([]));
  }, []);

  const resetToDefaults = useCallback(() => {
    setShopInfo(INITIAL_SHOP_INFO);
    setAppointments(INITIAL_APPOINTMENTS);
    setSchedule(INITIAL_SCHEDULE);
    setInventory(INITIAL_INVENTORY);
    setStockMovements([]);
    setServices(INITIAL_SERVICES);
    setSubscriptionPlans(INITIAL_SUBSCRIPTION_PLANS);
    setStaff(INITIAL_STAFF);
    localStorage.clear();
  }, []);

  const exportBackupJson = useCallback(() => {
    const data = {
      shopInfo,
      appointments,
      schedule,
      inventory,
      stockMovements,
      services,
      subscriptionPlans,
      staff,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }, [shopInfo, appointments, schedule, inventory, stockMovements, services, subscriptionPlans, staff]);

  const importBackupJson = useCallback((jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.shopInfo) setShopInfo(data.shopInfo);
      if (data.appointments) setAppointments(data.appointments);
      if (data.schedule) setSchedule(data.schedule);
      if (data.inventory) setInventory(data.inventory);
      if (data.stockMovements) setStockMovements(data.stockMovements);
      if (data.services) setServices(data.services);
      if (data.subscriptionPlans) setSubscriptionPlans(data.subscriptionPlans);
      if (data.staff) setStaff(data.staff);
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = {
    shopInfo,
    updateShopInfo,
    updateAdminPin,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    appointments,
    bookAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    getAppointmentsByPhone,
    schedule,
    updateDaySchedule,
    updateSlotCapacityOverride,
    getAvailableSlotsForDate,
    isDateOpen,
    inventory,
    stockMovements,
    addStockMovement,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    lowStockItems,
    services,
    staff,
    subscriptionPlans,
    createService,
    updateService,
    deleteService,
    createBarber,
    updateBarber,
    deleteBarber,
    generateWhatsAppLink,
    generatePlanWhatsAppLink,
    clearManagementData,
    resetToDefaults,
    exportBackupJson,
    importBackupJson,
  };

  return <BarberContext.Provider value={value}>{children}</BarberContext.Provider>;
};

export const useBarber = () => {
  const context = useContext(BarberContext);
  if (!context) {
    throw new Error('useBarber must be used within a BarberProvider');
  }
  return context;
};
