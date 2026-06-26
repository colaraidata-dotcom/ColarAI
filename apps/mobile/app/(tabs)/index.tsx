import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';

interface DashboardStats {
  activeProfiles: number;
  connectedDevices: number;
  blockedToday: number;
}

interface PendingRequest {
  id: string;
  domain: string;
  reason: string | null;
  profiles: { display_name: string; avatar_emoji: string } | null;
}

interface RecentNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

interface ProfileRow {
  id: string;
  display_name: string;
  avatar_emoji: string;
  avatar_color: string;
  is_active: boolean;
  devices: Array<{ id: string; is_online: boolean }>;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [stats, setStats] = useState<DashboardStats>({ activeProfiles: 0, connectedDevices: 0, blockedToday: 0 });
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [notifications, setNotifications] = useState<RecentNotification[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [profilesRes, devicesRes, blockedRes, requestsRes, notifsRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, display_name, avatar_emoji, avatar_color, is_active, devices(id, is_online)')
        .eq('account_id', user.id)
        .order('created_at', { ascending: true }),
      supabase
        .from('devices')
        .select('id', { count: 'exact', head: true })
        .eq('account_id', user.id),
      supabase
        .from('access_logs')
        .select('id', { count: 'exact', head: true })
        .eq('action', 'blocked')
        .gte('created_at', today.toISOString()),
      supabase
        .from('access_requests')
        .select('id, domain, reason, profiles(display_name, avatar_emoji)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('notifications')
        .select('id, type, title, body, is_read, created_at')
        .eq('account_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3),
    ]);

    const profileRows = (profilesRes.data ?? []) as ProfileRow[];
    const activeCount = profileRows.filter((p) => p.is_active).length;

    setProfiles(profileRows);
    setStats({
      activeProfiles: activeCount,
      connectedDevices: devicesRes.count ?? 0,
      blockedToday: blockedRes.count ?? 0,
    });
    setPendingRequests((requestsRes.data ?? []) as unknown as PendingRequest[]);
    setNotifications((notifsRes.data ?? []) as RecentNotification[]);
    setIsLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const displayName = user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? 'Kullanıcı';
  const todayLabel = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

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
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Merhaba, {displayName} 👋</Text>
            <Text style={styles.date}>{todayLabel}</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => router.push('/(tabs)/notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color="#D1D5DB" />
            {unreadCount > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Profil', value: stats.activeProfiles, icon: 'people', color: '#6366F1' },
            { label: 'Çevrimiçi Cihaz', value: stats.connectedDevices, icon: 'phone-portrait', color: '#10B981' },
            { label: 'Bugün Engellendi', value: stats.blockedToday, icon: 'close-circle', color: '#EF4444' },
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
                    <Text style={{ fontSize: 20 }}>{req.profiles?.avatar_emoji ?? '👤'}</Text>
                  </View>
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestName}>{req.profiles?.display_name ?? 'Profil'}</Text>
                    <Text style={styles.requestSite}>{req.domain}</Text>
                    {req.reason ? <Text style={styles.requestNote}>{req.reason}</Text> : null}
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
          {profiles.length === 0 ? (
            <Text style={styles.emptyText}>Henüz profil yok</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.profileScroll}>
              {profiles.map((p) => {
                const onlineCount = (p.devices ?? []).filter((d) => d.is_online).length;
                const totalCount = (p.devices ?? []).length;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.profileCard}
                    onPress={() => router.push(`/(tabs)/profile/${p.id}/index`)}
                  >
                    <View
                      style={[styles.profileAvatar, {
                        backgroundColor: p.avatar_color + '22',
                        borderColor: p.avatar_color + '55',
                      }]}
                    >
                      <Text style={{ fontSize: 24 }}>{p.avatar_emoji}</Text>
                    </View>
                    <Text style={styles.profileName}>{p.display_name}</Text>
                    <Text style={styles.profileDevices}>{onlineCount}/{totalCount} cihaz</Text>
                    <View style={[styles.profileStatus, { backgroundColor: p.is_active ? '#10B98115' : '#6B728015' }]}>
                      <View style={[styles.profileDot, { backgroundColor: p.is_active ? '#10B981' : '#6B7280' }]} />
                      <Text style={[styles.profileStatusText, { color: p.is_active ? '#10B981' : '#6B7280' }]}>
                        {p.is_active ? 'Aktif' : 'Pasif'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Recent notifications */}
        {notifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Son Bildirimler</Text>
            {notifications.map((notif) => (
              <View key={notif.id} style={[styles.notifItem, !notif.is_read && styles.notifItemUnread]}>
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
                {!notif.is_read && <View style={styles.unreadDot} />}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F23' },
  scroll: { padding: 20, gap: 24, paddingBottom: 40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 13, color: '#6B7280', fontStyle: 'italic' },
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
