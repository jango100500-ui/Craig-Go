import React, { useEffect, useRef, useState } from 'react';
import { LottieIcon } from './components/LottieIcon';

const MAX_PULL = 340;
const THRESHOLD = 110;

export const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startYRef = useRef(0);
  const currentPullRef = useRef(0);

  useEffect(() => {
    if (window.screen?.orientation && 'lock' in window.screen.orientation) {
      (window.screen.orientation as unknown as { lock: (orientation: string) => Promise<void> })
        .lock('portrait')
        .catch(() => {});
    }
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
    const deltaY = startYRef.current - currentY;

    if (!isOpen) {
      const clamped = Math.max(0, Math.min(MAX_PULL, deltaY));
      currentPullRef.current = clamped;
      setPullDistance(clamped);
    } else {
      const clamped = Math.max(0, Math.min(MAX_PULL, MAX_PULL + deltaY));
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
  if (!isOpen) {
    if (activeDistance > 115) {
      bottomPromptText = 'Еще чуток!';
    } else if (activeDistance > 35) {
      bottomPromptText = 'Да-да, тяни';
    }
  } else {
    bottomPromptText = 'Потяни вниз, чтобы свернуть';
  }

  return (
    <>
      <div className="landscape-lock-overlay">
        <h2>Пожалуйста, поверните устройство</h2>
        <p>Приложение работает только в вертикальном режиме</p>
      </div>

      <div className="app-viewport">
        <main
          className="screen-container main-content-wrapper"
          style={{
            transform: `translateY(-${progress * 130}px) scale(${1 - progress * 0.08})`,
            opacity: 1 - progress * 0.9,
            transition: isDragging ? 'none' : 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: progress > 0.4 ? 'none' : 'auto'
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
              Загадай суперсилу, а друг подберет дебафф!
              <img src="/purple.png" alt="" className="inline-title-emoji" />
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

        <section
          className="rules-sheet-box"
          style={{
            transform: `translate(-50%, ${100 - progress * 100}%)`,
            opacity: Math.min(1, progress * 1.3),
            transition: isDragging ? 'none' : 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: progress < 0.2 ? 'none' : 'auto'
          }}
        >
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

        <div
          className="bottom-pull-interactive-zone"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => {
            if (!isDragging) {
              setIsOpen((prev) => !prev);
              setPullDistance((prev) => (prev > 0 ? 0 : MAX_PULL));
            }
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
