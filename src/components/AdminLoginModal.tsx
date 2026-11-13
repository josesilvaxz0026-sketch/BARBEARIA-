import React, { useState } from 'react';
import { useBarber } from '../context/BarberContext';
import { Lock, X, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginAdmin } = useBarber();
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setError('Por favor digite o PIN.');
      return;
    }

    const success = loginAdmin(pin);
    if (success) {
      setPin('');
      setError('');
      onClose();
      onSuccess();
    } else {
      setError('PIN incorreto. Tente novamente.');
      setPin('');
    }
  };

  const handleNumpad = (num: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-sm bg-[#0e1015] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-neutral-100 flex flex-col p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex justify-center mb-3">
            <Logo size={52} />
          </div>
          <h2 className="font-heading text-lg font-black text-white uppercase tracking-wider">
            Painel da Barbearia
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Área restrita para controle de estoque, vagas e agenda
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* PIN display dots */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center items-center gap-3 py-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border transition-all ${
                  pin.length > index
                    ? 'bg-amber-400 border-amber-400 scale-110 shadow-md shadow-amber-400/40'
                    : 'bg-neutral-900 border-neutral-700'
                }`}
              />
            ))}
          </div>

          <div className="text-center">
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Digite o PIN de 4 dígitos"
              className="w-full text-center tracking-widest text-lg font-mono py-2 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-500 outline-none text-amber-300"
            />
            <p className="text-[10px] text-neutral-500 mt-1.5">
              (PIN padrão inicial de fábrica: <strong className="text-neutral-400">1234</strong>)
            </p>
          </div>

          {/* Quick Numpad for Mobile / Desktop touch */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleNumpad(digit)}
                className="py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-amber-500 active:text-neutral-950 border border-neutral-800/80 font-bold text-base transition-colors cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              className="py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800/80 font-medium text-xs transition-colors cursor-pointer"
            >
              Apagar
            </button>
            <button
              type="button"
              onClick={() => handleNumpad('0')}
              className="py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-amber-500 active:text-neutral-950 border border-neutral-800/80 font-bold text-base transition-colors cursor-pointer"
            >
              0
            </button>
            <button
              type="submit"
              className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-md shadow-amber-500/20"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
