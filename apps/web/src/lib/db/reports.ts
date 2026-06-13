import { createClient } from '@/lib/supabase/server';

export async function getWeeklyReport() {
  const supabase = await createClient();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: logs, error } = await supabase
    .from('access_logs')
    .select('action, category, created_at')
    .gte('created_at', sevenDaysAgo.toISOString());

  if (error) throw error;

  const totalRequests = logs?.length ?? 0;
  const blocked = logs?.filter((l) => l.action === 'blocked').length ?? 0;
  const allowed = totalRequests - blocked;

  const dailyMap: Record<string, { allowed: number; blocked: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-US', { weekday: 'short' });
    dailyMap[key] = { allowed: 0, blocked: 0 };
  }

  logs?.forEach((log) => {
    const key = new Date(log.created_at).toLocaleDateString('en-US', { weekday: 'short' });
    if (dailyMap[key]) {
      if (log.action === 'blocked') dailyMap[key].blocked++;
      else dailyMap[key].allowed++;
    }
  });

  const categoryMap: Record<string, number> = {};
  logs?.forEach((log) => {
    if (log.category) {
      categoryMap[log.category] = (categoryMap[log.category] ?? 0) + 1;
    }
  });

  return {
    totalRequests,
    blocked,
    allowed,
    dailyData: Object.entries(dailyMap).map(([day, counts]) => ({ day, ...counts })),
    categoryBreakdown: Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([category, count]) => ({ category, count, pct: Math.round((count / totalRequests) * 100) })),
  };
}
