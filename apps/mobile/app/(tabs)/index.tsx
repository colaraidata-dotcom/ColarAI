import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  mockProfiles, mockNotifications, mockAccessRequests, mockDevices,
} from '@guardian/shared/mock';

export default function HomeScreen() {
  const router = useRouter();
  const primaryProfile = mockProfiles[0];
  const pendingRequests = mockAccessRequests.filter((r) => r.status === 'pending');
  const unread = mockNotifications.filter((n) => !n.read);
  const onlineDevices = mockDevices.filter((d) => d.isOnline);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Merhaba, Ali 👋</Text>
            <Text style={styles.date}>Pazartesi, 2 Haziran 2026</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => router.push('/(tabs)/notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color="#D1D5DB" />
            {unread.length > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Profil', value: mockProfiles.length, icon: 'people', color: '#6366F1' },
            { label: 'Çevrimiçi Cihaz', value: onlineDevices.length, icon: 'phone-portrait', color: '#10B981' },
            { label: 'Bugün Engellendi', value: 23, icon: 'close-circle', color: '#EF4444' },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '20' }]}>
                <Ionicons name={s.icon as keyof typeof Ionicons.glyphMap} size={16} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Pending override requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bekleyen İstekler</Text>
            {pendingRequests.map((req) => (
              <TouchableOpacity
                key={req.id}
                style={styles.requestCard}
                onPress={() => router.push(`/(tabs)/override/${req.id}`)}
              >
                <View style={styles.requestLeft}>
                  <View style={styles.requestEmoji}>
                    <Text style={{ fontSize: 20 }}>{req.profileEmoji}</Text>
                  </View>
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestName}>{req.profileName}</Text>
                    <Text style={styles.requestSite}>{req.siteName}</Text>
                    {req.note && <Text style={styles.requestNote}>{req.note}</Text>}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Profiles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profiller</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profiles')}>
              <Text style={styles.seeAll}>Tümünü gör</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.profileScroll}>
            {mockProfiles.map((p) => {
              const pDevices = mockDevices.filter((d) => d.profileId === p.id);
              const online = pDevices.filter((d) => d.isOnline).length;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={styles.profileCard}
                  onPress={() => router.push(`/(tabs)/profile/${p.id}/index`)}
                >
                  <View
                    style={[styles.profileAvatar, {
                      backgroundColor: p.avatarColor + '22',
                      borderColor: p.avatarColor + '55',
                    }]}
                  >
                    <Text style={{ fontSize: 24 }}>{p.avatarEmoji}</Text>
                  </View>
                  <Text style={styles.profileName}>{p.name}</Text>
                  <Text style={styles.profileDevices}>{online}/{pDevices.length} cihaz</Text>
                  <View style={[styles.profileStatus, { backgroundColor: p.isActive ? '#10B98115' : '#6B728015' }]}>
                    <View style={[styles.profileDot, { backgroundColor: p.isActive ? '#10B981' : '#6B7280' }]} />
                    <Text style={[styles.profileStatusText, { color: p.isActive ? '#10B981' : '#6B7280' }]}>
                      {p.isActive ? 'Aktif' : 'Pasif'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Recent notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Son Bildirimler</Text>
          {mockNotifications.slice(0, 3).map((notif) => (
            <View key={notif.id} style={[styles.notifItem, !notif.read && styles.notifItemUnread]}>
              <View style={styles.notifIcon}>
                <Ionicons
                  name={notif.type === 'access_request' ? 'time' : notif.type === 'tamper_attempt' ? 'warning' : 'notifications'}
                  size={16}
                  color={notif.type === 'tamper_attempt' ? '#EF4444' : '#6366F1'}
                />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>{notif.title}</Text>
                <Text style={styles.notifBody}>{notif.body}</Text>
              </View>
              {!notif.read && <View style={styles.unreadDot} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F23' },
  scroll: { padding: 20, gap: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontSize: 22, fontWeight: '700', color: '#F9FAFB' },
  date: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
  notifBtn: { position: 'relative', padding: 6 },
  notifDot: {
    position: 'absolute', top: 6, right: 6,
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444',
  },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, backgroundColor: '#1E1E3F', borderRadius: 16,
    borderWidth: 1, borderColor: '#2D2D5A',
    padding: 14, alignItems: 'center', gap: 6,
  },
  statIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', color: '#F9FAFB' },
  statLabel: { fontSize: 10, color: '#9CA3AF', textAlign: 'center' },
  section: { gap: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: '#F9FAFB' },
  seeAll: { fontSize: 13, color: '#818CF8' },
  requestCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1E1E3F', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: '#F59E0B30',
  },
  requestLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  requestEmoji: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#F59E0B15', alignItems: 'center', justifyContent: 'center',
  },
  requestInfo: { flex: 1 },
  requestName: { fontSize: 14, fontWeight: '600', color: '#F9FAFB' },
  requestSite: { fontSize: 13, color: '#9CA3AF' },
  requestNote: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  profileScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  profileCard: {
    backgroundColor: '#1E1E3F', borderRadius: 20,
    borderWidth: 1, borderColor: '#2D2D5A',
    padding: 16, marginRight: 12, width: 130, alignItems: 'center', gap: 8,
  },
  profileAvatar: {
    width: 56, height: 56, borderRadius: 18,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  profileName: { fontSize: 14, fontWeight: '600', color: '#F9FAFB' },
  profileDevices: { fontSize: 11, color: '#9CA3AF' },
  profileStatus: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  profileDot: { width: 6, height: 6, borderRadius: 3 },
  profileStatusText: { fontSize: 11, fontWeight: '500' },
  notifItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#1E1E3F', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#2D2D5A',
  },
  notifItemUnread: { borderColor: '#6366F130', backgroundColor: '#6366F108' },
  notifIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: '#6366F115', alignItems: 'center', justifyContent: 'center',
  },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '600', color: '#F9FAFB' },
  notifBody: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6366F1', marginTop: 4 },
});
