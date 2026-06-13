import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export function Card({ children, className, glass }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#1A1A2E] p-6',
        glass
          ? 'bg-white/5 backdrop-blur-md'
          : 'bg-[#111120]',
        className,
      )}
    >
      {children}
    </div>
  );
}
