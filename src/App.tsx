import React, { useEffect, useRef, useState } from 'react';
import { LottieIcon } from './components/LottieIcon';

const MAX_PULL = 440;
const THRESHOLD = 140;
const DRAG_RESISTANCE = 0.78;

interface PhysicsPill {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  angle: number;
  va: number;
  text: string;
}

export const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startYRef = useRef(0);
  const currentPullRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gravityRef = useRef({ x: 0, y: 0.55 });

  useEffect(() => {
    if (window.screen?.orientation && 'lock' in window.screen.orientation) {
      (window.screen.orientation as unknown as { lock: (orientation: string) => Promise<void> })
        .lock('portrait')
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const radGamma = (e.gamma * Math.PI) / 180;
        const radBeta = (e.beta * Math.PI) / 180;
        gravityRef.current = {
          x: Math.sin(radGamma) * 0.75,
          y: Math.sin(radBeta) * 0.75
        };
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

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

    const pills: PhysicsPill[] = [
      {
        x: width * 0.25,
        y: height * 0.05,
        vx: 1.2,
        vy: 2.0,
        width: 146,
        height: 30,
        angle: -0.15,
        va: 0.02,
        text: 'создано @temkazavr'
      },
      {
        x: width * 0.6,
        y: height * -0.1,
        vx: -1.0,
        vy: 1.8,
        width: 146,
        height: 30,
        angle: 0.2,
        va: -0.015,
        text: 'создано @temkazavr'
      },
      {
        x: width * 0.45,
        y: height * -0.25,
        vx: 0.5,
        vy: 1.5,
        width: 146,
        height: 30,
        angle: 0.05,
        va: 0.01,
        text: 'создано @temkazavr'
      }
    ];

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const gx = gravityRef.current.x;
      const gy = gravityRef.current.y;

      pills.forEach((p) => {
        p.vx += gx;
        p.vy += gy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.va;
        p.va *= 0.98;

        const halfW = p.width / 2;
        const halfH = p.height / 2;

        if (p.x - halfW < 12) {
          p.x = 12 + halfW;
          p.vx = -p.vx * 0.55;
          p.va = (Math.random() - 0.5) * 0.04;
        } else if (p.x + halfW > width - 12) {
          p.x = width - 12 - halfW;
          p.vx = -p.vx * 0.55;
          p.va = (Math.random() - 0.5) * 0.04;
        }

        if (p.y - halfH < 12) {
          p.y = 12 + halfH;
          p.vy = -p.vy * 0.55;
          p.va = (Math.random() - 0.5) * 0.04;
        } else if (p.y + halfH > height - 16) {
          p.y = height - 16 - halfH;
          p.vy = -p.vy * 0.55;
          p.va = (Math.random() - 0.5) * 0.04;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        ctx.beginPath();
        const r = halfH;
        ctx.roundRect(-halfW, -halfH, p.width, p.height, r);
        ctx.fillStyle = 'rgba(28, 30, 38, 0.82)';
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.stroke();

        ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.58)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.text, 0, 1);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCreateRoom = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([20, 40, 20]);
    }
  };

  const handleRoomsList = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    currentPullRef.current = isOpen ? MAX_PULL : 0;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const rawDeltaY = (startYRef.current - currentY) * DRAG_RESISTANCE;

    if (!isOpen) {
      const clamped = Math.max(0, Math.min(MAX_PULL, rawDeltaY));
      currentPullRef.current = clamped;
      setPullDistance(clamped);
    } else {
      const clamped = Math.max(0, Math.min(MAX_PULL, MAX_PULL + rawDeltaY));
      currentPullRef.current = clamped;
      setPullDistance(clamped);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!isOpen) {
      if (currentPullRef.current >= THRESHOLD) {
        setIsOpen(true);
        setPullDistance(MAX_PULL);
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate(20);
        }
      } else {
        setIsOpen(false);
        setPullDistance(0);
      }
    } else {
      if (currentPullRef.current <= MAX_PULL - THRESHOLD) {
        setIsOpen(false);
        setPullDistance(0);
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate(20);
        }
      } else {
        setIsOpen(true);
        setPullDistance(MAX_PULL);
      }
    }
  };

  const activeDistance = isDragging ? pullDistance : isOpen ? MAX_PULL : 0;
  const progress = Math.min(1, Math.max(0, activeDistance / MAX_PULL));

  let bottomPromptText = 'Как играть?';
  if (activeDistance > 160) {
    bottomPromptText = 'Еще чуток!';
  } else if (activeDistance > 45) {
    bottomPromptText = 'Да-да, тяни';
  }

  return (
    <>
      <div className="landscape-lock-overlay">
        <h2>Пожалуйста, поверните устройство</h2>
        <p>Приложение работает только в вертикальном режиме</p>
      </div>

      <div className="app-viewport">
        <canvas
          ref={canvasRef}
          className="rules-physics-canvas"
          style={{
            opacity: progress,
            pointerEvents: 'none',
            transition: isDragging ? 'none' : 'opacity 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)'
          }}
        />

        <main
          className="screen-container main-content-wrapper"
          style={{
            transform: `translateY(-${progress * 115}vh)`,
            opacity: 1 - progress * 1.15,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)',
            pointerEvents: progress > 0.35 ? 'none' : 'auto'
          }}
        >
          <div className="animation-slot">
            <LottieIcon 
              src="/Hi.json" 
              className="home-lottie-host" 
              fallbackClass="ios-skeleton-box" 
            />
          </div>

          <div className="text-group">
            <h1 className="hero-title">
              Загадай суперсилу, а друг подберет{' '}
              <span className="title-nowrap-bundle">
                дебафф!
                <img src="/purple.png" alt="" className="inline-title-emoji" />
              </span>
            </h1>
            <p className="hero-subtitle">
              Но для этого нужно вступить в комнату, или создать свою и позвать друзей, хехе
            </p>
          </div>

          <div className="action-buttons-group">
            <button 
              type="button" 
              className="ios-glass-btn green-accent-btn"
              onClick={handleCreateRoom}
            >
              Создать комнату
            </button>

            <button 
              type="button" 
              className="ios-glass-btn"
              onClick={handleRoomsList}
            >
              Список комнат
            </button>
          </div>

          <span className="author-tagline">Создано @temkazavr</span>
        </main>

        <div
          className="rules-view-container"
          style={{
            transform: `translate(-50%, calc(-50% + ${(1 - progress) * 115}vh))`,
            opacity: progress,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)',
            pointerEvents: progress < 0.65 ? 'none' : 'auto'
          }}
        >
          <section className="rules-sheet-box">
            <div className="rules-section-item">
              <h2 className="rules-heading">А как играть-то?</h2>
              <p className="rules-paragraph">
                Каждый игрок сначала получит карточку, в которую нужно придумать и вписать суперсилу. А потом Крегг перемешает ваши карточки так, что нужно будет придумать дебафф для этой суперсилы. В конце игры - получится классный коллаж, который к тому же можно сохранить на память!
              </p>
            </div>

            <div className="rules-section-item">
              <h2 className="rules-heading">Правила игры</h2>
              <p className="rules-paragraph">
                Крегг не следит за играми и не модерирует их, а еще они нигде не хранятся. Так что единственное правило - веселиться!
              </p>
            </div>
          </section>

          <button
            type="button"
            className="ios-glass-btn green-accent-btn rules-report-btn"
            onClick={() => {}}
          >
            Репорт
          </button>
        </div>

        <div
          className="top-pull-interactive-zone"
          style={{
            opacity: progress,
            pointerEvents: progress > 0.65 ? 'auto' : 'none',
            transform: `translateY(${(1 - progress) * -35}px)`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => {
            setIsOpen(false);
            setPullDistance(0);
          }}
        >
          <div className="pull-drag-pill" />
          <span className="pull-interactive-text">Потяни вниз, чтобы закрыть</span>
        </div>

        <div
          className="bottom-pull-interactive-zone"
          style={{
            opacity: 1 - progress,
            pointerEvents: progress > 0.35 ? 'none' : 'auto',
            transform: `translateY(${progress * 35}px)`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => {
            setIsOpen(true);
            setPullDistance(MAX_PULL);
          }}
        >
          <div className="pull-drag-pill" />
          <span className="pull-interactive-text">{bottomPromptText}</span>
        </div>
      </div>
    </>
  );
};

export default App;
