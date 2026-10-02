import React, { useEffect } from 'react';
import { LottieIcon } from './components/LottieIcon';

export const App: React.FC = () => {
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

  const handlePlayOffline = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
  };

  return (
    <>
      <div className="landscape-lock-overlay">
        <h2>Пожалуйста, поверните устройство</h2>
        <p>Приложение работает только в вертикальном режиме</p>
      </div>

      <main className="screen-container">
        <div className="animation-slot">
          <LottieIcon 
            src="/Hi.json" 
            className="home-lottie-host" 
            fallbackClass="ios-skeleton-box" 
          />
        </div>

        <div className="text-group">
          <h1 className="hero-title">
            Привет! Создай комнату или сыграй с ии
          </h1>
          <p className="hero-subtitle">
            Создай комнату чтобы играть с реальным игроком или сыграй с нейросетью
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
            onClick={handlePlayOffline}
          >
            Играть оффлайн
          </button>
        </div>

        <span className="author-tagline">Создано @temkazavr</span>
      </main>
    </>
  );
};

export default App;
