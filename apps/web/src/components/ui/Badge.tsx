import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'muted';
  className?: string;
}

const variantClasses = {
  default: 'bg-[#0EA5E9]/10 text-[#0369A1] border-[#0EA5E9]/25',
  success: 'bg-[#22C55E]/10 text-[#15803D] border-[#22C55E]/25',
  warning: 'bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/25',
  danger: 'bg-[#EF4444]/10 text-[#B91C1C] border-[#EF4444]/25',
  muted: 'bg-[#94A3B8]/10 text-[#475569] border-[#94A3B8]/20',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
