import React, { useEffect, useRef } from 'react';

interface Pill {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  radius: number;
  angle: number;
  vAngle: number;
  scaleX: number;
  scaleY: number;
  vScaleX: number;
  vScaleY: number;
  text: string;
}

export const JellySandbox: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pillsRef = useRef<Pill[]>([]);
  const gravityRef = useRef({ x: 0, y: 0.5 });
  const draggedPillRef = useRef<{ index: number; offsetX: number; offsetY: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    pillsRef.current = [
      {
        x: width * 0.3,
        y: 20,
        vx: 1.2,
        vy: 0,
        w: 168,
        h: 30,
        radius: 15,
        angle: -0.08,
        vAngle: 0.005,
        scaleX: 1,
        scaleY: 1,
        vScaleX: 0,
        vScaleY: 0,
        text: 'создано @temkazavr',
      },
      {
        x: width * 0.7,
        y: 10,
        vx: -1.0,
        vy: 0,
        w: 168,
        h: 30,
        radius: 15,
        angle: 0.1,
        vAngle: -0.004,
        scaleX: 1,
        scaleY: 1,
        vScaleX: 0,
        vScaleY: 0,
        text: 'создано @temkazavr',
      },
    ];

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const gx = Math.min(1, Math.max(-1, e.gamma / 35)) * 0.7;
        const gy = Math.min(1, Math.max(-1, e.beta / 35)) * 0.7;
        gravityRef.current = { x: gx, y: gy };
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    const springStiffness = 0.18;
    const springDamping = 0.76;

    const updateAndRender = () => {
      ctx.clearRect(0, 0, width, height);

      const gx = gravityRef.current.x;
      const gy = gravityRef.current.y;

      const pills = pillsRef.current;

      for (let i = 0; i < pills.length; i++) {
        const p = pills[i];
        const isDragged = draggedPillRef.current?.index === i;

        if (!isDragged) {
          p.vx += gx;
          p.vy += gy;
          p.x += p.vx;
          p.y += p.vy;
          p.angle += p.vAngle;
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.vAngle *= 0.98;
        }

        const forceX = (1 - p.scaleX) * springStiffness;
        p.vScaleX = (p.vScaleX + forceX) * springDamping;
        p.scaleX += p.vScaleX;

        const forceY = (1 - p.scaleY) * springStiffness;
        p.vScaleY = (p.vScaleY + forceY) * springDamping;
        p.scaleY += p.vScaleY;

        const halfW = (p.w * p.scaleX) / 2;
        const halfH = (p.h * p.scaleY) / 2;

        if (p.x - halfW < 0) {
          p.x = halfW;
          p.vx = -p.vx * 0.55;
          p.scaleX = 0.75;
          p.scaleY = 1.25;
          p.vAngle += (Math.random() - 0.5) * 0.05;
        } else if (p.x + halfW > width) {
          p.x = width - halfW;
          p.vx = -p.vx * 0.55;
          p.scaleX = 0.75;
          p.scaleY = 1.25;
          p.vAngle += (Math.random() - 0.5) * 0.05;
        }

        if (p.y - halfH < 0) {
          p.y = halfH;
          p.vy = -p.vy * 0.55;
          p.scaleY = 0.7;
          p.scaleX = 1.3;
        } else if (p.y + halfH > height) {
          p.y = height - halfH;
          p.vy = -p.vy * 0.55;
          p.scaleY = 0.68;
          p.scaleX = 1.32;
          p.vx *= 0.92;
        }

        for (let j = i + 1; j < pills.length; j++) {
          const other = pills[j];
          const dx = other.x - p.x;
          const dy = other.y - p.y;
          const dist = Math.hypot(dx, dy);
          const minDist = (p.h + other.h) * 0.85;

          if (dist < minDist && dist > 0.001) {
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;

            p.x -= nx * overlap;
            p.y -= ny * overlap;
            other.x += nx * overlap;
            other.y += ny * overlap;

            const dvx = p.vx - other.vx;
            const dvy = p.vy - other.vy;
            const dot = dvx * nx + dvy * ny;

            if (dot > 0) {
              p.vx -= nx * dot * 0.6;
              p.vy -= ny * dot * 0.6;
              other.vx += nx * dot * 0.6;
              other.vy += ny * dot * 0.6;

              p.scaleX = 1.18;
              p.scaleY = 0.82;
              other.scaleX = 0.82;
              other.scaleY = 1.18;
            }
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(p.scaleX, p.scaleY);

        ctx.beginPath();
        const rx = -p.w / 2;
        const ry = -p.h / 2;
        const rw = p.w;
        const rh = p.h;
        const rad = p.radius;

        ctx.moveTo(rx + rad, ry);
        ctx.lineTo(rx + rw - rad, ry);
        ctx.arcTo(rx + rw, ry, rx + rw, ry + rad, rad);
        ctx.lineTo(rx + rw, ry + rh - rad);
        ctx.arcTo(rx + rw, ry + rh, rx + rw - rad, ry + rh, rad);
        ctx.lineTo(rx + rad, ry + rh);
        ctx.arcTo(rx, ry + rh, rx, ry + rh - rad, rad);
        ctx.lineTo(rx, ry + rad);
        ctx.arcTo(rx, ry, rx + rad, ry, rad);
        ctx.closePath();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.text, 0, 1);

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(updateAndRender);
    };

    animFrameRef.current = requestAnimationFrame(updateAndRender);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const handlePointerDown = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    for (let i = pillsRef.current.length - 1; i >= 0; i--) {
      const p = pillsRef.current[i];
      if (Math.abs(p.x - x) < p.w / 2 && Math.abs(p.y - y) < p.h / 2) {
        draggedPillRef.current = {
          index: i,
          offsetX: p.x - x,
          offsetY: p.y - y,
        };
        p.scaleX = 1.22;
        p.scaleY = 0.84;
        break;
      }
    }
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!draggedPillRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const p = pillsRef.current[draggedPillRef.current.index];
    const targetX = clientX - rect.left + draggedPillRef.current.offsetX;
    const targetY = clientY - rect.top + draggedPillRef.current.offsetY;

    p.vx = (targetX - p.x) * 0.4;
    p.vy = (targetY - p.y) * 0.4;
    p.x = targetX;
    p.y = targetY;
  };

  const handlePointerUp = () => {
    draggedPillRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      className="jelly-sandbox-canvas"
      onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handlePointerUp}
    />
  );
};

export default JellySandbox;
