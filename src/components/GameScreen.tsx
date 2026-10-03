import React, { useEffect, useState } from 'react';

const COUNTDOWN_STEPS = [
  { num: '1', text: 'Загадай суперсилу' },
  { num: '2', text: 'Крегг поменяет вас с другом ответами' },
  { num: '3', text: 'В конце получится классный коллаж!' }
];

const RANDOM_PLACEHOLDERS = [
  'Хочу летать',
  'Умею видеть через стены',
  'Управлять временем',
  'Читать мысли котиков',
  'Телепортироваться куда угодно',
  'Становиться невидимым в темноте'
];

export const GameScreen: React.FC = () => {
  const [countdownIndex, setCountdownIndex] = useState(0);
  const [isCounting, setIsCounting] = useState(true);
  const [powerText, setPowerText] = useState('');
  const [placeholder] = useState(() => {
    return RANDOM_PLACEHOLDERS[Math.floor(Math.random() * RANDOM_PLACEHOLDERS.length)];
  });

  useEffect(() => {
    if (!isCounting) return;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }

    const timer = setTimeout(() => {
      if (countdownIndex < COUNTDOWN_STEPS.length - 1) {
        setCountdownIndex((prev) => prev + 1);
      } else {
        setIsCounting(false);
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([25, 40, 25]);
        }
      }
    }, 1400);

    return () => clearTimeout(timer);
  }, [countdownIndex, isCounting]);

  const currentStep = COUNTDOWN_STEPS[countdownIndex];

  return (
    <main className="game-screen-wrapper">
      {isCounting ? (
        <div key={countdownIndex} className="game-countdown-view">
          <span className="countdown-number-jelly">{currentStep.num}</span>
          <p className="countdown-text-jelly">{currentStep.text}</p>
        </div>
      ) : (
        <div className="game-play-view">
          <div className="game-accent-card">
            <div className="game-card-badge">Загадай суперсилу</div>

            <div className="game-card-content-area">
              <textarea
                className="game-power-textarea"
                placeholder={placeholder}
                value={powerText}
                onChange={(e) => setPowerText(e.target.value)}
                maxLength={450}
                rows={5}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default GameScreen;
