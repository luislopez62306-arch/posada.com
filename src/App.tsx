import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { 
  MapPin, 
  Sparkles, 
  Calendar, 
  Clock, 
  RotateCw, 
  CheckCircle2, 
  Send, 
  Heart, 
  Copy, 
  Check, 
  CalendarPlus, 
  X, 
  Volume2, 
  VolumeX, 
  Music, 
  Wine, 
  Compass, 
  ExternalLink,
  ChevronDown,
  Maximize2,
  Snowflake,
  Bell,
  Gift
} from 'lucide-react';
import SobreArbolNavidad from './components/SobreArbolNavidad';
import EfectoBrindis from './components/EfectoBrindis';

// ==================== COMPONENTE FESTIVO: NIEVE & FUEGOS ARTIFICIALES SUTILES (CANVAS) ====================
function CanvasNieve({ activa }: { activa: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!activa) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Partículas de Nieve Específica
    const countSnow = window.innerWidth < 768 ? 32 : 55;
    interface Copo {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      sway: number;
      swaySpeed: number;
      tipo: 'circulo' | 'destello' | 'copo';
      tono: string;
    }

    const copos: Copo[] = [];
    const tonosNieve = [
      'rgba(255, 255, 255,',      // Blanco cristalino
      'rgba(250, 243, 243,',      // Marfil vino suave
      'rgba(200, 29, 37,',        // Rojo terciopelo
      'rgba(212, 175, 55,'        // Dorado imperial
    ];

    for (let i = 0; i < countSnow; i++) {
      copos.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.4 + 0.9,
        speedY: Math.random() * 0.8 + 0.35,
        speedX: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.5 + 0.3,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.008,
        tipo: i % 8 === 0 ? 'destello' : (i % 12 === 0 ? 'copo' : 'circulo'),
        tono: tonosNieve[Math.floor(Math.random() * tonosNieve.length)]
      });
    }

    // 2. Fuegos Artificiales Sutiles de Alta Costura
    interface Cohete {
      x: number;
      y: number;
      targetY: number;
      speedY: number;
      trail: { x: number; y: number; alpha: number }[];
      palette: string[];
    }

    interface Chispa {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      color: string;
      size: number;
      tipo: 'dot' | 'sparkle';
    }

    const paletasFuegos = [
      // Paleta 1: Rojo Imperial & Dorado Gala
      ['#DC2626', '#C81D25', '#D4AF37', '#FFF5E6', '#F5DE93'],
      // Paleta 2: Rojo Carmesí & Oro Champaña
      ['#7F0910', '#B91C1C', '#F5DE93', '#D4AF37', '#FAF3F3'],
      // Paleta 3: Rubí & Diamante
      ['#E5383B', '#D4AF37', '#FFF0C2', '#FFFFFF', '#C81D25']
    ];

    const cohetes: Cohete[] = [];
    const chispas: Chispa[] = [];

    const lanzarCohete = () => {
      // Se disparan en la parte superior (12% al 32% de la altura de la página)
      const targetX = width * (0.15 + Math.random() * 0.7);
      const targetY = height * (0.12 + Math.random() * 0.22);
      const startY = height * 0.72;
      const palette = paletasFuegos[Math.floor(Math.random() * paletasFuegos.length)];

      cohetes.push({
        x: targetX + (Math.random() * 30 - 15),
        y: startY,
        targetY: targetY,
        speedY: (startY - targetY) / 50, // sube suavemente en ~50 frames
        trail: [],
        palette: palette
      });
    };

    const explotarCohete = (x: number, y: number, palette: string[]) => {
      const cantidadChispas = window.innerWidth < 768 ? 32 : 46;
      for (let i = 0; i < cantidadChispas; i++) {
        const angle = (Math.PI * 2 * i) / cantidadChispas + (Math.random() * 0.35 - 0.175);
        const speed = Math.random() * 2.6 + 1.1;
        const color = palette[Math.floor(Math.random() * palette.length)];

        chispas.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          decay: Math.random() * 0.013 + 0.011,
          color: color,
          size: Math.random() * 2.2 + 0.9,
          tipo: i % 4 === 0 ? 'sparkle' : 'dot'
        });
      }
    };

    // Temporizador para disparos ocasionales (primer disparo a los ~0.8s)
    let framesHastaDisparo = 50;

    // Loop de renderizado
    const dibujar = () => {
      ctx.clearRect(0, 0, width, height);

      // --- A) Copos de Nieve ---
      for (let i = 0; i < copos.length; i++) {
        const c = copos[i];
        c.sway += c.swaySpeed;
        c.y += c.speedY;
        c.x += c.speedX + Math.sin(c.sway) * 0.45;

        if (c.y > height + 10) {
          c.y = -10;
          c.x = Math.random() * width;
        }
        if (c.x > width + 10) c.x = -10;
        if (c.x < -10) c.x = width + 10;

        ctx.save();
        ctx.fillStyle = `${c.tono} ${c.opacity})`;

        if (c.tipo === 'destello') {
          ctx.translate(c.x, c.y);
          ctx.beginPath();
          const r = c.radius * 1.6;
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.quadraticCurveTo(0, 0, 0, r);
          ctx.quadraticCurveTo(0, 0, -r, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r);
          ctx.fill();
        } else if (c.tipo === 'copo') {
          ctx.strokeStyle = `${c.tono} ${c.opacity * 0.85})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          const s = c.radius * 1.4;
          ctx.moveTo(c.x - s, c.y);
          ctx.lineTo(c.x + s, c.y);
          ctx.moveTo(c.x, c.y - s);
          ctx.lineTo(c.x, c.y + s);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // --- B) Control de Disparo Ocasional ---
      framesHastaDisparo--;
      if (framesHastaDisparo <= 0) {
        lanzarCohete();
        // Ocasionalmente lanzar un segundo cohete gemelo con ligero desfase
        if (Math.random() > 0.65) {
          setTimeout(() => {
            if (activa) lanzarCohete();
          }, 400);
        }
        // Siguiente disparo ocasional entre 180 y 290 frames (~3 a 5 segundos)
        framesHastaDisparo = Math.floor(Math.random() * 110) + 180;
      }

      // --- C) Actualizar y Dibujar Cohetes Ascendentes ---
      for (let i = cohetes.length - 1; i >= 0; i--) {
        const coh = cohetes[i];
        coh.y -= coh.speedY;

        coh.trail.push({ x: coh.x, y: coh.y, alpha: 0.85 });
        if (coh.trail.length > 7) coh.trail.shift();

        for (let t = 0; t < coh.trail.length; t++) {
          const pt = coh.trail[t];
          pt.alpha *= 0.82;
          ctx.save();
          ctx.fillStyle = `rgba(212, 175, 55, ${pt.alpha})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        ctx.fillStyle = '#FFF0C2';
        ctx.shadowColor = '#D4AF37';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(coh.x, coh.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (coh.y <= coh.targetY) {
          explotarCohete(coh.x, coh.y, coh.palette);
          cohetes.splice(i, 1);
        }
      }

      // --- D) Actualizar y Dibujar Chispas de Fuegos Artificiales ---
      for (let i = chispas.length - 1; i >= 0; i--) {
        const p = chispas[i];
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 + 0.042; // gravedad sutil
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          chispas.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;

        if (p.tipo === 'sparkle') {
          ctx.translate(p.x, p.y);
          ctx.beginPath();
          const r = p.size * 1.5;
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.quadraticCurveTo(0, 0, 0, r);
          ctx.quadraticCurveTo(0, 0, -r, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(dibujar);
    };

    dibujar();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [activa]);

  if (!activa) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}

// ==================== COMPONENTE NAVIDEÑO 1: GUIRNALDA DE LUCES DE HADAS CÁLIDAS ====================
function GuirnaldaLucesNavidenas() {
  const bombillas = [
    { left: '3%', top: '14px', color: '#F5DE93', glow: '#D4AF37', delay: '0s' },
    { left: '10%', top: '24px', color: '#DC2626', glow: '#C81D25', delay: '0.6s' },
    { left: '18%', top: '30px', color: '#F5DE93', glow: '#D4AF37', delay: '1.2s' },
    { left: '26%', top: '20px', color: '#FFFDF9', glow: '#E5C158', delay: '0.3s' },
    { left: '34%', top: '29px', color: '#DC2626', glow: '#C81D25', delay: '0.9s' },
    { left: '42%', top: '33px', color: '#F5DE93', glow: '#D4AF37', delay: '1.5s' },
    { left: '50%', top: '22px', color: '#FFFDF9', glow: '#E5C158', delay: '0.4s' },
    { left: '58%', top: '31px', color: '#DC2626', glow: '#C81D25', delay: '1.1s' },
    { left: '66%', top: '34px', color: '#F5DE93', glow: '#D4AF37', delay: '0.2s' },
    { left: '74%', top: '21px', color: '#FFFDF9', glow: '#E5C158', delay: '1.7s' },
    { left: '82%', top: '28px', color: '#DC2626', glow: '#C81D25', delay: '0.8s' },
    { left: '90%', top: '25px', color: '#F5DE93', glow: '#D4AF37', delay: '1.4s' },
    { left: '97%', top: '15px', color: '#DC2626', glow: '#C81D25', delay: '0.5s' }
  ];

  return (
    <div className="absolute top-0 left-0 right-0 h-14 pointer-events-none z-20 overflow-hidden">
      {/* Alambre curvo festivo dorado */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 60" fill="none">
        <path 
          d="M0 10 Q125 45 250 15 T500 20 T750 18 T1000 10" 
          stroke="#D4AF37" 
          strokeWidth="1.2" 
          strokeOpacity="0.45" 
        />
      </svg>
      {bombillas.map((b, i) => (
        <div 
          key={i} 
          className="absolute"
          style={{ left: b.left, top: b.top, transform: 'translate(-50%, -50%)' }}
        >
          {/* Casquillo metálico */}
          <div className="w-1.5 h-1.5 bg-[#8C6B13] mx-auto rounded-t-xs -mb-0.5" />
          {/* Bombilla con destello cálido navideño */}
          <div 
            className="w-2.5 h-3.5 sm:w-3 sm:h-4 rounded-full animate-fairy-twinkle"
            style={{ 
              backgroundColor: b.color,
              boxShadow: `0 0 8px ${b.glow}, 0 0 14px ${b.glow}`,
              animationDelay: b.delay
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ==================== COMPONENTE NAVIDEÑO 2: ADORNOS Y ESFERAS COLGANTES ====================
function AdornosNavidenosHeader() {
  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none z-20 hidden md:block overflow-hidden h-72">
      {/* Esfera Izquierda en Rojo Vino Terciopelo con copo de nieve */}
      <div className="absolute left-6 lg:left-12 top-0 animate-swing">
        {/* Hilo de seda dorado */}
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#D4AF37] to-[#D4AF37] mx-auto" />
        {/* Casquillo dorado de la esfera */}
        <div className="w-4 h-2.5 rounded-t-xs bg-gradient-to-r from-[#D4AF37] via-[#FFF2C6] to-[#8A6A15] mx-auto border border-[#8C6B13]/40" />
        {/* Cuerpo de la esfera Rojo */}
        <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-[#E5383B] via-[#C81D25] to-[#50070B] border border-[#D4AF37] shadow-[0_10px_20px_rgba(43,9,14,0.45)] flex items-center justify-center">
          <div className="absolute inset-1 rounded-full border border-white/20 pointer-events-none" />
          <Snowflake className="w-5 h-5 text-[#F5DE93] drop-shadow-[0_0_4px_rgba(212,175,55,0.8)]" />
        </div>
      </div>

      {/* Esfera / Campana Derecha en Oro Champaña con destello */}
      <div className="absolute right-6 lg:right-12 top-0 animate-swing-delayed">
        {/* Hilo de oro */}
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[#D4AF37] to-[#D4AF37] mx-auto" />
        {/* Casquillo */}
        <div className="w-3.5 h-2 rounded-t-xs bg-[#8C6B13] mx-auto" />
        {/* Campana Navideña Dorada */}
        <div className="relative w-11 h-11 lg:w-13 lg:h-13 rounded-full bg-gradient-to-br from-[#FFF9E6] via-[#D4AF37] to-[#8C6B13] border border-white/80 shadow-[0_10px_20px_rgba(212,175,55,0.4)] flex items-center justify-center">
          <Bell className="w-5 h-5 text-[#C81D25]" />
        </div>
      </div>
    </div>
  );
}

// ==================== COMPONENTE NAVIDEÑO 3: GUIRNALDA BOTÁNICA DE ALTA JOYERÍA ====================
function RamoNavidenoPino({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <svg 
        viewBox="0 0 160 36" 
        className="w-36 sm:w-44 h-auto overflow-visible drop-shadow-[0_2px_8px_rgba(43,9,14,0.12)]"
        fill="none"
      >
        <defs>
          {/* Degradado hoja de laurel verde bosque */}
          <linearGradient id="laurelVerde" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3A6340" />
            <stop offset="100%" stopColor="#1E3F27" />
          </linearGradient>

          {/* Oro Joyería de Gala */}
          <linearGradient id="oroJoya" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF7D6" />
            <stop offset="45%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#997015" />
          </linearGradient>

          {/* Rubí Bayas de Acebo */}
          <radialGradient id="rubiBaya" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FF6B75" />
            <stop offset="45%" stopColor="#C81D25" />
            <stop offset="100%" stopColor="#660910" />
          </radialGradient>
        </defs>

        {/* Lado Izquierdo: Follaje Botánico de Pino & Hojas de Laurel con Nervaduras Doradas */}
        <g id="lado-izquierdo">
          {/* Tallo arqueado principal */}
          <path d="M78 18 C58 17 38 15 12 21" stroke="#23422A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M76 18 C56 17 36 15 14 20.8" stroke="url(#oroJoya)" strokeWidth="0.6" strokeLinecap="round" opacity="0.75" />

          {/* Hojas de laurel noble con filamento dorado */}
          <path d="M60 17 C54 11 44 12 40 16 C46 19 54 19 60 17 Z" fill="url(#laurelVerde)" />
          <path d="M60 17 C54 11 44 12 40 16" stroke="url(#oroJoya)" strokeWidth="0.8" />

          <path d="M42 16 C36 9 26 11 22 17 C28 19 36 18 42 16 Z" fill="url(#laurelVerde)" />
          <path d="M42 16 C36 9 26 11 22 17" stroke="url(#oroJoya)" strokeWidth="0.75" />

          {/* Agujas de pino de bosque noble */}
          <path d="M68 18 L64 26 M62 17 L56 25 M54 17 L47 24 M46 16 L38 23 M34 17 L25 24 M24 18 L16 23" stroke="#2E5C38" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M66 18 L62 25 M60 17 L54 24 M52 17 L45 23" stroke="url(#oroJoya)" strokeWidth="0.6" strokeLinecap="round" opacity="0.85" />
          <path d="M70 17 L67 9 M63 17 L59 10 M55 16 L50 10 M47 16 L42 10" stroke="#3D6B48" strokeWidth="1.1" strokeLinecap="round" />

          {/* Bayas de acebo rubí con engaste dorado fino */}
          <circle cx="50" cy="18" r="2.2" fill="url(#rubiBaya)" stroke="#D4AF37" strokeWidth="0.5" />
          <circle cx="49.3" cy="17.3" r="0.6" fill="#FFFFFF" opacity="0.8" />

          <circle cx="34" cy="14" r="1.8" fill="url(#rubiBaya)" stroke="#D4AF37" strokeWidth="0.5" />
          <circle cx="33.4" cy="13.4" r="0.5" fill="#FFFFFF" opacity="0.8" />

          <circle cx="20" cy="20" r="1.6" fill="url(#rubiBaya)" stroke="#D4AF37" strokeWidth="0.4" />
        </g>

        {/* Lado Derecho: Simétrico en Espejo */}
        <g id="lado-derecho" transform="translate(160, 0) scale(-1, 1)">
          {/* Tallo arqueado principal */}
          <path d="M78 18 C58 17 38 15 12 21" stroke="#23422A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M76 18 C56 17 36 15 14 20.8" stroke="url(#oroJoya)" strokeWidth="0.6" strokeLinecap="round" opacity="0.75" />

          {/* Hojas de laurel noble con filamento dorado */}
          <path d="M60 17 C54 11 44 12 40 16 C46 19 54 19 60 17 Z" fill="url(#laurelVerde)" />
          <path d="M60 17 C54 11 44 12 40 16" stroke="url(#oroJoya)" strokeWidth="0.8" />

          <path d="M42 16 C36 9 26 11 22 17 C28 19 36 18 42 16 Z" fill="url(#laurelVerde)" />
          <path d="M42 16 C36 9 26 11 22 17" stroke="url(#oroJoya)" strokeWidth="0.75" />

          {/* Agujas de pino de bosque noble */}
          <path d="M68 18 L64 26 M62 17 L56 25 M54 17 L47 24 M46 16 L38 23 M34 17 L25 24 M24 18 L16 23" stroke="#2E5C38" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M66 18 L62 25 M60 17 L54 24 M52 17 L45 23" stroke="url(#oroJoya)" strokeWidth="0.6" strokeLinecap="round" opacity="0.85" />
          <path d="M70 17 L67 9 M63 17 L59 10 M55 16 L50 10 M47 16 L42 10" stroke="#3D6B48" strokeWidth="1.1" strokeLinecap="round" />

          {/* Bayas de acebo rubí con engaste dorado fino */}
          <circle cx="50" cy="18" r="2.2" fill="url(#rubiBaya)" stroke="#D4AF37" strokeWidth="0.5" />
          <circle cx="49.3" cy="17.3" r="0.6" fill="#FFFFFF" opacity="0.8" />

          <circle cx="34" cy="14" r="1.8" fill="url(#rubiBaya)" stroke="#D4AF37" strokeWidth="0.5" />
          <circle cx="33.4" cy="13.4" r="0.5" fill="#FFFFFF" opacity="0.8" />

          <circle cx="20" cy="20" r="1.6" fill="url(#rubiBaya)" stroke="#D4AF37" strokeWidth="0.4" />
        </g>

        {/* Centro: Joyel Imperial con Estrella Polar Dorada y Perlas Rubí */}
        <g id="centro-joyel">
          <circle cx="80" cy="18" r="7" fill="url(#oroJoya)" opacity="0.18" />
          <path d="M80 8 L81.5 15 L88 18 L81.5 21 L80 28 L78.5 21 L72 18 L78.5 15 Z" fill="url(#oroJoya)" />
          <circle cx="80" cy="18" r="1.5" fill="#FFFDF8" />

          {/* Dúo de perlas rubí flanqueando */}
          <circle cx="74.2" cy="18" r="2.5" fill="url(#rubiBaya)" stroke="#D4AF37" strokeWidth="0.6" />
          <circle cx="73.5" cy="17.2" r="0.7" fill="#FFFFFF" opacity="0.85" />

          <circle cx="85.8" cy="18" r="2.5" fill="url(#rubiBaya)" stroke="#D4AF37" strokeWidth="0.6" />
          <circle cx="85.1" cy="17.2" r="0.7" fill="#FFFFFF" opacity="0.85" />

          {/* Perla superior */}
          <circle cx="80" cy="13.5" r="2.2" fill="url(#rubiBaya)" stroke="#D4AF37" strokeWidth="0.6" />
          <circle cx="79.3" cy="12.8" r="0.6" fill="#FFFFFF" opacity="0.85" />
        </g>
      </svg>
    </div>
  );
}

// ==================== VARIANTES DE ANIMACIÓN STAGGER PARA POLAROIDS ====================
const contenedorGaleriaVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.08
    }
  }
};

const polaroidItemVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 50,
    rotate: i % 2 === 0 ? -7 : 7,
    scale: 0.92
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: i % 2 === 0 ? -1.5 : 1.5,
    scale: 1,
    transition: {
      duration: 0.85,
      ease: [0.25, 1, 0.5, 1] as const
    }
  })
};

export default function InvitacionPosadaLeslye() {
  // ==================== 1. ESTADOS DE APERTURA (SOBRE BEIGE SEDA & SELLO ROSE GOLD) ====================
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [sobreOculto, setSobreOculto] = useState(false);
  const [solapaAbierta, setSolapaAbierta] = useState(false);
  const [tarjetaSaliendo, setTarjetaSaliendo] = useState(false);

  // ==================== 2. PORTADA DE GALA (NUEVA PORTADA OFICIAL: RETRATO DE GALA LESLYE) ====================
  const opcionesPortada = [
    { 
      id: 'leslye',
      url: "https://i.ibb.co/6JLBKqq8/AHP-5886.jpg", 
      label: "Retrato de Gala • Leslye",
      subtitulo: "Anfitriona de la Posada Navideña",
      insignia: "PORTADA DE HONOR"
    },
    { 
      id: 'celebracion',
      url: "https://i.ibb.co/XrCN5n0v/AHP-5891.jpg", 
      label: "Celebración & Brindis",
      subtitulo: "Alegría y Brindis Navideño",
      insignia: "NOCHE DE GALA"
    },
    { 
      id: 'equipo',
      url: "https://i.ibb.co/wZr3S4Qm/AHP-5896.jpg", 
      label: "Familia & Equipo Completo",
      subtitulo: "Nuestras Especialistas en Belleza",
      insignia: "EQUIPO BY LESLYE"
    },
    { 
      id: 'clinica',
      url: "/assets/espacios_de_paz.jpg", 
      label: "Espacios de Paz & Spa",
      subtitulo: "Santuario de Alta Estética",
      insignia: "INSTALACIONES"
    },
    { 
      id: 'detalles',
      url: "https://i.ibb.co/YFsCNqwP/AHP-5775.jpg", 
      label: "Sutileza & Esencia",
      subtitulo: "Detalles Únicos de Confort",
      insignia: "ALTA COSMÉTICA"
    }
  ];
  const [portadaIndex, setPortadaIndex] = useState(0); // Portada #1 Activa: Retrato de Gala Leslye

  // ==================== 3. FLIP CARDS 3D ====================
  const [flipCard1, setFlipCard1] = useState(false);
  const [flipCard2, setFlipCard2] = useState(false);
  const [direccionCopiada, setDireccionCopiada] = useState(false);
  // ==================== 4. GALERÍA MASONRY ====================
  const galeriaFotos = [
    { 
      url: "https://i.ibb.co/wZr3S4Qm/AHP-5896.jpg", 
      titulo: "Equipo & Pasión", 
      categoria: "Nuestro Equipo" 
    },
    { 
      url: "/assets/espacios_de_paz.jpg", 
      titulo: "Espacios de Paz", 
      categoria: "Clínica de Belleza" 
    },
    { 
      url: "https://i.ibb.co/6JLBKqq8/AHP-5886.jpg", 
      titulo: "Nuestra Esencia", 
      categoria: "Dirección Artística" 
    },
    { 
      url: "https://i.ibb.co/XrCN5n0v/AHP-5891.jpg", 
      titulo: "Celebración & Alegría", 
      categoria: "Momentos Mágicos" 
    },
    { 
      url: "https://i.ibb.co/YFsCNqwP/AHP-5775.jpg", 
      titulo: "Sutileza & Armonía", 
      categoria: "Detalles Únicos" 
    }
  ];
  const [lightboxFoto, setLightboxFoto] = useState<string | null>(null);

  // ==================== 5. CUENTA REGRESIVA SUIZA ====================
  const [tiempo, setTiempo] = useState({ dias: '00', hrs: '00', min: '00', seg: '00' });
  const [brindisCount, setBrindisCount] = useState(0);
  const [brindisActivo, setBrindisActivo] = useState(false);
  const [brindisMensaje, setBrindisMensaje] = useState<string | null>(null);

  // ==================== 6. FORMULARIO RSVP WHATSAPP ====================
  const [nombre, setNombre] = useState('');
  const [asistencia, setAsistencia] = useState('¡Sí, ahí estaré para celebrar juntas!');
  const [deseo, setDeseo] = useState('');
  const [confirmado, setConfirmado] = useState(false);

  // ==================== 7. REPRODUCTOR DE MÚSICA NAVIDEÑA (TWINKLING LIGHTS) ====================
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicaReproduciendo, setMusicaReproduciendo] = useState(false);

  // ==================== 8. EFECTO NIEVE LUMINOSA ====================
  const [nieveActiva, setNieveActiva] = useState(true);

  // ==================== 9. FOTO DE GRATITUD ====================
  const fotosGratitud = [
    { url: "https://i.ibb.co/6JLBKqq8/AHP-5886.jpg", label: "Leslye" },
    { url: "https://i.ibb.co/wZr3S4Qm/AHP-5896.jpg", label: "Equipo" }
  ];
  const [fotoGratitudIndex, setFotoGratitudIndex] = useState(0);

  // Reloj regresivo al 05 de Diciembre 2026, 8:00 PM
  useEffect(() => {
    const fechaMeta = new Date('2026-12-05T20:00:00').getTime();
    const timer = setInterval(() => {
      const ahora = new Date().getTime();
      const distancia = fechaMeta - ahora;

      if (distancia <= 0) {
        clearInterval(timer);
        return;
      }

      const d = Math.floor(distancia / (1000 * 60 * 60 * 24));
      const h = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distancia % (1000 * 60)) / 1000);

      setTiempo({
        dias: String(d).padStart(2, '0'),
        hrs: String(h).padStart(2, '0'),
        min: String(m).padStart(2, '0'),
        seg: String(s).padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Web Audio Chime sutil al abrir sobre
  const sonarCampanaApertura = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notas = [523.25, 659.25, 783.99, 1046.50];
      notas.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 2.0);
      });
    } catch {
      // Audio silencioso si el navegador lo bloquea
    }
  };

  // Sonido cristalino de copas de champán brindando (Baccarat Crystal Chime)
  const sonarBrindisChampana = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      
      // Armónicos cristalinos de copas finas de champaña
      const armonicos = [1760, 3520, 5280];
      const volumenes = [0.09, 0.035, 0.012];
      
      armonicos.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(volumenes[idx], ctx.currentTime + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 2.5);
      });

      // Segundo toque de copa sutil a los 85ms (el choque natural del brindis)
      setTimeout(() => {
        try {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1975.5, ctx.currentTime);
          gain2.gain.setValueAtTime(0.001, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.006);
          gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(ctx.currentTime);
          osc2.stop(ctx.currentTime + 1.9);
        } catch {}
      }, 85);
    } catch {
      // Sin bloqueo si el navegador restringe audio
    }
  };

  const handleBrindar = () => {
    sonarBrindisChampana();
    setBrindisCount(prev => prev + 1);
    setBrindisActivo(true);

    const frasesBrindis = [
      '¡Salud! Por un año lleno de belleza, armonía y gratitud ✨🥂',
      '¡Por una noche mágica, llena de brillo, salud y amistad! 🥂✦',
      '¡Brindamos por momentos mágicos en esta Posada Navideña! 🍾✨',
      '¡Que el brillo y la elegancia te acompañen siempre by Leslye! 💖🥂',
      '¡Salud por la amistad y la calidez de esta noche de gala! 🌟🥂'
    ];
    const frase = frasesBrindis[Math.floor(Math.random() * frasesBrindis.length)];
    setBrindisMensaje(frase);
    setTimeout(() => {
      setBrindisMensaje(null);
    }, 4500);
  };

  // Toggle de Canción Navideña (Twinkling Lights Reimagined)
  const toggleMusica = () => {
    if (!audioRef.current) return;
    if (musicaReproduciendo) {
      audioRef.current.pause();
      setMusicaReproduciendo(false);
    } else {
      audioRef.current.play().then(() => {
        setMusicaReproduciendo(true);
      }).catch(() => {
        // En caso de bloqueo de autoplay por el navegador
      });
    }
  };

  // Apertura del sobre con rotación 3D de solapa y emergencia de invitación
  const handleAbrirSobre = () => {
    sonarCampanaApertura();
    setSolapaAbierta(true);

    // Al hacer clic en el sello del sobre inicial para abrir la invitación, ejecuta automáticamente audioRef.current.play()
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setMusicaReproduciendo(true);
      }).catch(() => {
        // En caso de bloqueo de autoplay
      });
    }



    // Tras 450ms, la carta asoma suavemente desde el interior del sobre de árbol
    setTimeout(() => {
      setTarjetaSaliendo(true);
      // Tras 1600ms adicionales para admirar la carta y el árbol abierto, el sobre da paso suave a la gala
      setTimeout(() => {
        setSobreAbierto(true);
        setTimeout(() => {
          setSobreOculto(true);
        }, 900);
      }, 1600);
    }, 450);
  };

  // Copiar dirección
  const handleCopiarDireccion = () => {
    navigator.clipboard.writeText("Calle Compuertas 2318 (Prolongación Blvd. Poseidón), Colonia Diana Laura Riojas, Los Mochis, Sinaloa");
    setDireccionCopiada(true);
    setTimeout(() => setDireccionCopiada(false), 3000);
  };

  // Google Calendar
  const handleGoogleCalendar = () => {
    const title = encodeURIComponent("Posada Navideña • Clínica de Belleza by Leslye");
    const details = encodeURIComponent("Una velada especial con cena, brindis, música y sorpresas preparadas con todo el amor por el equipo de Clínica by Leslye.");
    const location = encodeURIComponent("Calle Compuertas 2318 (Prolongación Blvd. Poseidón), Colonia Diana Laura Riojas, Los Mochis, Sinaloa");
    const dates = "20261206T020000Z/20261206T070000Z";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`, '_blank');
  };

  // Enviar a WhatsApp
  const handleEnviarWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const texto = `✨ *CONFIRMACIÓN DE ASISTENCIA • POSADA NAVIDEÑA* ✨\n` +
      `*Clínica de Belleza by Leslye*\n\n` +
      `👤 *Invitada:* ${nombre}\n` +
      `💌 *Asistencia:* ${asistencia}\n` +
      (deseo.trim() ? `💬 *Deseo Navideño:* "${deseo}"\n\n` : `\n`) +
      `_¡Gracias por hacerme parte de esta celebración mágica!_ ✨🥂`;

    const telefono = "528180000000"; // Número WhatsApp
    const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
    setConfirmado(true);
  };

  return (
    <div className="min-h-screen text-[#2B090E] font-sans-luxury selection:bg-[#C81D25] selection:text-white relative transition-all duration-700 tipo-imperial textura-rayas-diagonales">
      {/* Capa de textura de fibra textil suave para reproducir la sensación táctil de las fotos */}
      <div className="fixed inset-0 textura-fibra-overlay pointer-events-none opacity-80 z-0" />

      {/* ==================== REPRODUCTOR DE MÚSICA NAVIDEÑA ==================== */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        src="https://www.dropbox.com/scl/fi/3zco373rbpska4ip3vzi1/Auni-Twinkling-Lights-Reimagined-Official.mp3?rlkey=uly9ksasmcg73nagr89uxuudb&st=2ri9tflk&raw=1" 
        onPlay={() => setMusicaReproduciendo(true)}
        onPause={() => setMusicaReproduciendo(false)}
      />

      {/* ==================== EFECTO NIEVE LUMINOSA ==================== */}
      <CanvasNieve activa={nieveActiva} />

      {/* ==================== EFECTO BRINDIS: CONFETI DORADO & BURBUJAS DE CHAMPÁN ==================== */}
      <EfectoBrindis activo={brindisActivo} brindisCount={brindisCount} />

      {/* ==================== 1. EXPERIENCIA DE APERTURA (NUEVOS ESTILOS DE SOBRE DE LUJO) ==================== */}
      {!sobreOculto && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 px-4 select-none ${
            sobreAbierto ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          {/* Fondo festivo con la textura de las imágenes (rayas navideñas diagonales) */}
          <div className="absolute inset-0 textura-rayas-diagonales" />
          <div className="absolute inset-0 textura-fibra-overlay pointer-events-none opacity-80" />
          {/* Viñeta radial para resaltar el cofre/sobre 3D en el centro */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,253,251,0.55)_0%,_rgba(43,9,14,0.6)_100%)] pointer-events-none" />

          {/* Destellos flotantes dorados y rojo en el fondo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[18%] left-[16%] w-3 h-3 text-[#D4AF37] animate-pulse">✦</div>
            <div className="absolute top-[22%] right-[18%] w-4 h-4 text-[#FF6B6B] animate-pulse delay-700">✧</div>
            <div className="absolute bottom-[20%] left-[20%] w-3 h-3 text-[#D4AF37] animate-pulse delay-500">✦</div>
            <div className="absolute bottom-[24%] right-[16%] w-4 h-4 text-[#FF6B6B] animate-pulse delay-1000">✧</div>
          </div>

          {/* Contenedor central de la experiencia de apertura */}
          <div className="relative w-full max-w-lg perspective-1000 flex flex-col items-center">
            
            {/* Mensaje Bonito en Letras Blancas sobre el Sobre */}
            <div 
              className="text-center mb-3 sm:mb-4 z-10 transition-all duration-500 max-w-md mx-auto px-2" 
              style={{ opacity: solapaAbierta ? 0 : 1 }}
            >
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-white" />
                <span className="font-sans-luxury text-[9px] sm:text-[10px] tracking-[0.4em] indent-[0.4em] uppercase text-white font-semibold drop-shadow-[0_2px_4px_rgba(43,9,14,0.85)]">
                  ✦ Para Ti con Todo el Cariño ✦
                </span>
                <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent via-white/70 to-white" />
              </div>
              <h2 className="font-serif-luxury italic text-lg sm:text-2xl text-white font-normal tracking-wide drop-shadow-[0_2px_8px_rgba(43,9,14,0.95)] leading-snug">
                "Los momentos más hermosos florecen cuando los celebramos juntos"
              </h2>
              <p className="font-sans-luxury text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-white/95 font-medium mt-1.5 drop-shadow-[0_2px_4px_rgba(43,9,14,0.85)]">
                Posada Navideña • 2026
              </p>
            </div>

            {/* ==================== SOBRE EN FORMA DE ÁRBOL DE NAVIDAD CON SELLO DEL COLIBRÍ ==================== */}
            <SobreArbolNavidad 
              solapaAbierta={solapaAbierta}
              tarjetaSaliendo={tarjetaSaliendo}
              onAbrir={handleAbrirSobre}
            />

          </div>
        </div>
      )}

      {/* ==================== 2. BARRA FLOTANTE DE CONTROL (NIEVE / AUDIO) ==================== */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setNieveActiva(!nieveActiva)}
          className={`p-3 rounded-full border shadow-md backdrop-blur-md transition-all hover:scale-105 cursor-pointer ${
            nieveActiva 
              ? 'bg-[#C81D25] text-white border-[#D4AF37]' 
              : 'bg-[#FFFDFB]/95 hover:bg-[#FCE8E9] text-[#2B090E]/60 border-[#D4AF37]/50'
          }`}
          title={nieveActiva ? "Desactivar efecto nieve" : "Activar efecto nieve"}
          aria-label="Efecto nieve"
        >
          <Snowflake className={`w-4 h-4 ${nieveActiva ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }} />
        </button>
        <button
          type="button"
          onClick={toggleMusica}
          className="p-3 rounded-full bg-[#FFFDFB]/95 hover:bg-[#FCE8E9] text-[#C81D25] border border-[#D4AF37]/50 shadow-md backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
          title={musicaReproduciendo ? "Pausar música: Twinkling Lights" : "Reproducir música: Twinkling Lights"}
          aria-label="Música navideña"
        >
          {musicaReproduciendo ? <Volume2 className="w-4 h-4 text-[#C81D25]" /> : <VolumeX className="w-4 h-4 text-[#2B090E]/50" />}
        </button>
      </div>

      {/* ==================== A) HERO SECTION (PORTADA OFICIAL FIJA) ==================== */}
      <header className="relative w-full overflow-hidden text-[#2B090E]">
        {/* Fondo sutil marfil traslúcido para que la textura festiva se aprecie y el contenido sea ultra nítido */}
        <div className="absolute inset-0 bg-[#FFFDFB]/88 backdrop-blur-xs pointer-events-none border-b-2 border-[#D4AF37]" />
        
        {/* Guirnalda festiva de luces de hadas */}
        <GuirnaldaLucesNavidenas />
        {/* Adornos y esferas navideñas colgantes */}
        <AdornosNavidenosHeader />

        <div className="relative z-10 min-h-[85vh] flex flex-col items-center justify-between px-4 sm:px-8 pb-14 pt-8 max-w-5xl mx-auto">
          
          {/* Cabecera Tipográfica Escultural y Perfectamente Centrada */}
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-2 mb-6 sm:mb-8 pt-4">
            <div className="flex items-center justify-center gap-2 text-[#D4AF37] text-xs mb-1 mx-auto text-center">
              <span>✦</span>
              <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="font-sans-luxury text-[10px] sm:text-[11px] tracking-[0.4em] indent-[0.4em] uppercase text-[#C81D25] font-semibold text-center">
                Invitación Exclusiva
              </span>
              <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
              <span>✦</span>
            </div>

            {/* Ramito festivo navideño de pino y bayas de acebo */}
            <div className="flex justify-center items-center mx-auto my-1">
              <RamoNavidenoPino />
            </div>

            <h1 className="w-full text-center mx-auto flex flex-col items-center justify-center leading-none">
              <span className="font-bodoni text-4xl sm:text-6xl md:text-7xl tracking-[0.16em] indent-[0.16em] text-[#2B090E] block font-light text-center w-full">
                POSADA
              </span>
              <span className="font-serif-luxury italic text-4xl sm:text-6xl md:text-7xl text-[#C81D25] block mt-1 tracking-wide text-center w-full font-normal">
                Navideña
              </span>
            </h1>

            <div className="pt-3 sm:pt-4 w-full flex flex-col items-center justify-center text-center mx-auto">
              <span className="font-sans-luxury text-[11px] sm:text-xs tracking-[0.45em] indent-[0.45em] uppercase text-[#2B090E]/80 font-medium text-center block w-full">
                Clínica de Belleza
              </span>
              <span className="font-pinyon text-5xl sm:text-7xl md:text-8xl text-[#B91C1C] text-center block w-full mt-2.5 sm:mt-4 drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]">
                By Leslye
              </span>
            </div>
          </div>

          {/* Vitrina Fotográfica de Portada - Foto 1 Oficial Limpia (Sin Sombreado ni Textos Sobrepuestos) */}
          <div className="relative w-full max-w-4xl aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_25px_60px_rgba(43,9,14,0.22)] bg-[#FFFDFB] mx-auto">
            {/* Foto 1 Oficial: Retrato de Gala Leslye */}
            <img
              src="https://i.ibb.co/6JLBKqq8/AHP-5886.jpg"
              alt="Posada Navideña Clínica by Leslye - Foto Oficial"
              className="w-full h-full object-cover object-center"
            />

            {/* Borde biselado interior dorado y esquinas ornamentadas limpias */}
            <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/50 rounded-xl sm:rounded-2xl pointer-events-none" />
            <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[#D4AF37] text-xs sm:text-sm drop-shadow-sm pointer-events-none">✦</span>
            <span className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#D4AF37] text-xs sm:text-sm drop-shadow-sm pointer-events-none">✦</span>
            <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-[#D4AF37] text-xs sm:text-sm drop-shadow-sm pointer-events-none">✦</span>
            <span className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-[#D4AF37] text-xs sm:text-sm drop-shadow-sm pointer-events-none">✦</span>
          </div>

          {/* Pie de la Portada con Fecha & Botón hacia la Invitación */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center z-10">
            <div className="flex items-center gap-2 text-xs font-sans-luxury tracking-[0.3em] uppercase text-[#C81D25] font-medium">
              <span className="text-[#D4AF37]">✦</span>
              <span>Sábado 05 de Diciembre • 8:00 PM</span>
              <span className="text-[#D4AF37]">✦</span>
            </div>
            <a
              href="#agradecimiento"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFFDFB] hover:bg-[#FCE8E9] border border-[#D4AF37] text-[#C81D25] font-sans-luxury text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:scale-105 shadow-md font-semibold"
            >
              <span>Descubrir la Noche</span>
              <span>↓</span>
            </a>
          </div>
        </div>
      </header>

      {/* ==================== B) MENSAJE DE AGRADECIMIENTO & FOTO EDITORIAL SIN RECORTES ==================== */}
      <section id="agradecimiento" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto scroll-mt-6 relative z-10">
        <div className="bg-[#FFFDFB]/95 backdrop-blur-md rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-12 shadow-[0_25px_60px_rgba(43,9,14,0.22)]">
          {/* Frase Emotiva & Título con tipografía más grande */}
          <div className="text-center space-y-6 mb-14">
            <div className="flex items-center justify-center gap-3 text-[#D4AF37] text-sm">
              <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <Sparkles className="w-5 h-5 text-[#C81D25]" />
              <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            
            <div className="space-y-1">
              <span className="font-sans-luxury text-xs sm:text-sm tracking-[0.45em] uppercase text-[#C81D25] font-medium block">
                Con Todo Nuestro Cariño
              </span>
              <h2 className="font-bodoni text-3xl sm:text-5xl md:text-6xl text-[#2B090E] font-light tracking-wide">
                Nuestra Gratitud
              </h2>
            </div>

            {/* Texto de gratitud en tamaño más grande y legible */}
            <div className="relative max-w-3xl mx-auto pt-2">
              <span className="font-bodoni text-6xl sm:text-8xl text-[#C81D25]/20 absolute -top-6 -left-2 sm:-left-6 select-none pointer-events-none">
                “
              </span>
              <p className="font-serif-luxury italic text-xl sm:text-3xl md:text-[2rem] text-[#2B090E] leading-relaxed sm:leading-[1.7] md:leading-[1.75] font-normal relative z-10 px-4 sm:px-8">
                Gracias por permitirnos resaltar tu belleza, por tu confianza y por brillar junto a nosotras durante todo este año. Queremos celebrar tu compañía en una noche mágica llena de cariño, brindis y momentos inolvidables.
              </p>
              <span className="font-bodoni text-6xl sm:text-8xl text-[#C81D25]/20 absolute -bottom-10 -right-2 sm:-right-6 select-none pointer-events-none">
                ”
              </span>
            </div>

            {/* Firma personal */}
            <div className="pt-6 flex flex-col items-center">
              <span className="font-pinyon text-5xl sm:text-6xl md:text-7xl text-[#B91C1C] drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]">
                by Leslye
              </span>
              <span className="font-sans-luxury text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#2B090E]/70 mt-3 sm:mt-4">
                Clínica de Belleza
              </span>
            </div>
          </div>

          {/* Fotografía de Gratitud estilo Polaroid */}
          <div className="space-y-6 flex flex-col items-center">
            {/* Mini selector sutil de foto */}
            <div className="flex justify-center items-center gap-2">
              {fotosGratitud.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFotoGratitudIndex(idx)}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-sans-luxury tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                    fotoGratitudIndex === idx
                      ? 'bg-[#C81D25] text-white font-medium shadow-sm border border-[#D4AF37]'
                      : 'bg-[#FFFDFB] hover:bg-[#FCE8E9] text-[#2B090E]/70 border border-[#D4AF37]/40'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Tarjeta Fotográfica Polaroid */}
            <div className="relative max-w-md sm:max-w-lg w-full group transition-all duration-500 hover:rotate-0 -rotate-1">
              {/* Cinta washi tape decorativa en tono Rojo suave */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-6 bg-[#F7CCD0] border-l border-r border-[#C81D25]/40 backdrop-blur-sm z-20 shadow-xs rotate-[-1.5deg] pointer-events-none" />

              <div className="bg-[#FFFDFB] p-3 sm:p-5 pb-7 sm:pb-9 rounded-sm shadow-[0_20px_50px_rgba(43,9,14,0.15)] border border-[#D4AF37]/35">
                {/* Contenedor fotográfico interior Polaroid */}
                <div className="bg-[#FAF3F3] overflow-hidden rounded-xs flex items-center justify-center">
                  <img 
                    src={fotosGratitud[fotoGratitudIndex].url} 
                    alt="Clínica de Belleza by Leslye - Gratitud" 
                    className="w-full h-auto object-contain transition-all duration-700 ease-in-out"
                  />
                </div>

                {/* Pie de foto estilo Polaroid con caligrafía */}
                <div className="pt-4 sm:pt-6 text-center space-y-1">
                  <p className="font-pinyon text-2xl sm:text-3xl md:text-4xl text-[#2B090E] tracking-wide">
                    {fotoGratitudIndex === 0 ? "Con todo mi cariño, Leslye" : "Momentos que atesoramos juntas"}
                  </p>
                  <p className="font-sans-luxury text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#C81D25] font-medium">
                    Posada Navideña • Diciembre 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== C) CUENTA REGRESIVA (RELOJ MINIMALISTA EN ORO Y ROJO) ==================== */}
      <section className="py-20 px-4 sm:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto bg-[#FFFDFB]/95 backdrop-blur-md rounded-3xl border-2 border-[#D4AF37] p-8 sm:p-12 shadow-[0_25px_60px_rgba(43,9,14,0.22)]">
          
          {/* Distintivo Navideño de Temporada */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF3F3] border border-[#D4AF37]/60 shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-sans-luxury text-[10px] tracking-[0.25em] uppercase text-[#C81D25] font-semibold">
              Cuenta Regresiva • Posada Navideña
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>

          {/* Fecha destacada con líneas doradas laterales */}
          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm font-sans-luxury tracking-[0.35em] uppercase text-[#C81D25] font-semibold mb-8">
            <span className="w-10 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span>SÁBADO • 05 DE DICIEMBRE • 2026</span>
            <span className="w-10 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          {/* Reloj Limpio Sin Cajas Cerradas */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-10">
            
            {/* Días */}
            <div className="flex flex-col items-center">
              <span className="font-editorial text-5xl md:text-7xl text-[#C81D25] font-light leading-none">
                {tiempo.dias}
              </span>
              <span className="font-sans-luxury text-[10px] sm:text-xs text-[#2B090E] tracking-[0.35em] mt-3 font-medium">
                DÍAS
              </span>
            </div>

            <span className="text-2xl md:text-4xl text-[#D4AF37] pb-6 font-light">✦</span>

            {/* Horas */}
            <div className="flex flex-col items-center">
              <span className="font-editorial text-5xl md:text-7xl text-[#C81D25] font-light leading-none">
                {tiempo.hrs}
              </span>
              <span className="font-sans-luxury text-[10px] sm:text-xs text-[#2B090E] tracking-[0.35em] mt-3 font-medium">
                HRS
              </span>
            </div>

            <span className="text-2xl md:text-4xl text-[#D4AF37] pb-6 font-light">✦</span>

            {/* Minutos */}
            <div className="flex flex-col items-center">
              <span className="font-editorial text-5xl md:text-7xl text-[#C81D25] font-light leading-none">
                {tiempo.min}
              </span>
              <span className="font-sans-luxury text-[10px] sm:text-xs text-[#2B090E] tracking-[0.35em] mt-3 font-medium">
                MIN
              </span>
            </div>

            <span className="text-2xl md:text-4xl text-[#D4AF37] pb-6 font-light">✦</span>

            {/* Segundos */}
            <div className="flex flex-col items-center">
              <span className="font-editorial text-5xl md:text-7xl text-[#C81D25] font-light leading-none">
                {tiempo.seg}
              </span>
              <span className="font-sans-luxury text-[10px] sm:text-xs text-[#2B090E] tracking-[0.35em] mt-3 font-medium">
                SEG
              </span>
            </div>
          </div>

          {/* Botones de Acción de la Cuenta Regresiva: Brindar & Calendario */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Botón 'Brindar' con Efecto de Champán y Confeti Dorado */}
            <button
              type="button"
              onClick={handleBrindar}
              className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#C81D25] via-[#A3161D] to-[#C81D25] hover:from-[#B0141C] hover:to-[#910F16] text-[#FFFDFB] border-2 border-[#D4AF37] font-sans-luxury text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_8px_25px_rgba(200,29,37,0.35)] hover:shadow-[0_12px_35px_rgba(212,175,55,0.45)] hover:scale-105 active:scale-95 cursor-pointer font-bold overflow-hidden"
              title="¡Toca para brindar con champaña y activar confeti dorado!"
              aria-label="Brindar con champaña"
            >
              {/* Brillo áureo diagonal en reposo y hover */}
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/30 to-transparent -rotate-45 group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

              <Wine className="w-4 h-4 text-[#FFF2B2] group-hover:rotate-12 transition-transform duration-300 shrink-0" />
              <span className="font-semibold tracking-[0.25em]">Brindar</span>
              <Sparkles className="w-4 h-4 text-[#D4AF37] group-hover:scale-125 transition-transform shrink-0" />

              {brindisCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-sans-luxury font-bold text-white shadow-xs">
                  +{brindisCount}
                </span>
              )}
            </button>

            {/* Botón de Sincronización con Calendario */}
            <button
              type="button"
              onClick={handleGoogleCalendar}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#FFFDFB] hover:bg-[#FCE8E9] border border-[#D4AF37] text-[#C81D25] font-sans-luxury text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-sm hover:scale-105 cursor-pointer font-semibold"
            >
              <CalendarPlus className="w-4 h-4 text-[#D4AF37]" />
              <span>Agendar en Google Calendar</span>
            </button>
          </div>

          {/* Mensaje / Dedicatoria de Brindis con Champaña */}
          {brindisMensaje && (
            <div className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FFFDF9]/95 border-2 border-[#D4AF37] shadow-xl backdrop-blur-md animate-fade-in text-center max-w-lg mx-auto">
              <Sparkles className="w-4 h-4 text-[#C81D25] shrink-0 animate-bounce" />
              <p className="font-editorial text-sm sm:text-base text-[#2B090E] font-medium leading-snug">
                {brindisMensaje}
              </p>
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 animate-bounce" />
            </div>
          )}
        </div>
      </section>

      {/* ==================== D) UBICACIÓN & DETALLES (FLIP CARDS 3D EN ROJO, DORADO & MARFIL) ==================== */}
      <section className="py-20 px-4 sm:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12 max-w-md mx-auto bg-[#FFFDFB]/95 backdrop-blur-md rounded-2xl border-2 border-[#D4AF37] py-5 px-6 shadow-xl">
            <span className="font-sans-luxury text-xs tracking-[0.35em] uppercase text-[#C81D25] font-medium block">
              Detalles & Coordenadas
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#2B090E] mt-1">
              Información de la Noche
            </h2>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* FLIP CARD 1 (CUÁNDO Y DÓNDE) */}
            <div 
              className="perspective-1000 h-[340px] cursor-pointer"
              onClick={() => setFlipCard1(!flipCard1)}
            >
              <div className={`relative w-full h-full duration-700 preserve-3d transition-transform ${
                flipCard1 ? 'rotate-y-180' : ''
              }`}>
                
                {/* Frente */}
                <div className="absolute inset-0 backface-hidden bg-[#FFFDFB] border-2 border-[#D4AF37] rounded-3xl p-8 flex flex-col justify-between shadow-md">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-[#F7CCD0] text-[#C81D25] border border-[#D4AF37]/40">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <span className="font-sans-luxury text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-semibold">
                      01 / Coordenadas
                    </span>
                  </div>

                  <div>
                    <h3 className="font-editorial text-2xl text-[#2B090E] tracking-wide">
                      RECEPCIÓN
                    </h3>
                    <p className="font-serif-luxury italic text-xl text-[#C81D25] mt-2">
                      5 de Diciembre • 8:00 P.M.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#C81D25] font-sans-luxury tracking-widest pt-4 border-t border-[#D4AF37]/30">
                    <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Toca la tarjeta para ver la dirección ↻</span>
                  </div>
                </div>

                {/* Reverso (Giro) */}
                <div 
                  className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-8 flex flex-col justify-between shadow-xl border-2 border-[#D4AF37]"
                  style={{ background: 'linear-gradient(135deg, #C81D25 0%, #8B0000 100%)', color: '#FFFFFF' }}
                >
                  <div>
                    <span className="font-sans-luxury text-[10px] tracking-[0.35em] uppercase text-[#F5DE93] block mb-2 font-medium">
                      ✦ Dirección Oficial ✦
                    </span>
                    <h3 className="font-editorial text-xl sm:text-2xl text-white font-normal leading-snug">
                      Calle Compuertas 2318
                    </h3>
                    <p className="font-sans-luxury text-sm text-white/95 mt-1 font-light">
                      (Prolongación Blvd. Poseidón)
                    </p>
                    <p className="font-sans-luxury text-sm text-white/95 mt-0.5 font-light">
                      Colonia Diana Laura Riojas
                    </p>
                    <p className="font-sans-luxury text-xs text-[#F5DE93] mt-1.5 font-medium tracking-wider uppercase">
                      Los Mochis, Sinaloa
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/25">
                    <a
                      href="https://maps.app.goo.gl/PxLCWtPKewfb3BBT8?g_st=iw"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FFFDFB] text-[#7F0910] font-sans-luxury text-xs tracking-widest font-semibold hover:bg-white transition-all shadow-md border border-[#D4AF37]"
                    >
                      <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
                      <span>VER MAPA EN GOOGLE MAPS</span>
                    </a>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopiarDireccion();
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-sans-luxury text-[11px] tracking-wider transition-colors border border-white/20"
                    >
                      {direccionCopiada ? <Check className="w-3.5 h-3.5 text-[#F5DE93]" /> : <Copy className="w-3.5 h-3.5 text-[#F5DE93]" />}
                      <span>{direccionCopiada ? '¡Dirección copiada!' : 'Copiar dirección'}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* FLIP CARD 2 (LA EXPERIENCIA / DRESS CODE) */}
            <div 
              className="perspective-1000 h-[340px] cursor-pointer"
              onClick={() => setFlipCard2(!flipCard2)}
            >
              <div className={`relative w-full h-full duration-700 preserve-3d transition-transform ${
                flipCard2 ? 'rotate-y-180' : ''
              }`}>
                
                {/* Frente */}
                <div className="absolute inset-0 backface-hidden bg-[#FFFDFB] border-2 border-[#D4AF37] rounded-3xl p-8 flex flex-col justify-between shadow-md">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-[#F7CCD0] text-[#C81D25] border border-[#D4AF37]/40">
                      <Wine className="w-6 h-6" />
                    </div>
                    <span className="font-sans-luxury text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-semibold">
                      02 / Código de Vestimenta
                    </span>
                  </div>

                  <div>
                    <h3 className="font-editorial text-2xl text-[#2B090E] tracking-wide">
                      CÓDIGO DE VESTIMENTA
                    </h3>
                    <p className="font-serif-luxury italic text-xl sm:text-2xl text-[#C81D25] mt-2">
                      Paleta Oficial de Colores
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#C81D25] font-sans-luxury tracking-widest pt-4 border-t border-[#D4AF37]/30">
                    <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Toca para ver la paleta de colores ↻</span>
                  </div>
                </div>

                {/* Reverso (Giro) */}
                <div 
                  className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl border-2 border-[#D4AF37]"
                  style={{ background: 'linear-gradient(135deg, #C81D25 0%, #8B0000 100%)', color: '#FFFFFF' }}
                >
                  <div>
                    <span className="font-sans-luxury text-[10px] tracking-[0.35em] uppercase text-[#F5DE93] block mb-1 font-medium">
                      ✦ Dress Code Oficial ✦
                    </span>
                    <h3 className="font-editorial text-lg sm:text-xl text-white font-normal mb-1">
                      Rojo • Dorado • Beige • Café • Café Claro
                    </h3>
                    <p className="font-serif-luxury italic text-sm sm:text-base text-white/95 leading-relaxed">
                      "Acompáñanos luciendo la calidez y distinción de nuestra paleta: tonalidades Rojas y Doradas combinadas con la armonía del Beige, Café y Café Claro."
                    </p>
                  </div>

                  {/* Muestras Visuales de Color (5 tonalidades armónicas) */}
                  <div className="pt-2.5 border-t border-white/20">
                    <div className="flex items-center justify-between gap-1 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#B91C1C] border-2 border-[#F5DE93] shadow-sm" />
                        <span className="text-[8px] sm:text-[9px] font-sans-luxury tracking-wider text-white/90 uppercase font-medium">Rojo</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#D4AF37] border-2 border-white shadow-sm" />
                        <span className="text-[8px] sm:text-[9px] font-sans-luxury tracking-wider text-white/90 uppercase font-medium">Dorado</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E8DCB8] border-2 border-[#F5DE93] shadow-sm" />
                        <span className="text-[8px] sm:text-[9px] font-sans-luxury tracking-wider text-white/90 uppercase font-medium">Beige</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#5C3A21] border-2 border-white shadow-sm" />
                        <span className="text-[8px] sm:text-[9px] font-sans-luxury tracking-wider text-white/90 uppercase font-medium">Café</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#B07D56] border-2 border-[#F5DE93] shadow-sm" />
                        <span className="text-[8px] sm:text-[9px] font-sans-luxury tracking-wider text-white/90 uppercase font-medium">Café Claro</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== E) GALERÍA DE FOTOS "NUESTRA ESENCIA" (MASONRY POLAROID SIN RECORTES) ==================== */}
      <section className="py-20 px-4 sm:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            className="text-center mb-16 max-w-xl mx-auto bg-[#FFFDFB]/95 backdrop-blur-md rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-8 shadow-xl"
          >
            <span className="font-sans-luxury text-xs tracking-[0.35em] uppercase text-[#C81D25] font-medium block">
              Nuestra Esencia
            </span>
            <h2 className="font-bodoni text-3xl sm:text-5xl text-[#2B090E] mt-1 font-light tracking-wide">
              Momentos by Leslye
            </h2>
            <p className="font-serif-luxury italic text-[#2B090E]/80 text-base sm:text-lg mt-2">
              Instantáneas que capturan el cariño, la belleza y la complicidad de nuestro equipo
            </p>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
          </motion.div>

          {/* Cuadrícula estilo Masonry de Polaroids con animación Stagger */}
          <motion.div 
            variants={contenedorGaleriaVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08, margin: "0px 0px -40px 0px" }}
            className="columns-1 sm:columns-2 md:columns-3 gap-6 sm:gap-8 space-y-8 sm:space-y-10"
          >
            {galeriaFotos.map((item, idx) => {
              const cintaRotacion = idx % 2 === 0 ? '-rotate-2' : 'rotate-2';

              return (
                <motion.div 
                  key={idx} 
                  variants={polaroidItemVariants}
                  custom={idx}
                  className="break-inside-avoid group cursor-pointer pt-3 will-change-transform"
                  onClick={() => setLightboxFoto(item.url)}
                >
                  <div className="relative transition-all duration-500 ease-out group-hover:rotate-0 group-hover:scale-[1.03] group-hover:z-20">
                    
                    {/* Cinta washi tape decorativa en tono Rojo suave */}
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 bg-[#F7CCD0] border-l border-r border-[#C81D25]/40 backdrop-blur-sm z-20 shadow-xs ${cintaRotacion} pointer-events-none`} />

                    {/* Marco Polaroid en Papel Marfil Fino con borde dorado sutil */}
                    <div className="bg-[#FFFDFB] p-3 sm:p-4 pb-6 sm:pb-8 rounded-sm shadow-[0_12px_35px_rgba(43,9,14,0.12)] group-hover:shadow-[0_22px_50px_rgba(43,9,14,0.22)] border border-[#D4AF37]/35 transition-all">
                      
                      {/* Contenedor Fotográfico sin recortes */}
                      <div className="relative bg-[#FAF3F3] overflow-hidden rounded-xs flex items-center justify-center">
                        <img
                          src={item.url}
                          alt={item.titulo}
                          className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                        
                        {/* Overlay sutil al hover con ícono de zoom */}
                        <div className="absolute inset-0 bg-[#2B090E]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="p-2.5 rounded-full bg-[#FFFDFB] text-[#C81D25] shadow-md border border-[#D4AF37] transform scale-90 group-hover:scale-100 transition-transform">
                            <Maximize2 className="w-4 h-4" />
                          </span>
                        </div>
                      </div>

                      {/* Pie de foto manuscrito auténtico Polaroid */}
                      <div className="pt-4 text-center space-y-0.5">
                        <p className="font-pinyon text-2xl sm:text-3xl text-[#2B090E] tracking-wide leading-tight">
                          {item.titulo}
                        </p>
                        <p className="font-sans-luxury text-[9px] tracking-[0.28em] uppercase text-[#C81D25] font-medium">
                          {item.categoria} • 2026
                        </p>
                      </div>

                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* ==================== G) CONFIRMACIÓN DE ASISTENCIA & BUZÓN DE BUENOS DESEOS ==================== */}
      <section className="py-20 px-4 sm:px-8 scroll-mt-6 relative z-10" id="rsvp">
        <div className="max-w-2xl mx-auto">
          
          {/* Tarjeta tipo papelería fina en Marfil con doble borde en Oro Champaña (#D4AF37) y animación de entrada suave */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15, margin: "0px 0px -50px 0px" }}
            transition={{ 
              duration: 0.85, 
              ease: [0.25, 1, 0.5, 1] 
            }}
            className="bg-[#FFFDFB] rounded-3xl border-2 border-[#D4AF37] p-8 sm:p-12 shadow-[0_25px_60px_rgba(43,9,14,0.22)] relative will-change-transform"
          >
            
            {/* Borde interior dorado de papelería fina */}
            <div className="absolute inset-2.5 sm:inset-3 border border-[#D4AF37]/40 rounded-2xl pointer-events-none" />

            <div className="text-center mb-8 relative z-10">
              <div className="flex justify-center mb-2">
                <RamoNavidenoPino />
              </div>
              <span className="font-sans-luxury text-xs tracking-[0.35em] uppercase text-[#C81D25] font-semibold block">
                R.S.V.P.
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#2B090E] mt-1">
                Confirmación & Deseos
              </h2>
              <p className="font-serif-luxury italic text-base sm:text-lg text-[#2B090E]/80 mt-2">
                "Tu presencia es el regalo más hermoso de esta noche."
              </p>
            </div>

            {confirmado ? (
              <div className="text-center py-8 space-y-4 relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#F7CCD0] text-[#C81D25] mx-auto flex items-center justify-center border border-[#D4AF37]/40">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <h3 className="font-editorial text-2xl text-[#2B090E]">
                  ¡Gracias, {nombre}!
                </h3>
                <p className="font-serif-luxury italic text-lg text-[#2B090E]/85 max-w-md mx-auto">
                  Tu mensaje ha sido enviado a WhatsApp. Estamos muy emocionadas de celebrar juntas.
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmado(false)}
                  className="mt-4 text-xs font-sans-luxury tracking-widest uppercase text-[#C81D25] hover:text-[#2B090E] transition-colors font-semibold"
                >
                  Modificar respuesta
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnviarWhatsApp} className="space-y-6 relative z-10">
                
                {/* 1. Nombre y Apellido */}
                <div className="space-y-1">
                  <label className="font-sans-luxury text-xs tracking-wider uppercase text-[#2B090E] font-medium block">
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Escribe tu nombre completo"
                    className="w-full border-0 border-b border-[#C81D25]/40 bg-transparent py-2.5 text-[#2B090E] placeholder-[#2B090E]/40 focus:border-[#D4AF37] focus:outline-none transition-colors font-sans-luxury text-sm"
                  />
                </div>

                {/* 2. Confirmación */}
                <div className="space-y-2">
                  <label className="font-sans-luxury text-xs tracking-wider uppercase text-[#2B090E] font-medium block">
                    ¿Podrás acompañarnos? *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setAsistencia('¡Sí, ahí estaré para celebrar juntas!')}
                      className={`p-3 rounded-xl border text-xs tracking-wider font-sans-luxury text-left transition-all cursor-pointer ${
                        asistencia === '¡Sí, ahí estaré para celebrar juntas!'
                          ? 'bg-[#C81D25] text-white border-[#D4AF37] shadow-sm font-semibold'
                          : 'bg-transparent text-[#2B090E] border-[#D4AF37]/50 hover:bg-[#F7CCD0]/40'
                      }`}
                    >
                      ✨ ¡Sí, ahí estaré para celebrar juntas!
                    </button>
                    <button
                      type="button"
                      onClick={() => setAsistencia('No podré asistir')}
                      className={`p-3 rounded-xl border text-xs tracking-wider font-sans-luxury text-left transition-all cursor-pointer ${
                        asistencia === 'No podré asistir'
                          ? 'bg-[#C81D25] text-white border-[#D4AF37] shadow-sm font-semibold'
                          : 'bg-transparent text-[#2B090E] border-[#D4AF37]/50 hover:bg-[#F7CCD0]/40'
                      }`}
                    >
                      🤍 No podré asistir
                    </button>
                  </div>
                </div>

                {/* 3. Buzón de Deseos */}
                <div className="space-y-1">
                  <label className="font-sans-luxury text-xs tracking-wider uppercase text-[#2B090E] font-medium block">
                    Buzón de Deseos Navideños
                  </label>
                  <textarea
                    rows={3}
                    value={deseo}
                    onChange={(e) => setDeseo(e.target.value)}
                    placeholder="Escribe un lindo deseo navideño para Leslye y su equipo..."
                    className="w-full border-0 border-b border-[#C81D25]/40 bg-transparent py-2.5 text-[#2B090E] placeholder-[#2B090E]/40 focus:border-[#D4AF37] focus:outline-none transition-colors font-sans-luxury text-sm resize-none"
                  />
                </div>

                {/* Botón Principal con degradado Rojo y ribete dorado */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#DC2626] via-[#C81D25] to-[#8B0000] text-white font-sans-luxury text-xs tracking-[0.3em] uppercase font-semibold border-2 border-[#D4AF37] shadow-[0_10px_25px_rgba(104,24,41,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>ENVIAR CONFIRMACIÓN VÍA WHATSAPP</span>
                  </button>
                </div>

              </form>
            )}

          </motion.div>

        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-12 px-6 relative z-10 text-center border-t-2 border-[#D4AF37]/50 bg-[#FFFDFB]/90 backdrop-blur-md">
        <div className="max-w-md mx-auto space-y-2">
          <p className="font-editorial text-lg text-[#2B090E]">
            Posada Navideña • Edición 2026
          </p>
          <div className="flex flex-col items-center justify-center gap-1.5 py-1">
            <span className="font-sans-luxury text-xs tracking-[0.4em] uppercase text-[#2B090E]/80 font-medium">
              Clínica de Belleza
            </span>
            <span className="font-pinyon text-3xl sm:text-4xl text-[#B91C1C]">
              By Leslye
            </span>
          </div>
          <p className="font-sans-luxury text-[10px] tracking-[0.35em] uppercase text-[#2B090E]/60 pt-2">
            Celebrando la Belleza y la Gratitud
          </p>
        </div>
      </footer>

      {/* ==================== LIGHTBOX MODAL POLAROID ==================== */}
      {lightboxFoto && (
        <div 
          className="fixed inset-0 z-50 bg-[#2B090E]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxFoto(null)}
        >
          <div 
            className="relative max-w-lg w-full bg-[#FFFDFB] p-3 sm:p-5 pb-7 sm:pb-9 rounded-sm border-2 border-[#D4AF37] shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cinta decorativa superior en Rojo suave */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-6 bg-[#F7CCD0] border-l border-r border-[#C81D25]/40 backdrop-blur-sm z-20 shadow-xs rotate-[-1deg] pointer-events-none" />

            <button
              type="button"
              onClick={() => setLightboxFoto(null)}
              className="absolute -top-3 -right-3 p-2 rounded-full bg-[#C81D25] text-white border border-[#D4AF37] shadow-lg cursor-pointer hover:scale-110 transition-transform z-30"
              aria-label="Cerrar fotografía"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Contenedor Fotográfico */}
            <div className="bg-[#FAF3F3] rounded-xs overflow-hidden flex items-center justify-center">
              <img 
                src={lightboxFoto} 
                alt="Detalle Polaroid" 
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>

            {/* Pie de foto manuscrito en Lightbox */}
            <div className="pt-4 sm:pt-5 text-center">
              <p className="font-pinyon text-2xl sm:text-3xl text-[#2B090E]">
                Momentos by Leslye
              </p>
              <p className="font-sans-luxury text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#C81D25]">
                Posada Navideña • Diciembre 2026
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== BOTÓN FLOTANTE DISCRETO DE MÚSICA (ROSE GOLD #B76E79 & BORDE DORADO #D4AF37) ==================== */}
      <aside 
        className="fixed bottom-6 right-6 z-40 flex items-center select-none"
        aria-label="Reproductor de música de fondo"
      >
        <button
          type="button"
          onClick={toggleMusica}
          className="group relative p-3 sm:p-3.5 rounded-full bg-[#B76E79] hover:bg-[#A65B66] text-[#FFFDFB] border-2 border-[#D4AF37] shadow-[0_8px_25px_rgba(183,110,121,0.55)] hover:shadow-[0_10px_30px_rgba(212,175,55,0.45)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
          title={musicaReproduciendo ? "Pausar música: Auni - Twinkling Lights Reimagined" : "Reanudar música: Auni - Twinkling Lights Reimagined"}
          aria-label={musicaReproduciendo ? "Pausar música de fondo" : "Reproducir música de fondo"}
        >
          {/* Halo sutil de pulsación cuando la melodía está activa */}
          {musicaReproduciendo && (
            <span className="absolute -inset-1 rounded-full bg-[#D4AF37]/35 blur-xs animate-pulse pointer-events-none" />
          )}

          {/* Icono de música interactivo */}
          {musicaReproduciendo ? (
            <div className="relative flex items-center justify-center">
              <Music className="w-5 h-5 text-[#FFFDFB] animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D4AF37] shadow-xs" />
            </div>
          ) : (
            <VolumeX className="w-5 h-5 text-[#FFFDFB]/85" />
          )}

          {/* Etiqueta flotante con estilo de alta costura al pasar el cursor */}
          <span className="absolute right-full mr-3 whitespace-nowrap px-3 py-1.5 rounded-full bg-[#FFFDF9]/95 backdrop-blur-md border border-[#D4AF37] text-[10px] font-sans-luxury tracking-wider text-[#2B090E] shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 font-medium translate-x-1 group-hover:translate-x-0 hidden sm:inline-block">
            {musicaReproduciendo ? '🎵 Twinkling Lights (Sonando)' : '🔇 Activar Música'}
          </span>
        </button>
      </aside>

    </div>
  );
}

