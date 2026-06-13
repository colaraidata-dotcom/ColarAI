import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { mockProfiles, mockUsageReports } from '@guardian/shared/mock';
import { CATEGORY_MAP } from '@guardian/shared/constants';

export default function ReportsScreen() {
  const [selectedProfileId, setSelectedProfileId] = useState(mockProfiles[0].id);
  const report = mockUsageReports[selectedProfileId];
  const profile = mockProfiles.find((p) => p.id === selectedProfileId)!;

  const hours = Math.floor((report?.totalMinutes ?? 0) / 60);
  const mins = (report?.totalMinutes ?? 0) % 60;
  const maxMinutes = Math.max(...(report?.dailyTrend.map((d) => d.minutes) ?? [1]));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Raporlar</Text>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Profile selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.profileSelector} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {mockProfiles.filter((p) => mockUsageReports[p.id]).map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.profileChip, selectedProfileId === p.id && styles.profileChipActive]}
            onPress={() => setSelectedProfileId(p.id)}
          >
            <Text style={{ fontSize: 16 }}>{p.avatarEmoji}</Text>
            <Text style={[styles.profileChipText, selectedProfileId === p.id && { color: '#818CF8' }]}>
              {p.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll}>
        {!report ? (
          <View style={styles.empty}>
            <Ionicons name="bar-chart-outline" size={48} color="#2D2D5A" />
            <Text style={styles.emptyText}>Bu profil için rapor yok</Text>
          </View>
        ) : (
          <>
            {/* Summary cards */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{hours}s {mins}dk</Text>
                <Text style={styles.summaryLabel}>Toplam Süre</Text>
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
                  const barHeight = maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;
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
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kategori Dağılımı</Text>
              {report.categoryBreakdown.map((item) => {
                const cat = CATEGORY_MAP[item.category];
                return (
                  <View key={item.category} style={styles.categoryRow}>
                    <View style={styles.categoryLeft}>
                      <View style={[styles.categoryDot, { backgroundColor: cat?.color ?? '#6B7280' }]} />
                      <Text style={styles.categoryName}>{cat?.label ?? item.category}</Text>
                    </View>
                    <View style={styles.categoryRight}>
                      <Text style={styles.categoryTime}>
                        {Math.floor(item.minutes / 60)}s {item.minutes % 60}dk
                      </Text>
                      <Text style={styles.categoryPct}>{item.percentage}%</Text>
                    </View>
                    <View style={styles.categoryBarBg}>
                      <View style={[styles.categoryBarFill, { width: `${item.percentage}%`, backgroundColor: cat?.color ?? '#6B7280' }]} />
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Top sites */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>En Çok Ziyaret Edilen</Text>
              {report.topSites.map((site) => (
                <View key={site.domain} style={styles.siteRow}>
                  <View style={[styles.siteDomain, site.blocked && { opacity: 0.5 }]}>
                    <Ionicons name={site.blocked ? 'close-circle' : 'globe-outline'} size={14} color={site.blocked ? '#EF4444' : '#9CA3AF'} />
                    <Text style={[styles.siteUrl, site.blocked && { textDecorationLine: 'line-through', color: '#6B7280' }]}>
                      {site.domain}
                    </Text>
                    {site.blocked && <Text style={styles.blockedBadge}>Engellendi</Text>}
                  </View>
                  <Text style={styles.siteTime}>
                    {site.blocked ? `${site.visitCount} deneme` : `${Math.floor(site.minutes / 60)}s ${site.minutes % 60}dk`}
                  </Text>
                </View>
              ))}
            </View>
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
