import React, { useEffect, useState } from 'react';

const COUNTDOWN_STEPS = [
  { num: '1', text: 'Загадай суперсилу' },
  { num: '2', text: 'Крегг поменяет вас с другом ответами' },
  { num: '3', text: 'В конце получится классный коллаж!' }
];

const POWER_PLACEHOLDERS = [
  'Хочу летать',
  'Умею видеть через стены',
  'Управлять временем',
  'Читать мысли котиков',
  'Телепортироваться куда угодно',
  'Становиться невидимым в темноте'
];

const DEBUFF_PLACEHOLDERS = [
  'Но только когда спишь',
  'Но при этом громко хрюкаешь',
  'Но только на 10 секунд',
  'Но каждый раз забываешь своё имя',
  'Но одежда остаётся на месте'
];

const TOTAL_TIMER_SECONDS = 45;

export const GameScreen: React.FC = () => {
  const [countdownIndex, setCountdownIndex] = useState(0);
  const [isCounting, setIsCounting] = useState(true);

  const [phase, setPhase] = useState<'power' | 'debuff'>('power');
  const [powerText, setPowerText] = useState('');
  const [debuffText, setDebuffText] = useState('');
  const [submittedPower, setSubmittedPower] = useState('');

  const [isReady, setIsReady] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIMER_SECONDS);
  const [powerPlaceholder] = useState(() => {
    return POWER_PLACEHOLDERS[Math.floor(Math.random() * POWER_PLACEHOLDERS.length)];
  });
  const [debuffPlaceholder, setDebuffPlaceholder] = useState(() => {
    return DEBUFF_PLACEHOLDERS[Math.floor(Math.random() * DEBUFF_PLACEHOLDERS.length)];
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
          triggerPhaseTransition();
          return 0;
        }
        return Math.max(0, parseFloat((prev - 0.1).toFixed(1)));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isCounting, phase]);

  const triggerPhaseTransition = () => {
    setIsFlipping(true);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }

    setTimeout(() => {
      if (phase === 'power') {
        setSubmittedPower(powerText.trim() || powerPlaceholder);
        setPhase('debuff');
        setDebuffPlaceholder(
          DEBUFF_PLACEHOLDERS[Math.floor(Math.random() * DEBUFF_PLACEHOLDERS.length)]
        );
      } else {
        setPhase('power');
        setPowerText('');
        setDebuffText('');
      }
      setIsReady(false);
      setTimeLeft(TOTAL_TIMER_SECONDS);
      setIsFlipping(false);
    }, 450);
  };

  const handleReadyClick = () => {
    if (isReady || isFlipping) return;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }

    setIsReady(true);

    setTimeout(() => {
      triggerPhaseTransition();
    }, 1100);
  };

  const currentStep = COUNTDOWN_STEPS[countdownIndex];
  const timerProgress = Math.max(0, Math.min(1, timeLeft / TOTAL_TIMER_SECONDS));
  const isVibrating = !isCounting && timeLeft <= 5 && timeLeft > 0;
  const isOrange = phase === 'debuff';

  const accentColor = isOrange ? '#FF9202' : '#87D50C';
  const dimmedColor = isOrange ? 'rgba(255, 146, 2, 0.18)' : 'rgba(135, 213, 12, 0.18)';

  return (
    <main className="game-screen-wrapper">
      {isCounting ? (
        <div key={countdownIndex} className="game-countdown-view">
          <span className="countdown-number-snappy">{currentStep.num}</span>
          <p className="countdown-text-snappy">{currentStep.text}</p>
        </div>
      ) : (
        <div className={`game-play-view ${isOrange ? 'theme-orange' : 'theme-green'}`}>
          <div className="game-top-bar">
            <div className="game-header-info-group">
              <span className="game-counter-badge">{phase === 'power' ? '1/2' : '2/2'}</span>
              <h2 className="game-instruction-title">
                {phase === 'power' ? 'Загадай себе суперспособность' : 'Загадай дебафф'}
              </h2>
            </div>

            <div className={`game-circular-timer-wrapper ${isVibrating ? 'vibrating-timer' : ''}`}>
              <div
                className="timer-outer-accent-ring"
                style={{ borderColor: accentColor }}
              >
                <div
                  className="timer-filled-disc"
                  style={{
                    background: `conic-gradient(${accentColor} ${timerProgress * 360}deg, ${dimmedColor} 0deg)`
                  }}
                />
              </div>
            </div>
          </div>

          <div className={`game-cards-3d-stage ${isFlipping ? 'flipped' : ''}`}>
            {phase === 'power' ? (
              <div className="game-accent-card power-card">
                <div className="game-card-content-area">
                  <textarea
                    className="game-power-textarea"
                    placeholder={powerPlaceholder}
                    value={powerText}
                    onChange={(e) => setPowerText(e.target.value)}
                    maxLength={450}
                    rows={6}
                  />
                </div>
              </div>
            ) : (
              <div className="game-dual-cards-stack">
                <div className="game-friend-card">
                  <span className="game-friend-badge">Способность друга</span>
                  <div className="game-friend-text-scroll">
                    <p className="game-friend-text-content">{submittedPower}</p>
                  </div>
                </div>

                <div className="game-accent-card debuff-card">
                  <div className="game-card-content-area compact">
                    <textarea
                      className="game-power-textarea"
                      placeholder={debuffPlaceholder}
                      value={debuffText}
                      onChange={(e) => setDebuffText(e.target.value)}
                      maxLength={450}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="game-bottom-action-bar">
            <button
              type="button"
              className={`game-ready-btn ${isReady ? 'ready-orange-active' : ''}`}
              onClick={handleReadyClick}
              disabled={isReady || isFlipping}
            >
              <span className="game-ready-btn-sweep-border" />
              <span className="game-ready-btn-text">Я всё!</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default GameScreen;
