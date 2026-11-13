import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  withGlow?: boolean;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size,
  className = '',
  withGlow = false,
  alt = 'Lorran Barros Barbearias',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 bg-transparent select-none ${className}`}
      style={size ? { height: size, maxWidth: '100%' } : { maxWidth: '100%' }}
    >
      {/* Iluminação dourada extremamente sutil, difusa e circular (sem bordas, manchas ou retângulos) */}
      {withGlow && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5 h-3/5 rounded-full bg-amber-400/[0.08] blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Logotipo Oficial Lorran Barros Barbearias em PNG transparente com preservação rigorosa dos detalhes metálicos */}
      <img
        src="/assets/aistudio/Logo_Lorran_Barros_Fundo_Transparente_368b3698.png"
        alt={alt}
        className="relative z-10 w-auto h-full object-contain bg-transparent"
        style={
          size
            ? {
                maxHeight: size,
                maxWidth: '100%',
              }
            : {
                maxWidth: '100%',
              }
        }
        loading="eager"
      />
    </div>
  );
};
