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

  const [roomCode] = useState(generateRandomCode);
  const [isPublic, setIsPublic] = useState(false);
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleStartGame = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([20, 40, 20]);
    }
  };

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }
    navigator.clipboard.writeText(roomCode).then(() => {
      setIsCodeCopied(true);
      setTimeout(() => setIsCodeCopied(false), 2200);
    });
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }
    navigator.clipboard.writeText(`https://craig.app/r/${roomCode}`).then(() => {
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2200);
    });
  };

  const handleTogglePublic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(15);
    }
    setIsPublic((prev) => !prev);
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

        <div className="room-misc-wrapper">
          <div className="room-misc-card">
            <div className="room-misc-row filled">
              <span className="room-misc-title">Публичная комната</span>
              <button
                type="button"
                className={`ios-switch-btn ${isPublic ? 'active' : ''}`}
                onClick={handleTogglePublic}
                aria-label="Включить публичную комнату"
              >
                <span className="ios-switch-thumb" />
              </button>
            </div>

            <div className="room-misc-row transparent">
              <span className="room-misc-title">Код комнаты</span>
              <span
                className={`room-plain-value ${isCodeCopied ? 'copied' : ''}`}
                onClick={handleCopyCode}
              >
                {isCodeCopied ? 'Скопирован!' : roomCode}
              </span>
            </div>

            <div className="room-misc-row filled">
              <span className="room-misc-title">Ссылочка</span>
              <span
                className={`room-plain-value ${isLinkCopied ? 'copied' : ''}`}
                onClick={handleCopyLink}
              >
                {isLinkCopied ? 'Скопировано!' : 'craig...'}
              </span>
            </div>
          </div>

          <p className="room-misc-subhint">
            {isPublic ? (
              'Теперь комната видна всем игрокам'
            ) : (
              <>
                Сейчас в комнату можно попасть только{' '}
                <span className="accent-highlight">по ссылке</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="create-room-bottom-actions">
        <button
          type="button"
          className="ios-glass-btn green-accent-btn"
          onClick={handleStartGame}
        >
          Начать игру
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
