import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockProfiles, mockRules, mockSiteOverrides, mockSchedules, mockDevices } from '@guardian/shared/mock';
import { CATEGORIES, PROFILE_TYPE_META } from '@guardian/shared/constants';

const ACTION = {
  allow: { label: 'İzinli', color: '#10B981', bg: '#10B98115' },
  block: { label: 'Engelli', color: '#EF4444', bg: '#EF444415' },
  limit: { label: 'Sınırlı', color: '#F59E0B', bg: '#F59E0B15' },
} as const;

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const profile = mockProfiles.find((p) => p.id === id) ?? mockProfiles[0];
  const meta = PROFILE_TYPE_META[profile.type];
  const rules = mockRules[profile.id] ?? [];
  const overrides = mockSiteOverrides[profile.id] ?? [];
  const schedules = mockSchedules[profile.id] ?? [];
  const devices = mockDevices.filter((d) => d.profileId === profile.id);
  const ruleMap = Object.fromEntries(rules.map((r) => [r.category, r]));

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#F9FAFB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{profile.name}</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push(`/(tabs)/profile/${profile.id}/edit`)}
        >
          <Ionicons name="pencil-outline" size={18} color="#818CF8" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile hero */}
        <View style={styles.heroCard}>
          <View style={[styles.avatar, { backgroundColor: profile.avatarColor + '22', borderColor: profile.avatarColor + '55' }]}>
            <Text style={{ fontSize: 36 }}>{profile.avatarEmoji}</Text>
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{profile.name}</Text>
            <Text style={styles.heroType}>{meta.label} — {meta.description}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: profile.isActive ? '#10B98118' : '#6B728018' }]}>
            <View style={[styles.statusDot, { backgroundColor: profile.isActive ? '#10B981' : '#6B7280' }]} />
            <Text style={[styles.statusText, { color: profile.isActive ? '#10B981' : '#6B7280' }]}>
              {profile.isActive ? 'Aktif' : 'Pasif'}
            </Text>
          </View>
        </View>

        {/* Devices */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="phone-portrait-outline" size={15} color="#22D3EE" />
            <Text style={styles.sectionTitle}>Bağlı Cihazlar ({devices.length})</Text>
          </View>
          {devices.length === 0 ? (
            <Text style={styles.emptyText}>Henüz cihaz yok</Text>
          ) : (
            devices.map((dev) => (
              <View key={dev.id} style={styles.deviceRow}>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{dev.deviceName}</Text>
                  <Text style={styles.deviceMeta}>{dev.platform} · {dev.osVersion}</Text>
                </View>
                <View style={[styles.onlineBadge, { backgroundColor: dev.isOnline ? '#10B98118' : '#6B728018' }]}>
                  <Text style={{ fontSize: 10, color: dev.isOnline ? '#10B981' : '#6B7280', fontWeight: '500' }}>
                    {dev.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Content rules */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark-outline" size={15} color="#6366F1" />
            <Text style={styles.sectionTitle}>İçerik Kuralları</Text>
          </View>
          {CATEGORIES.map((cat) => {
            const rule = ruleMap[cat.id];
            const action = rule?.action ?? 'allow';
            const cfg = ACTION[action];
            return (
              <View key={cat.id} style={styles.ruleRow}>
                <View style={[styles.catIcon, { backgroundColor: cat.color + '20' }]}>
                  <Ionicons name="ellipse" size={8} color={cat.color} />
                </View>
                <Text style={styles.catLabel}>{cat.label}</Text>
                {rule?.dailyLimitMinutes && (
                  <Text style={styles.limitText}>{rule.dailyLimitMinutes}dk/gün</Text>
                )}
                <View style={[styles.actionBadge, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.actionText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Schedules */}
        {schedules.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time-outline" size={15} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Zaman Programları</Text>
            </View>
            {schedules.map((sch) => (
              <View key={sch.id} style={styles.scheduleCard}>
                <View style={styles.scheduleTop}>
                  <Text style={styles.scheduleLabel}>{sch.label}</Text>
                  <Text style={styles.scheduleTime}>{sch.startTime}–{sch.endTime}</Text>
                </View>
                <View style={styles.scheduleDays}>
                  {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, i) => {
                    const dayNum = i === 6 ? 0 : i + 1;
                    const active = sch.days.includes(dayNum);
                    return (
                      <View key={day} style={[styles.dayChip, active && styles.dayChipActive]}>
                        <Text style={[styles.dayText, active && styles.dayTextActive]}>{day}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Site overrides */}
        {overrides.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="globe-outline" size={15} color="#22C55E" />
              <Text style={styles.sectionTitle}>Site Özel Kurallar</Text>
            </View>
            {overrides.map((o) => {
              const cfg = ACTION[o.action];
              return (
                <View key={o.id} style={styles.overrideRow}>
                  <Text style={styles.overrideUrl}>{o.url}</Text>
                  <View style={[styles.actionBadge, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.actionText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Edit rules CTA */}
        <TouchableOpacity
          style={styles.editRulesBtn}
          onPress={() => router.push(`/(tabs)/profile/${profile.id}/edit`)}
        >
          <Ionicons name="pencil-outline" size={16} color="#fff" />
          <Text style={styles.editRulesBtnText}>Kuralları Düzenle</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F23' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2D2D5A',
  },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#F9FAFB', flex: 1, textAlign: 'center' },
  editBtn: {
    width: 34, height: 34, borderRadius: 9,
    backgroundColor: '#6366F115', alignItems: 'center', justifyContent: 'center',
  },
  scroll: { padding: 20, gap: 20, paddingBottom: 60 },
  heroCard: {
    backgroundColor: '#1E1E3F', borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: '#2D2D5A', alignItems: 'center', gap: 10,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 22,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  heroInfo: { alignItems: 'center', gap: 4 },
  heroName: { fontSize: 20, fontWeight: '700', color: '#F9FAFB' },
  heroType: { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 3.5 },
  statusText: { fontSize: 13, fontWeight: '500' },
  section: { gap: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#F9FAFB' },
  emptyText: { fontSize: 13, color: '#6B7280', fontStyle: 'italic' },
  deviceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1E1E3F', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#2D2D5A',
  },
  deviceInfo: { gap: 2 },
  deviceName: { fontSize: 14, fontWeight: '500', color: '#F9FAFB' },
  deviceMeta: { fontSize: 11, color: '#9CA3AF', textTransform: 'capitalize' },
  onlineBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  ruleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#1E1E3F', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#2D2D5A',
  },
  catIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  catLabel: { flex: 1, fontSize: 13, color: '#D1D5DB' },
  limitText: { fontSize: 11, color: '#9CA3AF' },
  actionBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  actionText: { fontSize: 11, fontWeight: '600' },
  scheduleCard: {
    backgroundColor: '#1E1E3F', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#2D2D5A', gap: 10,
  },
  scheduleTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scheduleLabel: { fontSize: 14, fontWeight: '500', color: '#F9FAFB' },
  scheduleTime: { fontSize: 13, color: '#9CA3AF' },
  scheduleDays: { flexDirection: 'row', gap: 4 },
  dayChip: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3, backgroundColor: '#2D2D5A' },
  dayChipActive: { backgroundColor: '#6366F130' },
  dayText: { fontSize: 10, color: '#6B7280', fontWeight: '500' },
  dayTextActive: { color: '#818CF8' },
  overrideRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1E1E3F', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#2D2D5A',
  },
  overrideUrl: { fontSize: 13, fontFamily: 'monospace', color: '#D1D5DB', flex: 1 },
  editRulesBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#6366F1', borderRadius: 16, paddingVertical: 15, marginTop: 4,
  },
  editRulesBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
