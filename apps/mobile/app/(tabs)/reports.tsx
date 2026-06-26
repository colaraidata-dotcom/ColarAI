import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { useProfilesStore } from '../../store/profiles';
import { CATEGORY_MAP } from '@guardian/shared/constants';

interface DailyTrend {
  date: string;
  count: number;
}

interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

interface DomainStat {
  domain: string;
  blocked: boolean;
  visitCount: number;
}

interface ReportData {
  blockedCount: number;
  allowedCount: number;
  dailyTrend: DailyTrend[];
  categoryBreakdown: CategoryStat[];
  topDomains: DomainStat[];
}

export default function ReportsScreen() {
  const { user } = useAuthStore();
  const { profiles, fetch: fetchProfiles } = useProfilesStore();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  useEffect(() => {
    if (profiles.length > 0 && !selectedProfileId) {
      setSelectedProfileId(profiles[0].id);
    }
  }, [profiles, selectedProfileId]);

  const loadReport = useCallback(async () => {
    if (!selectedProfileId || !user) return;
    setIsLoading(true);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: logs, error } = await supabase
      .from('access_logs')
      .select('action, category, domain, created_at')
      .eq('profile_id', selectedProfileId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error || !logs) {
      setIsLoading(false);
      setReport(null);
      return;
    }

    const blockedCount = logs.filter((l) => l.action === 'blocked').length;
    const allowedCount = logs.length - blockedCount;

    // günlük trend (son 7 gün)
    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().slice(0, 10)] = 0;
    }
    logs.forEach((l) => {
      const day = l.created_at.slice(0, 10);
      if (day in dailyMap) dailyMap[day]++;
    });
    const dailyTrend: DailyTrend[] = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

    // kategori dağılımı
    const catMap: Record<string, number> = {};
    logs.forEach((l) => {
      if (l.category) catMap[l.category] = (catMap[l.category] ?? 0) + 1;
    });
    const total = logs.length || 1;
    const categoryBreakdown: CategoryStat[] = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([category, count]) => ({ category, count, percentage: Math.round((count / total) * 100) }));

    // en çok erişilen domain'ler
    const domainMap: Record<string, { count: number; hasBlocked: boolean }> = {};
    logs.forEach((l) => {
      if (!l.domain) return;
      if (!domainMap[l.domain]) domainMap[l.domain] = { count: 0, hasBlocked: false };
      domainMap[l.domain].count++;
      if (l.action === 'blocked') domainMap[l.domain].hasBlocked = true;
    });
    const topDomains: DomainStat[] = Object.entries(domainMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([domain, { count, hasBlocked }]) => ({ domain, blocked: hasBlocked, visitCount: count }));

    setReport({ blockedCount, allowedCount, dailyTrend, categoryBreakdown, topDomains });
    setIsLoading(false);
  }, [selectedProfileId, user]);

  useEffect(() => { loadReport(); }, [loadReport]);

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);
  const maxCount = Math.max(...(report?.dailyTrend.map((d) => d.count) ?? [1]), 1);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Raporlar</Text>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Profile selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.profileSelector}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {profiles.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.profileChip, selectedProfileId === p.id && styles.profileChipActive]}
            onPress={() => setSelectedProfileId(p.id)}
          >
            <Text style={{ fontSize: 16 }}>{p.avatar_emoji}</Text>
            <Text style={[styles.profileChipText, selectedProfileId === p.id && { color: '#818CF8' }]}>
              {p.display_name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        ) : !report ? (
          <View style={styles.empty}>
            <Ionicons name="bar-chart-outline" size={48} color="#2D2D5A" />
            <Text style={styles.emptyText}>Bu profil için rapor yok</Text>
          </View>
        ) : (
          <>
            {/* Summary cards */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{report.blockedCount + report.allowedCount}</Text>
                <Text style={styles.summaryLabel}>Toplam İstek</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={[styles.summaryValue, { color: '#EF4444' }]}>{report.blockedCount}</Text>
                <Text style={styles.summaryLabel}>Engellendi</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={[styles.summaryValue, { color: '#10B981' }]}>{report.allowedCount}</Text>
                <Text style={styles.summaryLabel}>İzin verildi</Text>
              </View>
            </View>

            {/* Daily trend bar chart */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Günlük Kullanım (Bu Hafta)</Text>
              <View style={styles.barChart}>
                {report.dailyTrend.map((day) => {
                  const dayLabel = new Date(day.date).toLocaleDateString('tr-TR', { weekday: 'short' });
                  const barHeight = (day.count / maxCount) * 100;
                  return (
                    <View key={day.date} style={styles.barGroup}>
                      <View style={styles.barWrapper}>
                        <View style={[styles.bar, { height: `${barHeight}%` }]} />
                      </View>
                      <Text style={styles.barLabel}>{dayLabel}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Category breakdown */}
            {report.categoryBreakdown.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Kategori Dağılımı</Text>
                {report.categoryBreakdown.map((item) => {
                  const cat = CATEGORY_MAP[item.category as keyof typeof CATEGORY_MAP];
                  return (
                    <View key={item.category} style={styles.categoryRow}>
                      <View style={styles.categoryLeft}>
                        <View style={[styles.categoryDot, { backgroundColor: (cat as any)?.color ?? '#6B7280' }]} />
                        <Text style={styles.categoryName}>{(cat as any)?.label ?? item.category}</Text>
                      </View>
                      <View style={styles.categoryRight}>
                        <Text style={styles.categoryTime}>{item.count} istek</Text>
                        <Text style={styles.categoryPct}>{item.percentage}%</Text>
                      </View>
                      <View style={styles.categoryBarBg}>
                        <View style={[styles.categoryBarFill, { width: `${item.percentage}%`, backgroundColor: (cat as any)?.color ?? '#6B7280' }]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Top domains */}
            {report.topDomains.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>En Çok Erişilen</Text>
                {report.topDomains.map((site) => (
                  <View key={site.domain} style={styles.siteRow}>
                    <View style={[styles.siteDomain, site.blocked && { opacity: 0.6 }]}>
                      <Ionicons
                        name={site.blocked ? 'close-circle' : 'globe-outline'}
                        size={14}
                        color={site.blocked ? '#EF4444' : '#9CA3AF'}
                      />
                      <Text style={[styles.siteUrl, site.blocked && { textDecorationLine: 'line-through', color: '#6B7280' }]}>
                        {site.domain}
                      </Text>
                      {site.blocked && <Text style={styles.blockedBadge}>Engellendi</Text>}
                    </View>
                    <Text style={styles.siteTime}>{site.visitCount} istek</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F23' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#F9FAFB' },
  profileSelector: { maxHeight: 56, marginBottom: 4 },
  profileChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#2D2D5A',
    backgroundColor: '#1E1E3F',
  },
  profileChipActive: { borderColor: '#6366F1', backgroundColor: '#6366F115' },
  profileChipText: { fontSize: 13, fontWeight: '500', color: '#9CA3AF' },
  scroll: { padding: 20, gap: 20, paddingBottom: 60 },
  centered: { paddingTop: 80, alignItems: 'center' },
  empty: { alignItems: 'center', gap: 12, paddingTop: 80 },
  emptyText: { fontSize: 15, color: '#6B7280' },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: {
    flex: 1, backgroundColor: '#1E1E3F', borderRadius: 14,
    borderWidth: 1, borderColor: '#2D2D5A', padding: 14, alignItems: 'center', gap: 4,
  },
  summaryValue: { fontSize: 18, fontWeight: '700', color: '#F9FAFB' },
  summaryLabel: { fontSize: 11, color: '#9CA3AF', textAlign: 'center' },
  chartCard: {
    backgroundColor: '#1E1E3F', borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: '#2D2D5A', gap: 16,
  },
  chartTitle: { fontSize: 15, fontWeight: '600', color: '#F9FAFB' },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 6 },
  barGroup: { flex: 1, alignItems: 'center', gap: 6, height: '100%' },
  barWrapper: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', backgroundColor: '#6366F1', borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 10, color: '#9CA3AF' },
  section: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#F9FAFB' },
  categoryRow: {
    backgroundColor: '#1E1E3F', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#2D2D5A', gap: 8,
  },
  categoryLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryDot: { width: 8, height: 8, borderRadius: 4 },
  categoryName: { fontSize: 14, color: '#D1D5DB', fontWeight: '500' },
  categoryRight: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoryTime: { fontSize: 13, color: '#9CA3AF' },
  categoryPct: { fontSize: 13, color: '#6B7280' },
  categoryBarBg: { height: 4, backgroundColor: '#2D2D5A', borderRadius: 2 },
  categoryBarFill: { height: 4, borderRadius: 2 },
  siteRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1E1E3F', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#2D2D5A',
  },
  siteDomain: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  siteUrl: { fontSize: 13, color: '#D1D5DB', fontFamily: 'monospace' },
  blockedBadge: { fontSize: 10, color: '#EF4444', backgroundColor: '#EF444415', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  siteTime: { fontSize: 12, color: '#9CA3AF' },
});
