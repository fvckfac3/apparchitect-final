import { type ReactNode, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center font-mono font-bold uppercase tracking-[2.5px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
    'bg-cyan text-ink hover:bg-cyan-dim active:scale-[0.98] shadow-[0_0_20px_rgba(0,229,204,0.3)] hover:shadow-[0_0_30px_rgba(0,229,204,0.5)]',
    secondary: 'bg-panel border border-border text-text-white hover:bg-surface hover:border-cyan/50',
    ghost: 'bg-transparent text-text-light hover:text-text-white hover:bg-panel/50'
  };

  const sizes = {
    sm: 'px-4 py-2 text-[11px]',
    md: 'px-6 py-3 text-[13px]',
    lg: 'px-8 py-4 text-[13px]'
  };

  return (
    <button data-ev-id="ev_4ee47fcdfc" className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
			{children}
		</button>);

}