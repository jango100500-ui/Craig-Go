import React, { useState } from 'react';
import { LottieIcon } from './LottieIcon';

const ROOM_TITLES = [
  'Йес, Комната создана!',
  'Комната готова!',
  'Юр рум'
];

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRandomCode(): string {
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return result;
}

interface CreateRoomScreenProps {
  onBack: () => void;
}

export const CreateRoomScreen: React.FC<CreateRoomScreenProps> = ({ onBack }) => {
  const [title] = useState(() => {
    return ROOM_TITLES[Math.floor(Math.random() * ROOM_TITLES.length)];
  });

  const [roomCode, setRoomCode] = useState(generateRandomCode);
  const [codeAnimKey, setCodeAnimKey] = useState(0);
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  const handleRegenerateCode = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }
    setRoomCode(generateRandomCode());
    setCodeAnimKey((prev) => prev + 1);
  };

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
    navigator.clipboard.writeText(roomCode).then(() => {
      setIsCopiedCode(true);
      setTimeout(() => setIsCopiedCode(false), 2500);
    });
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
    setIsCopiedLink(true);
    setTimeout(() => setIsCopiedLink(false), 2500);
  };

  const handleStartGame = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([20, 40, 20]);
    }
  };

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

        <div className="room-compound-card">
          <div className="room-card-top-half">
            <div className="room-card-left-group">
              <div className="room-badge-circle accent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              <div className="room-code-info">
                <span className="room-card-label">Код комнаты</span>
                <span key={codeAnimKey} className="room-code-value">
                  {roomCode.split('').map((char, i) => (
                    <span
                      key={i}
                      className="jelly-char code-char"
                      style={{ animationDelay: `${i * 45}ms` }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            <div className="room-card-actions">
              <button
                type="button"
                className={`room-copy-pill ${isCopiedCode ? 'copied' : ''}`}
                onClick={handleCopyCode}
              >
                {isCopiedCode ? 'Скопирован!' : 'Скопировать'}
              </button>

              <button
                type="button"
                className="room-regen-circle-btn"
                onClick={handleRegenerateCode}
                aria-label="Сгенерировать новый код"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              </button>
            </div>
          </div>

          <div className="room-card-bottom-half">
            <div className="room-card-left-group">
              <div className="room-badge-circle muted">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>

              <div className="room-code-info">
                <span className="room-card-label link-title">Ссылочка</span>
              </div>
            </div>

            <button
              type="button"
              className={`room-copy-pill ${isCopiedLink ? 'copied' : ''}`}
              onClick={handleCopyLink}
            >
              {isCopiedLink ? 'Скопировано!' : 'Скопировать'}
            </button>
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
