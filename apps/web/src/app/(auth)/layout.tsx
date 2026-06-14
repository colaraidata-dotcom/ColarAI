import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F8FF] flex flex-col">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #BFDBFE 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        opacity: 0.4,
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#0EA5E9]/8 blur-[120px] rounded-full pointer-events-none" />

      <header className="relative z-10 px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <div className="h-8 w-8 rounded-lg bg-[#0EA5E9] flex items-center justify-center">
            <Shield className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-[#0F172A] font-semibold text-lg">Guardian</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        {children}
      </main>
    </div>
  );
}
