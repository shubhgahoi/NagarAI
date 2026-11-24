import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, showToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-emerald-50/95 dark:bg-emerald-950/95 text-emerald-900 dark:text-emerald-100 shadow-emerald-500/10',
    error: 'border-rose-500/40 bg-rose-50/95 dark:bg-rose-950/95 text-rose-900 dark:text-rose-100 shadow-rose-500/10',
    warning: 'border-amber-500/40 bg-amber-50/95 dark:bg-amber-950/95 text-amber-900 dark:text-amber-100 shadow-amber-500/10',
    info: 'border-blue-500/40 bg-blue-50/95 dark:bg-blue-950/95 text-blue-900 dark:text-blue-100 shadow-blue-500/10',
  };

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-3 fade-in duration-200 pointer-events-auto">
      <div className={`flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md ${borders[toast.type]}`}>
        {icons[toast.type]}
        <div className="flex-1 text-xs md:text-sm font-semibold leading-snug">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
