import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';

interface AccessRequest {
  id: string;
  domain: string;
  reason: string | null;
  status: string;
  profiles: { display_name: string; avatar_emoji: string } | null;
}

const DURATION_OPTIONS = [
  { label: '30 dakika', minutes: 30 },
  { label: '2 saat', minutes: 120 },
  { label: 'Bu gün', minutes: 1440 },
];

export default function OverrideScreen() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const router = useRouter();
  const [request, setRequest] = useState<AccessRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!requestId) return;
    supabase
      .from('access_requests')
      .select('id, domain, reason, status, profiles(display_name, avatar_emoji)')
      .eq('id', requestId)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setRequest(data as unknown as AccessRequest);
        setIsLoading(false);
      });
  }, [requestId]);

  const respond = async (status: 'approved' | 'denied') => {
    if (!request) return;
    setIsSaving(true);
    const { error } = await supabase
      .from('access_requests')
      .update({ status, responded_at: new Date().toISOString() })
      .eq('id', request.id);
    setIsSaving(false);

    if (error) {
      Alert.alert('Hata', error.message);
      return;
    }

    const label = status === 'approved' ? 'Onaylandı' : 'Reddedildi';
    const msg = status === 'approved'
      ? `${request.profiles?.display_name ?? 'Profil'} için ${DURATION_OPTIONS[selectedDuration].label} süreyle ${request.domain} erişimi açıldı.`
      : `${request.profiles?.display_name ?? 'Profil'}'in isteği reddedildi.`;
    Alert.alert(label, msg, [{ text: 'Tamam', onPress: () => router.back() }]);
  };

  const handleApprove = () => respond('approved');
  const handleReject = () => respond('denied');

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      </SafeAreaView>
    );
  }

  if (!request) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>İstek bulunamadı</Text>
          <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
            <Text style={styles.backLinkText}>Geri dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Erişim İsteği</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.profileEmoji}>
            <Text style={{ fontSize: 40 }}>{request.profiles?.avatar_emoji ?? '👤'}</Text>
          </View>
          <Text style={styles.profileName}>{request.profiles?.display_name ?? 'Profil'}</Text>
          <Text style={styles.profileSub}>şu siteye erişmek istiyor</Text>
        </View>

        {/* Site info */}
        <View style={styles.siteCard}>
          <Text style={styles.siteName}>{request.domain}</Text>
          {request.reason ? (
            <View style={styles.noteBox}>
              <Ionicons name="chatbubble-outline" size={14} color="#9CA3AF" />
              <Text style={styles.noteText}>"{request.reason}"</Text>
            </View>
          ) : null}
        </View>

        {/* Duration selection */}
        <View style={styles.durationSection}>
          <Text style={styles.durationTitle}>Onaylama süresi</Text>
          <View style={styles.durationRow}>
            {DURATION_OPTIONS.map((opt, idx) => (
              <TouchableOpacity
                key={opt.label}
                style={[styles.durationBtn, selectedDuration === idx && styles.durationBtnActive]}
                onPress={() => setSelectedDuration(idx)}
              >
                <Text style={[styles.durationBtnText, selectedDuration === idx && styles.durationBtnTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.rejectBtn} onPress={handleReject} disabled={isSaving}>
            <Ionicons name="close-circle-outline" size={22} color="#EF4444" />
            <Text style={styles.rejectBtnText}>Reddet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.approveBtn} onPress={handleApprove} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={styles.approveBtnText}>
                  {DURATION_OPTIONS[selectedDuration].label} için Onayla
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F23' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { fontSize: 15, color: '#EF4444' },
  backLink: { padding: 8 },
  backLinkText: { fontSize: 14, color: '#818CF8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2D2D5A',
  },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1E1E3F', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#F9FAFB' },
  content: { flex: 1, padding: 24, gap: 24, justifyContent: 'center' },
  profileSection: { alignItems: 'center', gap: 8 },
  profileEmoji: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: '#1E1E3F', borderWidth: 1, borderColor: '#2D2D5A',
    alignItems: 'center', justifyContent: 'center',
  },
  profileName: { fontSize: 22, fontWeight: '700', color: '#F9FAFB' },
  profileSub: { fontSize: 14, color: '#9CA3AF' },
  siteCard: {
    backgroundColor: '#1E1E3F', borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: '#2D2D5A', gap: 10, alignItems: 'center',
  },
  siteName: { fontSize: 24, fontWeight: '700', color: '#F9FAFB' },
  noteBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 4 },
  noteText: { fontSize: 13, color: '#9CA3AF', fontStyle: 'italic', flex: 1, textAlign: 'center' },
  durationSection: { gap: 12 },
  durationTitle: { fontSize: 15, fontWeight: '600', color: '#F9FAFB', textAlign: 'center' },
  durationRow: { flexDirection: 'row', gap: 8 },
  durationBtn: {
    flex: 1, borderWidth: 1.5, borderColor: '#2D2D5A',
    borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  durationBtnActive: { borderColor: '#6366F1', backgroundColor: '#6366F115' },
  durationBtnText: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
  durationBtnTextActive: { color: '#818CF8' },
  actions: { flexDirection: 'row', gap: 12 },
  rejectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: '#EF444430', borderRadius: 16, paddingVertical: 16,
    backgroundColor: '#EF444410',
  },
  rejectBtnText: { fontSize: 15, fontWeight: '600', color: '#EF4444' },
  approveBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#6366F1', borderRadius: 16, paddingVertical: 16,
  },
  approveBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
