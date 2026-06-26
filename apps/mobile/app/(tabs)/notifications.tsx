import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

interface AccessRequest {
  id: string;
  domain: string;
  reason: string | null;
  status: string;
  profiles: { display_name: string; avatar_emoji: string } | null;
}

const notifIcon: Record<string, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
  access_request: { name: 'time-outline', color: '#F59E0B' },
  weekly_report: { name: 'bar-chart-outline', color: '#6366F1' },
  device_added: { name: 'phone-portrait-outline', color: '#10B981' },
  limit_reached: { name: 'timer-outline', color: '#8B5CF6' },
  tamper_attempt: { name: 'warning-outline', color: '#EF4444' },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    const [notifsRes, requestsRes] = await Promise.all([
      supabase
        .from('notifications')
        .select('id, type, title, body, is_read, created_at')
        .eq('account_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('access_requests')
        .select('id, domain, reason, status, profiles(display_name, avatar_emoji)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false }),
    ]);

    setNotifications((notifsRes.data ?? []) as Notification[]);
    setPendingRequests((requestsRes.data ?? []) as unknown as AccessRequest[]);
    setIsLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const markAllRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('account_id', user.id)
      .eq('is_read', false);
    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  const respondToRequest = async (id: string, status: 'approved' | 'denied') => {
    const { error } = await supabase
      .from('access_requests')
      .update({ status, responded_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      Alert.alert('Hata', error.message);
    } else {
      setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Bildirimler</Text>
        <TouchableOpacity onPress={markAllRead}>
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
                    <Text style={{ fontSize: 22 }}>{req.profiles?.avatar_emoji ?? '👤'}</Text>
                  </View>
                  <View style={styles.reqInfo}>
                    <Text style={styles.reqName}>{req.profiles?.display_name ?? 'Profil'}</Text>
                    <Text style={styles.reqSite}>{req.domain} erişimi istiyor</Text>
                    {req.reason ? <Text style={styles.reqNote}>"{req.reason}"</Text> : null}
                  </View>
                </View>
                <View style={styles.reqActions}>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => respondToRequest(req.id, 'denied')}
                  >
                    <Ionicons name="close" size={16} color="#EF4444" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => respondToRequest(req.id, 'approved')}
                  >
                    <Ionicons name="checkmark" size={16} color="#10B981" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tüm Bildirimler</Text>
          {notifications.length === 0 ? (
            <Text style={styles.emptyText}>Bildirim yok</Text>
          ) : (
            notifications.map((notif) => {
              const icon = notifIcon[notif.type] ?? { name: 'notifications-outline' as const, color: '#6B7280' };
              return (
                <View
                  key={notif.id}
                  style={[styles.notifItem, !notif.is_read && styles.notifUnread]}
                >
                  <View style={[styles.notifIcon, { backgroundColor: icon.color + '20' }]}>
                    <Ionicons name={icon.name} size={18} color={icon.color} />
                  </View>
                  <View style={styles.notifContent}>
                    <Text style={[styles.notifTitle, !notif.is_read && { color: '#F9FAFB' }]}>
                      {notif.title}
                    </Text>
                    <Text style={styles.notifBody}>{notif.body}</Text>
                    <Text style={styles.notifTime}>
                      {new Date(notif.created_at).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                  {!notif.is_read && <View style={styles.unreadDot} />}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F23' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 13, color: '#6B7280', fontStyle: 'italic' },
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
