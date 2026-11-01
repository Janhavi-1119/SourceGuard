import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-2xs hover:shadow-xs shadow-indigo-200/50',
    secondary:
      'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 shadow-2xs',
    ghost: 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 active:bg-slate-200',
    danger: 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100/80 active:bg-rose-200',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-sm md:text-base px-5 py-2.5 font-semibold',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
