import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'muted';
  className?: string;
}

const variantClasses = {
  default: 'bg-[#0EA5E9]/10 text-[#38BDF8] border-[#0EA5E9]/20',
  success: 'bg-[#22C55E]/10 text-[#4ADE80] border-[#22C55E]/20',
  warning: 'bg-[#F59E0B]/10 text-[#FCD34D] border-[#F59E0B]/20',
  danger: 'bg-[#EF4444]/10 text-[#F87171] border-[#EF4444]/20',
  muted: 'bg-[#475569]/10 text-[#94A3B8] border-[#475569]/20',
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
