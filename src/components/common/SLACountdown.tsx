import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SLACountdownProps {
  deadline: string;
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  createdAt?: string;
}

export const SLACountdown: React.FC<SLACountdownProps> = ({
  deadline,
  status,
  size = 'md',
  showProgress = false,
  createdAt,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isOverdue: boolean;
    totalRemainingMs: number;
  }>({ hours: 0, minutes: 0, seconds: 0, isOverdue: false, totalRemainingMs: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const target = new Date(deadline).getTime();
      const diff = target - now;

      if (diff <= 0) {
        const overdueMs = Math.abs(diff);
        const hours = Math.floor(overdueMs / (1000 * 60 * 60));
        const minutes = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((overdueMs % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isOverdue: true, totalRemainingMs: diff });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isOverdue: false, totalRemainingMs: diff });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (status === 'Resolved' || status === 'Citizen Verified') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Resolved Within SLA</span>
      </div>
    );
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Compute progress percentage if createdAt provided
  let progressPercent = 50;
  if (createdAt) {
    const start = new Date(createdAt).getTime();
    const end = new Date(deadline).getTime();
    const now = Date.now();
    const total = end - start;
    if (total > 0) {
      const elapsed = now - start;
      progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
    }
  }

  const isDueSoon = !timeLeft.isOverdue && timeLeft.hours < 4;

  const badgeBg = timeLeft.isOverdue
    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'
    : isDueSoon
    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';

  return (
    <div className="space-y-1 inline-block">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono font-bold text-xs ${badgeBg}`}
      >
        {timeLeft.isOverdue ? (
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
        ) : (
          <Clock className={`w-3.5 h-3.5 ${isDueSoon ? 'text-amber-500 animate-spin' : 'text-blue-600'}`} />
        )}

        <span>
          {timeLeft.isOverdue ? '-' : ''}
          {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
        </span>

        {timeLeft.isOverdue && (
          <span className="text-[10px] uppercase font-sans font-black bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-1.5 py-0.2 rounded ml-1">
            Breached
          </span>
        )}
        {isDueSoon && (
          <span className="text-[10px] uppercase font-sans font-black bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-1.5 py-0.2 rounded ml-1">
            Due Soon
          </span>
        )}
      </div>

      {showProgress && (
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              timeLeft.isOverdue
                ? 'bg-rose-500'
                : isDueSoon
                ? 'bg-amber-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${timeLeft.isOverdue ? 100 : progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};
