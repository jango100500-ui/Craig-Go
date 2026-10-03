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

const TOTAL_TIMER_SECONDS = 45;

export const GameScreen: React.FC = () => {
  const [countdownIndex, setCountdownIndex] = useState(0);
  const [isCounting, setIsCounting] = useState(true);
  const [powerText, setPowerText] = useState('');
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIMER_SECONDS);
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
    }, 1300);

    return () => clearTimeout(timer);
  }, [countdownIndex, isCounting]);

  useEffect(() => {
    if (isCounting) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          return 0;
        }
        return Math.max(0, parseFloat((prev - 0.1).toFixed(1)));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isCounting]);

  const currentStep = COUNTDOWN_STEPS[countdownIndex];
  const timerProgress = Math.max(0, Math.min(1, timeLeft / TOTAL_TIMER_SECONDS));
  const isVibrating = !isCounting && timeLeft <= 5 && timeLeft > 0;

  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timerProgress);

  return (
    <main className="game-screen-wrapper">
      {isCounting ? (
        <div key={countdownIndex} className="game-countdown-view">
          <span className="countdown-number-snappy">{currentStep.num}</span>
          <p className="countdown-text-snappy">{currentStep.text}</p>
        </div>
      ) : (
        <div className="game-play-view">
          <div className="game-accent-card">
            <div className="game-card-header-bar">
              <div className="game-header-info-group">
                <span className="game-counter-badge">{powerText.length}/450</span>
                <h2 className="game-instruction-title">Загадай себе суперспособность</h2>
              </div>

              <div className={`game-circular-timer-wrapper ${isVibrating ? 'vibrating-timer' : ''}`}>
                <div className="timer-outer-accent-ring">
                  <svg className="timer-progress-svg" viewBox="0 0 34 34">
                    <circle
                      cx="17"
                      cy="17"
                      r={radius}
                      className="timer-track-dimmed"
                    />
                    <circle
                      cx="17"
                      cy="17"
                      r={radius}
                      className="timer-fill-accent"
                      style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeDashoffset
                      }}
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="game-card-content-area">
              <textarea
                className="game-power-textarea"
                placeholder={placeholder}
                value={powerText}
                onChange={(e) => setPowerText(e.target.value)}
                maxLength={450}
                rows={6}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default GameScreen;
