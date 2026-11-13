import React, { useState, useRef, useEffect } from 'react';
import { BarberStaff } from '../types';
import { useBarber } from '../context/BarberContext';
import { X, Upload, ZoomIn, Move, Check, Camera, RefreshCw } from 'lucide-react';

interface PhotoCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  barber: BarberStaff | null;
}

export const PhotoCropModal: React.FC<PhotoCropModalProps> = ({ isOpen, onClose, barber }) => {
  const { updateBarber } = useBarber();

  const [imageSrc, setImageSrc] = useState<string>('');
  const [scale, setScale] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (barber) {
      setImageSrc(barber.avatarUrl || '');
      setScale(barber.avatarScale || 1);
      setOffsetX(barber.avatarOffsetX || 0);
      setOffsetY(barber.avatarOffsetY || 0);
    }
  }, [barber, isOpen]);

  if (!isOpen || !barber) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          setScale(1);
          setOffsetX(0);
          setOffsetY(0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!barber) return;
    updateBarber(barber.id, {
      avatarUrl: imageSrc,
      avatarScale: scale,
      avatarOffsetX: offsetX,
      avatarOffsetY: offsetY,
    });
    onClose();
  };

  const handleReset = () => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0e1015] border border-neutral-800 rounded-3xl p-6 shadow-2xl my-auto text-neutral-100 flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h3 className="font-heading text-lg font-bold text-white uppercase">
              Foto Real de {barber.name}
            </h3>
            <p className="text-xs text-neutral-400">
              Carregue a foto original do WhatsApp e ajuste o enquadramento circular perfeito
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Circular Preview Area */}
        <div className="flex flex-col items-center justify-center py-4 bg-neutral-950/60 rounded-2xl border border-neutral-800/80">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">
            Prévia do Enquadramento Circular
          </p>

          {/* Pure Circle Frame (Zero white background) */}
          <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-amber-500/60 shadow-2xl bg-[#090a0d] flex items-center justify-center select-none">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={barber.name}
                className="w-full h-full object-cover transition-transform duration-75 select-none pointer-events-none"
                style={{
                  transform: `scale(${scale}) translate(${offsetX}%, ${offsetY}%)`,
                }}
              />
            ) : (
              <Camera className="w-12 h-12 text-neutral-600" />
            )}
          </div>
          <p className="text-[10px] text-amber-400/80 mt-2 font-medium">
            Formato circular exato exibido no site
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Escolher Foto Original do Dispositivo</span>
          </button>
          <p className="text-[10px] text-neutral-500 text-center mt-1.5">
            Selecione a foto original do WhatsApp do seu celular ou computador (JPG, PNG)
          </p>
        </div>

        {/* Sliders for Zoom and Alignment */}
        {imageSrc && (
          <div className="space-y-3.5 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
            {/* Zoom Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zoom / Proporção:</span>
                </span>
                <span className="font-mono text-amber-400">{scale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Vertical Alignment (Y) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-sky-400" />
                  <span>Posição Vertical (Cima / Baixo):</span>
                </span>
                <span className="font-mono text-sky-400">{offsetY > 0 ? `+${offsetY}` : offsetY}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={offsetY}
                onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            {/* Horizontal Alignment (X) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Posição Horizontal (Esquerda / Direita):</span>
                </span>
                <span className="font-mono text-emerald-400">{offsetX > 0 ? `+${offsetX}` : offsetX}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={offsetX}
                onChange={(e) => setOffsetX(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Centralizar</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Salvar Foto no Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
};
