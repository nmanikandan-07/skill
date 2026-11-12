import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let icon = <CheckCircle2 className="w-5 h-5 text-[#087F5B] shrink-0" />;
        let borderClass = 'border-[#A7F3D0] bg-[#F0FDF4]';
        
        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0" />;
          borderClass = 'border-[#FECACA] bg-[#FEF2F2]';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-[#4F46E5] shrink-0" />;
          borderClass = 'border-[#C7D2FE] bg-[#EEF2FF]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-card transition-all transform translate-y-0 opacity-100 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 text-[13.5px] font-medium text-[#10213A] leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#8992AA] hover:text-[#10213A] p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
