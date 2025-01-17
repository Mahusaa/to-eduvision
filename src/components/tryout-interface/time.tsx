"use client"
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import formatTime from '~/lib/format-time';

interface TryoutTimerProps {
  subtestEnd: Date | null;
  onTimeUp?: () => void;
  onSave?: () => void;
}

export const TryoutTimer: React.FC<TryoutTimerProps> = ({
  subtestEnd,
  onTimeUp,
  onSave,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(5000);
  const [isTwoMinuteSaveTriggered, setTwoMinuteSaveTriggered] = useState<boolean>(false);
  const [isOneMinuteSaveTriggered, setOneMinuteSaveTriggered] = useState<boolean>(false);
  const [isTenSecondSaveTriggered, setTenSecondSaveTriggered] = useState<boolean>(false);

  useEffect(() => {
    if (subtestEnd) {
      const tryoutEndDate = new Date(subtestEnd);
      const now = Date.now();
      const remainingMilliseconds = tryoutEndDate.getTime() - now;

      // Set initial time
      const initialTime = Math.max(0, Math.floor(remainingMilliseconds / 1000));
      setTimeLeft(initialTime);

      if (initialTime <= 0) {
        if (onTimeUp) onTimeUp(); // Call onTimeUp if time is already up
        return;
      }

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            if (onTimeUp) onTimeUp();
            return 0;
          }
          // Trigger onSave 2 minutes before time is up
          if (prevTime === 120 && !isTwoMinuteSaveTriggered) {
            if (onSave) onSave();
            setTwoMinuteSaveTriggered(true);
          }

          // Trigger onSave 1 minute before time is up
          if (prevTime === 60 && !isOneMinuteSaveTriggered) {
            if (onSave) onSave();
            setOneMinuteSaveTriggered(true);
          }
          // Trigger onSave 1 minute before time is up
          if (prevTime === 10 && !isTenSecondSaveTriggered) {
            if (onSave) onSave();
            setTenSecondSaveTriggered(true);
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [subtestEnd, onTimeUp, onSave, isTwoMinuteSaveTriggered, isOneMinuteSaveTriggered, isTenSecondSaveTriggered]);

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

