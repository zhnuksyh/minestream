import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden",
            className
        )}
        {...props}
    >
        {children}
    </div>
);

export const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-1.5 p-6 pt-0", className)} {...props}>
        {children}
    </div>
);

export const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("p-6 pt-0", className)} {...props}>
        {children}
    </div>
);
