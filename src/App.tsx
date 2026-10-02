import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LottieIcon } from './components/LottieIcon';

const MAX_PULL = 440;
const THRESHOLD = 140;
const DRAG_RESISTANCE = 0.78;

const FALLBACK_AVATARS = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2387d50c"/><text x="50" y="58" font-size="34" font-family="sans-serif" text-anchor="middle" fill="%230b0c0f">🐊</text></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23a855f7"/><text x="50" y="58" font-size="34" font-family="sans-serif" text-anchor="middle" fill="%23ffffff">😈</text></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%233b82f6"/><text x="50" y="58" font-size="34" font-family="sans-serif" text-anchor="middle" fill="%23ffffff">⚡</text></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ec4899"/><text x="50" y="58" font-size="34" font-family="sans-serif" text-anchor="middle" fill="%23ffffff">✨</text></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23eab308"/><text x="50" y="58" font-size="34" font-family="sans-serif" text-anchor="middle" fill="%230b0c0f">🔥</text></svg>'
];

export const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);
  const [nickname, setNickname] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const startYRef = useRef(0);
  const currentPullRef = useRef(0);

  const touchStartX = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwipingWheel, setIsSwipingWheel] = useState(false);

  const avatarsList = useMemo(() => {
    try {
      const globFiles = import.meta.glob('/public/avatars/*.{png,jpg,jpeg,webp,svg,gif}', {
        eager: true,
        query: '?url',
        import: 'default'
      });
      const resolvedPaths = Object.keys(globFiles).map((path) =>
        path.replace(/^\/public/, '')
      );
      return resolvedPaths.length > 0 ? resolvedPaths : FALLBACK_AVATARS;
    } catch {
      return FALLBACK_AVATARS;
    }
  }, []);

  useEffect(() => {
    if (window.screen?.orientation && 'lock' in window.screen.orientation) {
      (window.screen.orientation as unknown as { lock: (orientation: string) => Promise<void> })
        .lock('portrait')
        .catch(() => {});
    }

    const timer = setTimeout(() => {
      setIsOnboardingVisible(true);
    }, 180);

    return () => clearTimeout(timer);
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

  const handleNextOnboardingStep = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
    setOnboardingStep(2);
  };

  const handleFinishOnboarding = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([20, 40, 20]);
    }
    setIsOnboardingVisible(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isOnboardingVisible) return;
    startYRef.current = e.touches[0].clientY;
    currentPullRef.current = isOpen ? MAX_PULL : 0;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isOnboardingVisible) return;
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
    if (!isDragging || isOnboardingVisible) return;
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

  const handleWheelTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwipingWheel(true);
  };

  const handleWheelTouchMove = (e: React.TouchEvent) => {
    if (!isSwipingWheel) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    setDragOffset(delta);
  };

  const handleWheelTouchEnd = () => {
    if (!isSwipingWheel) return;
    setIsSwipingWheel(false);

    const stepWidth = 60;
    if (dragOffset < -stepWidth) {
      setCurrentIndex((prev) => (prev + 1) % avatarsList.length);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(18);
      }
    } else if (dragOffset > stepWidth) {
      setCurrentIndex((prev) => (prev - 1 + avatarsList.length) % avatarsList.length);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(18);
      }
    }
    setDragOffset(0);
  };

  const handleImageLoaded = (src: string) => {
    setLoadedImages((prev) => ({ ...prev, [src]: true }));
  };

  const activeDistance = isDragging ? pullDistance : isOpen ? MAX_PULL : 0;
  const progress = Math.min(1, Math.max(0, activeDistance / MAX_PULL));

  let bottomPromptText = 'Как играть?';
  if (activeDistance > 160) {
    bottomPromptText = 'Еще чуток!';
  } else if (activeDistance > 45) {
    bottomPromptText = 'Да-да, тяни';
  }

  const normalizedDrag = Math.max(-1, Math.min(1, dragOffset / 110));

  const visibleOffsets = [-2, -1, 0, 1, 2];

  return (
    <>
      <div className="landscape-lock-overlay">
        <h2>Пожалуйста, поверните устройство</h2>
        <p>Приложение работает только в вертикальном режиме</p>
      </div>

      <div className={`app-viewport ${isOnboardingVisible ? 'background-dimmed-bw' : ''}`}>
        <main
          className="screen-container main-content-wrapper"
          style={{
            transform: `translateY(-${progress * 115}vh)`,
            opacity: 1 - progress * 1.15,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)',
            pointerEvents: progress > 0.35 || isOnboardingVisible ? 'none' : 'auto'
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
              <span>Загадай суперсилу,</span>
              <span className="hero-title-second-row">
                а друг подберет дебафф!
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
            pointerEvents: progress < 0.65 || isOnboardingVisible ? 'none' : 'auto'
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

        {!isOnboardingVisible && (
          <>
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
          </>
        )}
      </div>

      <div className={`onboarding-modal-card ${isOnboardingVisible ? 'visible' : ''}`}>
        {onboardingStep === 1 ? (
          <>
            <div className="onboarding-text-block">
              <h2 className="onboarding-title">Давай познакомимся!</h2>
              <p className="onboarding-subtitle">
                Я Крегг - а как тебя звать? *Выбранный тобой никнейм будет виден другим игрокам
              </p>
            </div>

            <div className="onboarding-input-block">
              <input
                type="text"
                className="onboarding-name-input"
                placeholder="Моё имя"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={24}
              />
              <span className="onboarding-input-hint">
                Выбирай себе классный никнейм и давай продолжим!
              </span>
            </div>

            <div className="onboarding-footer-row">
              <span className="onboarding-step-counter">1/2</span>

              <button
                type="button"
                className="onboarding-next-circle-btn"
                onClick={handleNextOnboardingStep}
                aria-label="Далее"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className="circular-carousel-stage"
              onTouchStart={handleWheelTouchStart}
              onTouchMove={handleWheelTouchMove}
              onTouchEnd={handleWheelTouchEnd}
            >
              <div className="circular-carousel-wheel">
                {visibleOffsets.map((offset) => {
                  const itemIndex =
                    (currentIndex + offset + avatarsList.length * 100) % avatarsList.length;
                  const itemSrc = avatarsList[itemIndex];
                  const isLoaded = loadedImages[itemSrc];

                  const effectiveOffset = offset - normalizedDrag;
                  const absOffset = Math.abs(effectiveOffset);

                  const xPos = effectiveOffset * 76;
                  const yPos = Math.pow(absOffset, 1.8) * 11;
                  const rotZ = effectiveOffset * 13;
                  const scale = Math.max(0.68, 1 - absOffset * 0.17);
                  const opacity = Math.max(0, 1 - absOffset * 0.42);

                  return (
                    <div
                      key={`${offset}-${itemSrc}`}
                      className={`carousel-arch-slot ${absOffset < 0.45 ? 'centered-active' : ''}`}
                      style={{
                        transform: `translate3d(${xPos}px, ${yPos}px, 0) rotate(${rotZ}deg) scale(${scale})`,
                        opacity,
                        zIndex: Math.round(10 - absOffset * 2),
                        transition: isSwipingWheel
                          ? 'none'
                          : 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onClick={() => {
                        if (offset !== 0) {
                          setCurrentIndex(itemIndex);
                          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                            navigator.vibrate(15);
                          }
                        }
                      }}
                    >
                      <div className="avatar-capsule-box">
                        {!isLoaded && <div className="avatar-loading-skeleton" />}
                        <img
                          src={itemSrc}
                          alt=""
                          className={`avatar-box-image ${isLoaded ? 'ready' : 'loading'}`}
                          onLoad={() => handleImageLoaded(itemSrc)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="onboarding-avatar-description">
              Рад знакомству, {nickname.trim() || 'друг'}! Теперь выбери себе крутецкую аватарку
            </p>

            <button
              type="button"
              className="ios-glass-btn green-accent-btn onboarding-finish-btn"
              onClick={handleFinishOnboarding}
            >
              Хочу эту
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default App;
