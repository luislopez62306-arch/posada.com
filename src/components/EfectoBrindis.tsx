import React, { useEffect, useRef } from 'react';

interface EfectoBrindisProps {
  activo: boolean;
  brindisCount: number;
}

interface Confeti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  color: string;
  colorHighlight: string;
  shape: 'rect' | 'ribbon' | 'star' | 'circle';
  opacity: number;
  decay: number;
  flutter: number;
}

interface Burbuja {
  x: number;
  y: number;
  radius: number;
  vy: number;
  vx: number;
  wobble: number;
  wobbleSpeed: number;
  wobbleDist: number;
  opacity: number;
  maxLife: number;
  life: number;
  color: string;
  hasHighlight: boolean;
}

export default function EfectoBrindis({ activo, brindisCount }: EfectoBrindisProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const particlesRef = useRef<{ confetis: Confeti[]; burbujas: Burbuja[] }>({
    confetis: [],
    burbujas: []
  });

  // Disparar ráfaga festiva cada vez que cambia brindisCount (> 0)
  useEffect(() => {
    if (!activo || brindisCount === 0) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Paletas de oro metálico para el confeti
    const oros = [
      { base: '#F3E5AB', light: '#FFFFFF' }, // Champaña muy claro
      { base: '#F5D061', light: '#FFFBEA' }, // Oro suave
      { base: '#D4AF37', light: '#FFF6D1' }, // Oro puro gala
      { base: '#E6C665', light: '#FFF9E6' }, // Oro satinado
      { base: '#C59A27', light: '#F9E29D' }, // Oro añejo
      { base: '#B38728', light: '#EDD187' }, // Bronce dorado
      { base: '#C81D25', light: '#FF8A93' }  // Pincelada rubí de gala
    ];

    // 1. Generar 85 confetis dorados tridimensionales
    const nuevosConfetis: Confeti[] = [];
    const cantidadConfetis = width < 768 ? 65 : 100;
    
    // Punto de origen: centro de la pantalla o desde los costados hacia arriba
    for (let i = 0; i < cantidadConfetis; i++) {
      const angulo = -Math.PI / 2 + (Math.random() * 1.8 - 0.9);
      const velocidad = Math.random() * 16 + 10;
      const paleta = oros[Math.floor(Math.random() * oros.length)];
      const shapes: Array<'rect' | 'ribbon' | 'star' | 'circle'> = ['rect', 'ribbon', 'star', 'circle'];

      nuevosConfetis.push({
        x: width * 0.5 + (Math.random() * 200 - 100),
        y: height * 0.72 + (Math.random() * 60 - 30),
        vx: Math.cos(angulo) * velocidad + (Math.random() * 4 - 2),
        vy: Math.sin(angulo) * velocidad - (Math.random() * 4 + 2),
        width: Math.random() * 10 + 6,
        height: Math.random() * 14 + 8,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: Math.random() * 0.15 - 0.075,
        vRotY: Math.random() * 0.15 - 0.075,
        vRotZ: Math.random() * 0.12 - 0.06,
        color: paleta.base,
        colorHighlight: paleta.light,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        opacity: 1,
        decay: Math.random() * 0.003 + 0.0025,
        flutter: Math.random() * 0.05
      });
    }

    // 2. Generar 70 burbujas de champán efervescentes
    const nuevasBurbujas: Burbuja[] = [];
    const cantidadBurbujas = width < 768 ? 55 : 85;

    for (let i = 0; i < cantidadBurbujas; i++) {
      nuevasBurbujas.push({
        x: width * 0.2 + Math.random() * (width * 0.6),
        y: height + Math.random() * 120,
        radius: Math.random() * 4.5 + 2.0,
        vy: -(Math.random() * 2.8 + 1.6),
        vx: (Math.random() * 0.6 - 0.3),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.04 + 0.02,
        wobbleDist: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.55,
        maxLife: height + 100,
        life: 0,
        color: Math.random() > 0.3 ? 'rgba(255, 248, 220, ' : 'rgba(245, 222, 147, ',
        hasHighlight: Math.random() > 0.2
      });
    }

    particlesRef.current.confetis.push(...nuevosConfetis);
    particlesRef.current.burbujas.push(...nuevasBurbujas);

  }, [activo, brindisCount]);

  // Loop de física y dibujo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const { confetis, burbujas } = particlesRef.current;

      // ==================== A) DIBUJAR BURBUJAS DE CHAMPÁN ====================
      for (let i = burbujas.length - 1; i >= 0; i--) {
        const b = burbujas[i];
        b.wobble += b.wobbleSpeed;
        b.y += b.vy;
        b.x += b.vx + Math.sin(b.wobble) * b.wobbleDist;
        b.life += Math.abs(b.vy);

        // Desvanecimiento suave al subir
        if (b.y < height * 0.15) {
          b.opacity *= 0.96;
        }

        if (b.y < -30 || b.opacity <= 0.02) {
          burbujas.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);

        // Relleno traslúcido de licor de champán
        ctx.fillStyle = `${b.color}${b.opacity * 0.35})`;
        ctx.fill();

        // Borde delicado con tensión superficial
        ctx.strokeStyle = `rgba(212, 175, 55, ${b.opacity * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Destello especular brillante (micro-reflejo esférico de luz)
        if (b.hasHighlight) {
          ctx.beginPath();
          ctx.arc(
            b.x - b.radius * 0.35,
            b.y - b.radius * 0.35,
            b.radius * 0.3,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.85})`;
          ctx.fill();
        }

        ctx.restore();
      }

      // ==================== B) DIBUJAR CONFETI DORADO 3D ====================
      const gravedad = 0.32;
      const friccionAire = 0.985;

      for (let i = confetis.length - 1; i >= 0; i--) {
        const c = confetis[i];

        // Física
        c.vy += gravedad;
        c.vx *= friccionAire;
        c.vy *= friccionAire;

        c.x += c.vx;
        c.y += c.vy;

        c.rotX += c.vRotX;
        c.rotY += c.vRotY;
        c.rotZ += c.vRotZ;

        // Viento sutil y aleteo
        c.x += Math.sin(c.rotY) * 0.8;
        c.opacity -= c.decay;

        if (c.y > height + 60 || c.opacity <= 0) {
          confetis.splice(i, 1);
          continue;
        }

        // Proyección tridimensional
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotZ);

        // Escalado según giro en X e Y para simular grosor de papel foil
        const scaleX = Math.cos(c.rotY);
        const scaleY = Math.sin(c.rotX);
        ctx.scale(scaleX, scaleY);

        ctx.globalAlpha = Math.max(0, Math.min(1, c.opacity));

        // Reflejo metálico según ángulo hacia la luz
        const brillo = Math.abs(scaleX * scaleY);
        ctx.fillStyle = brillo > 0.65 ? c.colorHighlight : c.color;

        if (c.shape === 'star') {
          // Estrella dorada de 4 puntas
          const r = c.width * 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.quadraticCurveTo(0, 0, 0, r);
          ctx.quadraticCurveTo(0, 0, -r, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r);
          ctx.fill();
        } else if (c.shape === 'circle') {
          // Lentejuela circular dorada
          ctx.beginPath();
          ctx.arc(0, 0, c.width * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (c.shape === 'ribbon') {
          // Tira alargada de papel de gala
          ctx.fillRect(-c.width * 0.3, -c.height * 0.8, c.width * 0.6, c.height * 1.6);
        } else {
          // Rectángulo clásico de confeti
          ctx.fillRect(-c.width * 0.5, -c.height * 0.5, c.width, c.height);
        }

        // Borde áureo micro-delgado
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-45 w-full h-full"
    />
  );
}
