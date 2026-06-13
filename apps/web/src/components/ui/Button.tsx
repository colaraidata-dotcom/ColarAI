import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-lg shadow-[#0EA5E9]/25',
  secondary: 'bg-[#111120] hover:bg-[#1A1A2E] text-[#F1F5F9] border border-[#1A1A2E]',
  ghost: 'hover:bg-[#0D0D1A] text-[#94A3B8]',
  danger: 'bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/20',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
