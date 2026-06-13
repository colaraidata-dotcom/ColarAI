import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockProfiles, mockDevices, mockRules } from '@guardian/shared/mock';
import { PROFILE_TYPE_META } from '@guardian/shared/constants';

export default function ProfilesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Profiller</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(tabs)/profile/new')}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {mockProfiles.map((profile) => {
          const meta = PROFILE_TYPE_META[profile.type];
          const profileDevices = mockDevices.filter((d) => d.profileId === profile.id);
          const rules = mockRules[profile.id] ?? [];
          const blockedCount = rules.filter((r) => r.action === 'block').length;

          return (
            <TouchableOpacity
              key={profile.id}
              style={styles.profileCard}
              onPress={() => router.push(`/(tabs)/profile/${profile.id}/index`)}
            >
              <View style={styles.profileLeft}>
                <View
                  style={[styles.avatar, {
                    backgroundColor: profile.avatarColor + '22',
                    borderColor: profile.avatarColor + '55',
                  }]}
                >
                  <Text style={{ fontSize: 26 }}>{profile.avatarEmoji}</Text>
                </View>
                <View style={styles.profileInfo}>
                  <View style={styles.profileNameRow}>
                    <Text style={styles.profileName}>{profile.name}</Text>
                    <View style={[styles.statusDot, { backgroundColor: profile.isActive ? '#10B981' : '#6B7280' }]} />
                  </View>
                  <Text style={styles.profileType}>{meta.label}</Text>
                  <View style={styles.profileStats}>
                    <View style={styles.statChip}>
                      <Ionicons name="phone-portrait-outline" size={11} color="#9CA3AF" />
                      <Text style={styles.statChipText}>{profileDevices.length} cihaz</Text>
                    </View>
                    <View style={styles.statChip}>
                      <Ionicons name="close-circle-outline" size={11} color="#EF4444" />
                      <Text style={[styles.statChipText, { color: '#EF4444' }]}>{blockedCount} engel</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.profileRight}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => router.push(`/(tabs)/profile/${profile.id}/edit`)}
                >
                  <Ionicons name="pencil-outline" size={14} color="#818CF8" />
                </TouchableOpacity>
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.addCard}
          onPress={() => router.push('/(tabs)/profile/new')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#6366F1" />
          <Text style={styles.addCardText}>Yeni profil ekle</Text>
        </TouchableOpacity>
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
  addBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#6366F1', alignItems: 'center', justifyContent: 'center',
  },
  scroll: { padding: 20, gap: 10, paddingBottom: 40 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1E1E3F', borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: '#2D2D5A',
  },
  profileLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  avatar: {
    width: 52, height: 52, borderRadius: 16,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  profileInfo: { flex: 1, gap: 4 },
  profileNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  profileName: { fontSize: 16, fontWeight: '600', color: '#F9FAFB' },
  statusDot: { width: 7, height: 7, borderRadius: 3.5 },
  profileType: { fontSize: 13, color: '#9CA3AF' },
  profileStats: { flexDirection: 'row', gap: 8, marginTop: 2 },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statChipText: { fontSize: 11, color: '#9CA3AF' },
  profileRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  editBtn: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: '#6366F115', alignItems: 'center', justifyContent: 'center',
  },
  addCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 1.5, borderColor: '#2D2D5A', borderStyle: 'dashed',
    borderRadius: 18, paddingVertical: 18,
  },
  addCardText: { fontSize: 15, color: '#6366F1', fontWeight: '500' },
});
