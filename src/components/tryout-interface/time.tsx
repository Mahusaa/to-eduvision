"use client"
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import formatTime from '~/lib/format-time';

interface TryoutTimerProps {
  subtestEnd: Date | null;
  onTimeUp?: () => void;
}

export const TryoutTimer: React.FC<TryoutTimerProps> = ({
  subtestEnd,
  onTimeUp
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(5000);

  useEffect(() => {
    if (subtestEnd) {
      const tryoutEndDate = new Date(subtestEnd);
      const now = Date.now();
      const remainingMilliseconds = tryoutEndDate.getTime() - now;

      // Set initial time
      const initialTime = Math.max(0, Math.floor(remainingMilliseconds / 1000));
      setTimeLeft(initialTime);

      // Handle case where time is already up
      if (initialTime <= 0) {
        if (onTimeUp) onTimeUp(); // Call onTimeUp if time is already up
        return;
      }

      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            if (onTimeUp) onTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [subtestEnd, onTimeUp]);

  return (
    <div
      className="text-lg font-bold text-primary"
      aria-live="polite"
      role="timer"
    >
      {timeLeft == 5000 ? <Loader2 className="animate-spin w-4 h-4" /> : (formatTime(timeLeft))}
    </div>
  );
};

