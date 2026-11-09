import React, { useState } from 'react';

interface SobreArbolNavidadProps {
  solapaAbierta: boolean;
  tarjetaSaliendo: boolean;
  onAbrir: () => void;
}

export default function SobreArbolNavidad({
  solapaAbierta,
  tarjetaSaliendo,
  onAbrir
}: SobreArbolNavidadProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (solapaAbierta) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: -y * 10 });
  };

  const handleClickSello = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (solapaAbierta) return;
    onAbrir();
  };

  return (
    <div 
      className="relative w-full max-w-[390px] sm:max-w-[460px] aspect-[500/570] flex items-center justify-center select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onTouchMove={(e) => {
        if (solapaAbierta || !e.touches[0]) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.touches[0].clientX - rect.left) / rect.width - 0.5;
        const y = (e.touches[0].clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: x * 8, y: -y * 8 });
      }}
      onTouchEnd={() => setTilt({ x: 0, y: 0 })}
      style={{
        perspective: '1200px',
        transform: `perspective(1200px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        transition: 'transform 0.25s ease-out'
      }}
    >
      {/* Sombra ambiental multicapa sobre el fondo de gala */}
      <div 
        className="absolute -inset-6 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{
          background: solapaAbierta 
            ? 'radial-gradient(circle, rgba(212,175,55,0.35) 0%, rgba(139,18,29,0.3) 60%, transparent 100%)'
            : 'radial-gradient(circle, rgba(139,18,29,0.55) 0%, rgba(43,9,14,0.7) 70%, transparent 100%)'
        }}
      />

      {/* SVG Container Principal con el Diseño Vectorial Completo del Sobre Árbol */}
      <svg 
        viewBox="0 0 500 570" 
        className="w-full h-full drop-shadow-[0_25px_50px_rgba(43,9,14,0.45)] overflow-visible"
      >
        <defs>
          {/* Textura y degradados para el papel rojo terciopelo (Cardstock de Gala) */}
          <linearGradient id="cardstockRedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9C1724" />
            <stop offset="35%" stopColor="#8A131F" />
            <stop offset="70%" stopColor="#780F19" />
            <stop offset="100%" stopColor="#630A12" />
          </linearGradient>

          <linearGradient id="pocketRedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#911521" />
            <stop offset="50%" stopColor="#7E101A" />
            <stop offset="100%" stopColor="#5E0910" />
          </linearGradient>

          <linearGradient id="flapRedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A81A27" />
            <stop offset="60%" stopColor="#8E1420" />
            <stop offset="100%" stopColor="#780F19" />
          </linearGradient>

          {/* Forro interior en Satén de Oro Líquido */}
          <radialGradient id="interiorGoldSatin" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#FFF9E6" />
            <stop offset="45%" stopColor="#E5C158" />
            <stop offset="85%" stopColor="#C59B27" />
            <stop offset="100%" stopColor="#8A6615" />
          </radialGradient>

          {/* Degradados Metálicos para la Estrella Dorada 3D */}
          <linearGradient id="starFacetLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFDF2" />
            <stop offset="50%" stopColor="#F9DF88" />
            <stop offset="100%" stopColor="#E5BE4A" />
          </linearGradient>

          <linearGradient id="starFacetMid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E5BE4A" />
            <stop offset="100%" stopColor="#B38927" />
          </linearGradient>

          <linearGradient id="starFacetDark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B38927" />
            <stop offset="100%" stopColor="#704F0D" />
          </linearGradient>

          {/* Sombra suave de borde de papel */}
          <filter id="paperShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#2B090E" floodOpacity="0.5" />
          </filter>

          <filter id="flapOpenShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="-8" stdDeviation="12" floodColor="#000000" floodOpacity="0.4" />
          </filter>

          {/* Filtro para destello dorado del sello */}
          <filter id="goldGleam" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ==================== 1. CAPA POSTERIOR: SILUETA COMPLETA DEL ÁRBOL ==================== */}
        <g id="arbol-base">
          {/* Sombra base del árbol */}
          <path
            d="
              M 250 78
              L 125 218 Q 112 232 125 240 Q 140 248 162 240
              L 68 348 Q 55 362 70 370 Q 86 378 112 368
              L 30 495 Q 22 510 40 514
              L 460 514 Q 478 510 470 495
              L 388 368 Q 414 378 430 370 Q 445 362 432 348
              L 338 240 Q 360 248 375 240 Q 388 232 375 218
              Z
            "
            fill="url(#cardstockRedGrad)"
            filter="url(#paperShadow)"
          />

          {/* Revestimiento interior en Satén Dorado (Visible al abrir la solapa) */}
          <path
            d="
              M 250 90
              L 140 220 Q 130 230 145 235
              L 180 232
              L 100 330 Q 90 342 105 348
              L 135 344
              L 250 420
              L 365 344
              L 395 348 Q 410 342 400 330
              L 320 232
              L 355 235 Q 370 230 360 220
              Z
            "
            fill="url(#interiorGoldSatin)"
            opacity={solapaAbierta ? 0.95 : 0}
            className="transition-opacity duration-700"
          />

          {/* Costura perimetral dorada sutil en el interior */}
          {solapaAbierta && (
            <path
              d="
                M 250 102
                L 155 218 L 190 222
                L 125 320 L 155 326
                L 250 395
                L 345 326 L 375 320
                L 310 222 L 345 218
                Z
              "
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              opacity="0.8"
            />
          )}
        </g>
      </svg>

      {/* ==================== 2. TARJETA DE GALA INTERIOR (SLIDE-UP FISICO) ==================== */}
      <div 
        className={`absolute inset-x-6 sm:inset-x-10 z-15 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-auto ${
          tarjetaSaliendo 
            ? 'opacity-100 scale-100 shadow-[0_30px_70px_rgba(43,9,14,0.55)]' 
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{
          transformOrigin: 'bottom center',
          transform: tarjetaSaliendo 
            ? 'translateY(-185px) scale(1.03) rotate(0deg)' 
            : 'translateY(45px) scale(0.92)'
        }}
      >
        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#D4AF37] p-4 sm:p-5 text-center shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
          {/* Borde interior doble dorado */}
          <div className="absolute inset-2 border border-[#D4AF37]/50 rounded-xl pointer-events-none" />
          <span className="absolute top-2.5 left-2.5 text-[#D4AF37] text-xs pointer-events-none">✦</span>
          <span className="absolute top-2.5 right-2.5 text-[#D4AF37] text-xs pointer-events-none">✦</span>
          <span className="absolute bottom-2.5 left-2.5 text-[#D4AF37] text-xs pointer-events-none">✦</span>
          <span className="absolute bottom-2.5 right-2.5 text-[#D4AF37] text-xs pointer-events-none">✦</span>

          {/* Resplandor áureo diagonal */}
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/40 to-transparent -rotate-45 animate-pulse pointer-events-none" />

          <div className="relative z-10 space-y-1.5 flex flex-col items-center justify-center text-center w-full">
            <span className="font-sans-luxury text-[8px] sm:text-[9px] tracking-[0.35em] indent-[0.35em] uppercase text-[#C81D25] block font-semibold text-center w-full">
              ✦ Invitación Exclusiva • 2026 ✦
            </span>
            <p className="font-editorial text-lg sm:text-2xl text-[#2B090E] font-light tracking-wide text-center w-full">
              POSADA <span className="italic font-serif-luxury text-[#C81D25]">Navideña</span>
            </p>
            <p className="font-pinyon text-3xl sm:text-4xl text-[#B91C1C] text-center block w-full mt-1 sm:mt-1.5 drop-shadow-xs">
              By Leslye
            </p>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-1.5" />
            <div className="text-[10px] tracking-[0.3em] indent-[0.3em] font-sans-luxury text-[#D4AF37] uppercase font-semibold text-center w-full">
              Sábado 05 Diciembre • 8:00 PM
            </div>
            <p className="text-[9px] font-sans-luxury tracking-[0.25em] indent-[0.25em] text-[#2B090E]/70 uppercase pt-0.5 text-center w-full">
              Los Mochis, Sinaloa
            </p>
          </div>
        </div>
      </div>

      {/* ==================== 3. BOLSILLO DELANTERO INFERIOR (SVG RECORTADO EN V) ==================== */}
      <svg 
        viewBox="0 0 500 570" 
        className="absolute inset-0 w-full h-full z-20 pointer-events-none overflow-visible"
      >
        <g id="bolsillo-inferior">
          {/* El bolsillo frontal abraza la tarjeta con corte en V */}
          <path
            d="
              M 112 368
              L 30 495 Q 22 510 40 514
              L 460 514 Q 478 510 470 495
              L 388 368
              Q 414 378 430 370 Q 445 362 432 348
              L 338 240
              L 250 315
              L 162 240
              L 68 348 Q 55 362 70 370 Q 86 378 112 368
              Z
            "
            fill="url(#pocketRedGrad)"
            filter="url(#paperShadow)"
          />

          {/* Sombra de profundidad en la hendidura en V del bolsillo */}
          <path
            d="
              M 162 240
              L 250 315
              L 338 240
              Q 250 280 162 240
              Z
            "
            fill="#3B050B"
            opacity="0.35"
          />

          {/* Ribete biselado en el labio del bolsillo en V */}
          <path
            d="M 162 240 L 250 315 L 338 240"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
          />
        </g>
      </svg>

      {/* ==================== 4. SOLAPA SUPERIOR CON ROTACIÓN 3D & ESTRELLA DORADA ==================== */}
      <div 
        className="absolute inset-0 z-25 preserve-3d transition-transform duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
        style={{
          transformOrigin: '250px 240px',
          transform: solapaAbierta ? 'rotateX(-172deg) translateY(-12px)' : 'rotateX(0deg)'
        }}
      >
        <svg 
          viewBox="0 0 500 570" 
          className="w-full h-full overflow-visible"
        >
          {/* Solapa Triangular Superior con el primer nivel de ramas */}
          <g id="solapa-superior" filter={solapaAbierta ? 'url(#flapOpenShadow)' : 'url(#paperShadow)'}>
            <path
              d="
                M 250 78
                L 125 218 Q 112 232 125 240 Q 140 248 162 240
                L 250 315
                L 338 240 Q 360 248 375 240 Q 388 232 375 218
                Z
              "
              fill="url(#flapRedGrad)"
            />

            {/* Borde biselado inferior de la solapa */}
            <path
              d="M 162 240 L 250 315 L 338 240"
              fill="none"
              stroke="#B5202F"
              strokeWidth="2"
              opacity="0.85"
            />
          </g>

          {/* ==================== ESTRELLA DORADA 3D ESCULPIDA (CORONANDO EL ÁRBOL) ==================== */}
          <g id="estrella-dorada-3d" transform="translate(0, -6)">
            {/* Halo de resplandor áureo en reposo */}
            <circle cx="250" cy="74" r="38" fill="rgba(212, 175, 55, 0.25)" filter="url(#goldGleam)" />

            {/* Puntos de la estrella: 
                Centro: (250, 74)
                Punta superior: (250, 24)
                Punta superior-derecha: (298, 58)
                Punta inferior-derecha: (280, 112)
                Punta inferior-izquierda: (220, 112)
                Punta superior-izquierda: (202, 58)
                Valles internos: (265, 78), (268, 96), (232, 96), (235, 78), (250, 60)
            */}
            {/* Faceta 1: Superior Izquierda (Luz) */}
            <polygon points="250,74 250,24 235,58" fill="url(#starFacetLight)" />
            {/* Faceta 2: Superior Derecha (Sombra) */}
            <polygon points="250,74 250,24 265,58" fill="url(#starFacetMid)" />
            {/* Faceta 3: Derecha Superior (Luz) */}
            <polygon points="250,74 298,58 265,58" fill="url(#starFacetLight)" />
            {/* Faceta 4: Derecha Inferior (Sombra) */}
            <polygon points="250,74 298,58 268,90" fill="url(#starFacetDark)" />
            {/* Faceta 5: Inferior Derecha Exterior (Luz) */}
            <polygon points="250,74 280,112 268,90" fill="url(#starFacetMid)" />
            {/* Faceta 6: Inferior Derecha Interior (Sombra) */}
            <polygon points="250,74 280,112 250,94" fill="url(#starFacetDark)" />
            {/* Faceta 7: Inferior Izquierda Interior (Luz) */}
            <polygon points="250,74 220,112 250,94" fill="url(#starFacetLight)" />
            {/* Faceta 8: Inferior Izquierda Exterior (Sombra) */}
            <polygon points="250,74 220,112 232,90" fill="url(#starFacetMid)" />
            {/* Faceta 9: Izquierda Inferior (Luz) */}
            <polygon points="250,74 202,58 232,90" fill="url(#starFacetLight)" />
            {/* Faceta 10: Izquierda Superior (Sombra) */}
            <polygon points="250,74 202,58 235,58" fill="url(#starFacetDark)" />

            {/* Punto de luz central en el núcleo de la estrella */}
            <circle cx="250" cy="74" r="2.5" fill="#FFFFFF" opacity="0.9" />
          </g>
        </svg>
      </div>

      {/* ==================== 5. SELLO DE CERA INTERACTIVO (COLIBRÍ IMPERIAL) ==================== */}
      <div 
        className={`absolute top-[52.5%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-35 transition-all duration-700 ${
          solapaAbierta ? "scale-150 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={handleClickSello}
          className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full"
          aria-label="Tocar el sello de cera para abrir la invitación"
        >
          {/* Sello de Cera Colibrí Oficial (Nácar Porcelana - Tamaño Delicado) */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden relative shadow-[0_8px_18px_rgba(43,9,14,0.6)] border-[1.5px] border-[#D4AF37]/80 flex items-center justify-center bg-[#F4ECE4]">
            <img 
              src="/assets/aistudio/FC033C4D-E9F0-4555-A66F-07F12242444B_6244ac97.PNG" 
              alt="Sello de Cera Colibrí Oficial" 
              className="w-full h-full object-cover scale-[1.82] object-center transform transition-transform duration-500 group-hover:scale-[1.88]" 
            />
            {/* Bisel de cera protector */}
            <div className="absolute inset-0 rounded-full border border-white/70 pointer-events-none" />
            <div className="absolute inset-0.5 rounded-full border border-[#D4AF37]/35 pointer-events-none" />
          </div>
        </button>
      </div>
    </div>
  );
}
