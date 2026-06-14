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
        'rounded-2xl border border-[#DBEAFE] p-6',
        glass
          ? 'bg-white/80 backdrop-blur-md'
          : 'bg-white',
        className,
      )}
    >
      {children}
    </div>
  );
}
