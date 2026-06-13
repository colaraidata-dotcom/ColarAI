import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockNotifications, mockAccessRequests } from '@guardian/shared/mock';

const notifIcon: Record<string, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
  access_request: { name: 'time-outline', color: '#F59E0B' },
  weekly_report: { name: 'bar-chart-outline', color: '#6366F1' },
  device_added: { name: 'phone-portrait-outline', color: '#10B981' },
  limit_reached: { name: 'timer-outline', color: '#8B5CF6' },
  tamper_attempt: { name: 'warning-outline', color: '#EF4444' },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const pendingRequests = mockAccessRequests.filter((r) => r.status === 'pending');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Bildirimler</Text>
        <TouchableOpacity>
          <Text style={styles.markAll}>Tümünü okundu işaretle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Bekleyen Erişim İstekleri</Text>
            {pendingRequests.map((req) => (
              <TouchableOpacity
                key={req.id}
                style={styles.requestCard}
                onPress={() => router.push(`/(tabs)/override/${req.id}`)}
              >
                <View style={styles.reqLeft}>
                  <View style={styles.reqEmoji}>
                    <Text style={{ fontSize: 22 }}>{req.profileEmoji}</Text>
                  </View>
                  <View style={styles.reqInfo}>
                    <Text style={styles.reqName}>{req.profileName}</Text>
                    <Text style={styles.reqSite}>{req.siteName} erişimi istiyor</Text>
                    {req.note && <Text style={styles.reqNote}>"{req.note}"</Text>}
                  </View>
                </View>
                <View style={styles.reqActions}>
                  <TouchableOpacity style={styles.rejectBtn}>
                    <Ionicons name="close" size={16} color="#EF4444" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.approveBtn}>
                    <Ionicons name="checkmark" size={16} color="#10B981" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tüm Bildirimler</Text>
          {mockNotifications.map((notif) => {
            const icon = notifIcon[notif.type] ?? { name: 'notifications-outline' as const, color: '#6B7280' };
            return (
              <View
                key={notif.id}
                style={[styles.notifItem, !notif.read && styles.notifUnread]}
              >
                <View style={[styles.notifIcon, { backgroundColor: icon.color + '20' }]}>
                  <Ionicons name={icon.name} size={18} color={icon.color} />
                </View>
                <View style={styles.notifContent}>
                  <Text style={[styles.notifTitle, !notif.read && { color: '#F9FAFB' }]}>
                    {notif.title}
                  </Text>
                  <Text style={styles.notifBody}>{notif.body}</Text>
                  <Text style={styles.notifTime}>
                    {new Date(notif.createdAt).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
                {!notif.read && <View style={styles.unreadDot} />}
              </View>
            );
          })}
        </View>
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
  markAll: { fontSize: 13, color: '#818CF8' },
  scroll: { padding: 20, gap: 20, paddingBottom: 40 },
  section: { gap: 10 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 },
  requestCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1E1E3F', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: '#F59E0B30',
  },
  reqLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  reqEmoji: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: '#F59E0B15', alignItems: 'center', justifyContent: 'center',
  },
  reqInfo: { flex: 1 },
  reqName: { fontSize: 14, fontWeight: '600', color: '#F9FAFB' },
  reqSite: { fontSize: 13, color: '#9CA3AF' },
  reqNote: { fontSize: 12, color: '#6B7280', fontStyle: 'italic', marginTop: 2 },
  reqActions: { flexDirection: 'row', gap: 8 },
  rejectBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#EF444415', alignItems: 'center', justifyContent: 'center',
  },
  approveBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#10B98115', alignItems: 'center', justifyContent: 'center',
  },
  notifItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#1E1E3F', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#2D2D5A',
  },
  notifUnread: { borderColor: '#6366F130', backgroundColor: '#6366F108' },
  notifIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  notifContent: { flex: 1, gap: 2 },
  notifTitle: { fontSize: 14, fontWeight: '500', color: '#D1D5DB' },
  notifBody: { fontSize: 12, color: '#9CA3AF' },
  notifTime: { fontSize: 11, color: '#6B7280', marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6366F1', marginTop: 4 },
});
