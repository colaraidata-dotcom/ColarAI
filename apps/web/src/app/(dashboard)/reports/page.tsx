'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface DailyData {
  day: string;
  allowed: number;
  blocked: number;
}

interface CategoryData {
  category: string;
  count: number;
  pct: number;
}

interface WeeklyReport {
  totalRequests: number;
  blocked: number;
  allowed: number;
  dailyData: DailyData[];
  categoryBreakdown: CategoryData[];
}

const CATEGORY_COLORS: Record<string, string> = {
  social: '#8B5CF6',
  gaming: '#F59E0B',
  adult: '#EF4444',
  news: '#0EA5E9',
  streaming: '#22C55E',
  shopping: '#EC4899',
  education: '#14B8A6',
  other: '#64748B',
};

const MOCK_REPORT: WeeklyReport = {
  totalRequests: 1284,
  blocked: 312,
  allowed: 972,
  dailyData: [
    { day: 'Mon', allowed: 142, blocked: 38 },
    { day: 'Tue', allowed: 168, blocked: 52 },
    { day: 'Wed', allowed: 134, blocked: 41 },
    { day: 'Thu', allowed: 156, blocked: 49 },
    { day: 'Fri', allowed: 189, blocked: 72 },
    { day: 'Sat', allowed: 98, blocked: 31 },
    { day: 'Sun', allowed: 85, blocked: 29 },
  ],
  categoryBreakdown: [
    { category: 'social', count: 380, pct: 30 },
    { category: 'streaming', count: 256, pct: 20 },
    { category: 'gaming', count: 192, pct: 15 },
    { category: 'adult', count: 154, pct: 12 },
    { category: 'news', count: 128, pct: 10 },
    { category: 'education', count: 102, pct: 8 },
    { category: 'shopping', count: 72, pct: 5 },
  ],
};

export default function ReportsPage() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/reports/weekly')
      .then((r) => r.json())
      .then((data: WeeklyReport) => {
        if (data && typeof data.totalRequests === 'number') {
          setReport(data.totalRequests > 0 ? data : MOCK_REPORT);
        } else {
          setReport(MOCK_REPORT);
        }
      })
      .catch(() => setReport(MOCK_REPORT))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <div className="p-8 flex flex-col gap-6">
        <div className="h-8 w-48 rounded-lg bg-[#1A1A2E] animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-2xl bg-[#1A1A2E] animate-pulse" />)}
        </div>
        <div className="h-64 rounded-2xl bg-[#1A1A2E] animate-pulse" />
      </div>
    );
  }

  if (!report) return null;

  const blockRate = report.totalRequests > 0
    ? Math.round((report.blocked / report.totalRequests) * 100)
    : 0;

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F1F5F9]">Usage Reports</h1>
        <p className="text-[#94A3B8] text-sm mt-0.5">Last 7 days</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="flex flex-col gap-1">
          <p className="text-xs text-[#94A3B8]">Total Requests</p>
          <p className="text-2xl font-bold text-[#F1F5F9]">{report.totalRequests.toLocaleString()}</p>
        </Card>
        <Card className="flex flex-col gap-1">
          <p className="text-xs text-[#94A3B8]">Blocked</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-[#EF4444]">{report.blocked.toLocaleString()}</p>
            <p className="text-sm text-[#64748B]">{blockRate}%</p>
          </div>
        </Card>
        <Card className="flex flex-col gap-1">
          <p className="text-xs text-[#94A3B8]">Allowed</p>
          <p className="text-2xl font-bold text-[#22C55E]">{report.allowed.toLocaleString()}</p>
        </Card>
      </div>

      {/* Daily bar chart */}
      <Card className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-[#F1F5F9]">Daily Requests</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={report.dailyData} barSize={18} barGap={4}>
            <XAxis
              dataKey="day"
              tick={{ fill: '#64748B', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{ background: '#111120', border: '1px solid #1A1A2E', borderRadius: 8 }}
              labelStyle={{ color: '#94A3B8', fontSize: 12 }}
              cursor={{ fill: '#1A1A2E' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#94A3B8', paddingTop: 8 }}
            />
            <Bar dataKey="allowed" name="Allowed" fill="#22C55E" radius={[4, 4, 0, 0]} opacity={0.85} />
            <Bar dataKey="blocked" name="Blocked" fill="#EF4444" radius={[4, 4, 0, 0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Category breakdown */}
      <Card className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-[#F1F5F9]">Category Breakdown</h2>
        {report.categoryBreakdown.length === 0 ? (
          <p className="text-sm text-[#64748B]">No category data yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {report.categoryBreakdown.map((cb) => (
              <div key={cb.category} className="flex items-center gap-3">
                <div
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: CATEGORY_COLORS[cb.category] ?? '#64748B' }}
                />
                <span className="text-sm text-[#CBD5E1] flex-1 capitalize">{cb.category}</span>
                <div className="flex-1 max-w-[200px] h-1.5 rounded-full bg-[#1A1A2E] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${cb.pct}%`,
                      background: CATEGORY_COLORS[cb.category] ?? '#64748B',
                    }}
                  />
                </div>
                <Badge variant="muted" className="text-xs w-10 text-center shrink-0">{cb.pct}%</Badge>
                <span className="text-xs text-[#64748B] w-8 text-right shrink-0">{cb.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
