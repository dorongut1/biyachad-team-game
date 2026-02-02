import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number;
  onComplete?: () => void;
  autoStart?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  onComplete,
  autoStart = true,
  size = 'medium'
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(autoStart);
  }, [duration, autoStart]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0 && onComplete) {
        onComplete();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / duration) * 100;

  const sizeClasses = {
    small: 'text-2xl w-20',
    medium: 'text-4xl w-32',
    large: 'text-6xl w-48'
  };

  const getColor = () => {
    if (progress > 50) return 'text-emerald-400';
    if (progress > 25) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`font-mono font-bold ${sizeClasses[size]} ${getColor()} glass-card rounded-2xl p-4 text-center`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${
            progress > 50 ? 'bg-emerald-500' : progress > 25 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {timeLeft <= 10 && timeLeft > 0 && (
        <p className="text-red-400 animate-pulse font-bold">ממהרים!</p>
      )}
    </div>
  );
};

export default Timer;
