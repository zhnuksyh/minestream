import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-transparent',
            secondary: 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700 hover:border-slate-600',
            danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 border-transparent',
            ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white border-transparent',
            outline: 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white',
        };

        const sizes = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 py-2',
            lg: 'h-12 px-6 text-lg',
            icon: 'h-10 w-10 p-2 flex items-center justify-center',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-bold transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] border',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';
