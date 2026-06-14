'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Moon, Briefcase, GraduationCap, Plus, Check } from 'lucide-react';

interface Template {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  schedule: {
    label: string;
    start_time: string;
    end_time: string;
    days: string[];
    action: 'block_all' | 'allow_all';
  };
}

const TEMPLATES: Template[] = [
  {
    id: 'school',
    label: 'School Hours',
    description: 'Mon–Fri, 8am–3pm — block all internet during school',
    icon: <BookOpen className="h-4 w-4" />,
    color: '#0EA5E9',
    schedule: {
      label: 'School Hours',
      start_time: '08:00',
      end_time: '15:00',
      days: ['mon', 'tue', 'wed', 'thu', 'fri'],
      action: 'block_all',
    },
  },
  {
    id: 'bedtime',
    label: 'Bedtime',
    description: 'Every day, 9pm–7am — no internet after bedtime',
    icon: <Moon className="h-4 w-4" />,
    color: '#8B5CF6',
    schedule: {
      label: 'Bedtime',
      start_time: '21:00',
      end_time: '07:00',
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      action: 'block_all',
    },
  },
  {
    id: 'homework',
    label: 'Homework Time',
    description: 'Mon–Fri, 3pm–5pm — focus time after school',
    icon: <GraduationCap className="h-4 w-4" />,
    color: '#F59E0B',
    schedule: {
      label: 'Homework Time',
      start_time: '15:00',
      end_time: '17:00',
      days: ['mon', 'tue', 'wed', 'thu', 'fri'],
      action: 'block_all',
    },
  },
  {
    id: 'work',
    label: 'Work Focus',
    description: 'Mon–Fri, 9am–5pm — block distractions during work',
    icon: <Briefcase className="h-4 w-4" />,
    color: '#22C55E',
    schedule: {
      label: 'Work Focus',
      start_time: '09:00',
      end_time: '17:00',
      days: ['mon', 'tue', 'wed', 'thu', 'fri'],
      action: 'block_all',
    },
  },
];

export function ScheduleTemplates({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  async function applyTemplate(template: Template) {
    setLoading(template.id);
    const res = await fetch(`/api/profiles/${profileId}/schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template.schedule),
    });
    if (res.ok) {
      setAdded((prev) => new Set([...prev, template.id]));
      router.refresh();
    }
    setLoading(null);
  }

  return (
    <div>
      <p className="text-sm text-[#64748B] mb-3">Add a preset schedule in one click:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {TEMPLATES.map((t) => {
          const isAdded = added.has(t.id);
          const isLoading = loading === t.id;
          return (
            <button
              key={t.id}
              onClick={() => !isAdded && applyTemplate(t)}
              disabled={isAdded || isLoading}
              className="flex items-start gap-3 p-3 rounded-xl border border-[#DBEAFE] bg-white hover:border-[#0EA5E9]/40 hover:bg-[#F0F9FF] transition-all text-left disabled:opacity-70 disabled:cursor-default"
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: t.color + '18', color: t.color }}
              >
                {isAdded ? <Check className="h-4 w-4" /> : t.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  {isLoading ? 'Adding...' : isAdded ? `${t.label} ✓` : t.label}
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">{t.description}</p>
              </div>
              {!isAdded && !isLoading && (
                <Plus className="h-3.5 w-3.5 text-[#94A3B8] ml-auto shrink-0 mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
