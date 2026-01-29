import { useEffect, useState } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <Check size={18} className="text-green-400" />,
        error: <AlertCircle size={18} className="text-red-400" />,
        info: <Info size={18} className="text-blue-400" />
    };

    const bgColors = {
        success: 'bg-slate-900/90 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]',
        error: 'bg-slate-900/90 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
        info: 'bg-slate-900/90 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
    };

    return (
        <div className={twMerge(
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-300 transform",
            bgColors[type],
            isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
        )}>
            {icons[type]}
            <p className="text-sm font-medium text-slate-200">{message}</p>
            <button onClick={() => setIsVisible(false)} className="ml-2 hover:bg-white/10 p-1 rounded-full transition-colors">
                <X size={14} className="text-slate-400" />
            </button>
        </div>
    );
};

// Simple global toast manager hook (for larger apps, use context)
export const useToast = () => {
    const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);

    const showToast = (message: string, type: ToastType = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => setToast(null);

    return { toast, showToast, hideToast };
};
