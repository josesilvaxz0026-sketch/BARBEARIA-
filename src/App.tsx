/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarberProvider, useBarber } from './context/BarberContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HaircutGallery } from './components/HaircutGallery';
import { SpecialistsSection } from './components/SpecialistsSection';
import { ServicesList } from './components/ServicesList';
import { ShopFeatures } from './components/ShopFeatures';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { MyAppointmentsModal } from './components/MyAppointmentsModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { BarberService, BarberStaff } from './types';
import { Phone, Calendar, Scissors } from 'lucide-react';

function BarberAppContent() {
  const { isAdminLoggedIn, shopInfo, services } = useBarber();

  // Navigation View: 'client' | 'admin'
  const [currentView, setCurrentView] = useState<'client' | 'admin'>('client');

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [preSelectedService, setPreSelectedService] = useState<BarberService | null>(null);
  const [preSelectedBarber, setPreSelectedBarber] = useState<BarberStaff | null>(null);

  // If in admin view and authenticated
  if (currentView === 'admin' && isAdminLoggedIn) {
    return <AdminPortal onBackToClientView={() => setCurrentView('client')} />;
  }

  const handleSelectServiceFromList = (service: BarberService) => {
    setPreSelectedService(service);
    setPreSelectedBarber(null);
    setIsBookingOpen(true);
  };

  const handleSelectServiceById = (serviceId: string) => {
    const srv = services.find((s) => s.id === serviceId) || null;
    setPreSelectedService(srv);
    setPreSelectedBarber(null);
    setIsBookingOpen(true);
  };

  const handleSelectBarberFromSection = (barber: BarberStaff) => {
    setPreSelectedBarber(barber);
    setPreSelectedService(null);
    setIsBookingOpen(true);
  };

  const handleOpenGeneralBooking = () => {
    setPreSelectedService(null);
    setPreSelectedBarber(null);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-neutral-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300 relative">
      {/* Fixed Background Brand Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        {/* Ambient subtle golden glow */}
        <div className="absolute w-[650px] sm:w-[950px] h-[650px] sm:h-[950px] rounded-full bg-amber-500/[0.04] blur-[160px] pointer-events-none" />
        
        {/* The Brand Logo Watermark */}
        <img
          src="/assets/aistudio/Logo_Lorran_Barros_Fundo_Transparente_368b3698.png"
          alt=""
          aria-hidden="true"
          className="w-[92vw] max-w-[850px] object-contain opacity-[0.08] sm:opacity-[0.09] select-none filter contrast-125 transition-opacity"
        />

        {/* Radial vignette overlay to keep edges elegantly deep and text readable */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#090a0d_95%)] pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Client Facing Navigation */}
        <Navbar
          onOpenBooking={handleOpenGeneralBooking}
          onOpenMyAppointments={() => setIsMyAppointmentsOpen(true)}
          onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          onOpenAdminPortal={() => setCurrentView('admin')}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          <Hero
            onOpenBooking={handleOpenGeneralBooking}
            onOpenMyAppointments={() => setIsMyAppointmentsOpen(true)}
          />

          {/* Gallery of Haircut Styles with photos */}
          <HaircutGallery onSelectServiceById={handleSelectServiceById} />

          {/* Specialist Lorran Barros in luxury circular portrait */}
          <SpecialistsSection onSelectBarber={handleSelectBarberFromSection} />

          {/* Services & Pricing Menu */}
          <ServicesList onSelectService={handleSelectServiceFromList} />

          {/* Location & Experience Features */}
          <ShopFeatures onOpenBooking={handleOpenGeneralBooking} />
        </main>

        {/* Footer */}
        <Footer
          onOpenBooking={handleOpenGeneralBooking}
          onOpenMyAppointments={() => setIsMyAppointmentsOpen(true)}
          onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        />
      </div>

      {/* Floating Action Buttons for Client Ease */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2.5 items-end">
        {/* Direct WhatsApp Contact Button */}
        <a
          href={`https://wa.me/55${shopInfo.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Falar no WhatsApp da Barbearia"
          className="flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all"
        >
          <Phone className="w-5 h-5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">WhatsApp ({shopInfo.whatsappFormatted})</span>
        </a>

        {/* Quick Mobile Booking Bar */}
        <button
          onClick={handleOpenGeneralBooking}
          className="sm:hidden flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-extrabold text-xs uppercase tracking-wider shadow-2xl shadow-amber-500/30 active:scale-95 transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>Agendar Horário</span>
        </button>
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setPreSelectedService(null);
          setPreSelectedBarber(null);
        }}
        preSelectedService={preSelectedService}
        preSelectedBarber={preSelectedBarber}
      />

      <MyAppointmentsModal
        isOpen={isMyAppointmentsOpen}
        onClose={() => setIsMyAppointmentsOpen(false)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setCurrentView('admin');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BarberProvider>
      <BarberAppContent />
    </BarberProvider>
  );
}
