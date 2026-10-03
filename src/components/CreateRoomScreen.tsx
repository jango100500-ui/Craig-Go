import React, { useState } from 'react';
import { LottieIcon } from './LottieIcon';

const ROOM_TITLES = [
  'Йес, Комната создана!',
  'Комната готова!',
  'Юр рум'
];

interface CreateRoomScreenProps {
  onBack: () => void;
  playerNickname: string;
  playerAvatar: string;
}

export const CreateRoomScreen: React.FC<CreateRoomScreenProps> = ({
  onBack,
  playerNickname,
  playerAvatar
}) => {
  const [title] = useState(() => {
    return ROOM_TITLES[Math.floor(Math.random() * ROOM_TITLES.length)];
  });

  const handleStartGame = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([20, 40, 20]);
    }
  };

  const displayName = playerNickname.trim() || 'Ты';

  return (
    <main className="create-room-view">
      <div className="create-room-top-content">
        <div className="create-room-sticker-slot">
          <LottieIcon 
            src="/Wait.json" 
            className="room-sticker-lottie" 
            fallbackClass="ios-skeleton-box" 
          />
        </div>

        <div className="create-room-header-block">
          <h1 className="create-room-jelly-title">
            {title.split(' ').map((word, wIdx) => (
              <span key={wIdx} className="jelly-word-wrapper">
                {word.split('').map((char, cIdx) => (
                  <span
                    key={cIdx}
                    className="jelly-char"
                    style={{ animationDelay: `${wIdx * 110 + cIdx * 30}ms` }}
                  >
                    {char}
                  </span>
                ))}
                &nbsp;
              </span>
            ))}
          </h1>

          <p className="create-room-subtitle">
            Теперь ждем, пока наберется минимум два игрока. Зови друзей!
          </p>
        </div>

        <div className="room-players-slots-row">
          <div className="room-player-slot">
            <div className="player-slot-circle active-avatar">
              <img src={playerAvatar} alt={displayName} className="slot-avatar-img" />
            </div>
            <span className="slot-player-label slot-player-active-name">{displayName}</span>
          </div>

          <div className="room-player-slot">
            <div className="player-slot-circle empty-dash">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="slot-player-label">Ожидание…</span>
          </div>

          <div className="room-player-slot">
            <div className="player-slot-circle empty-dash">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="slot-player-label">Ожидание…</span>
          </div>

          <div className="room-player-slot">
            <div className="player-slot-circle empty-dash">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="slot-player-label">Ожидание…</span>
          </div>
        </div>
      </div>

      <div className="create-room-bottom-actions">
        <button
          type="button"
          className="ios-glass-btn green-accent-btn with-icon-btn"
          onClick={handleStartGame}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>Начать игру</span>
        </button>

        <button
          type="button"
          className="ios-glass-btn"
          onClick={onBack}
        >
          Выйти
        </button>
      </div>
    </main>
  );
};

export default CreateRoomScreen;
