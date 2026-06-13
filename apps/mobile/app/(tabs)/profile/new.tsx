import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const PROFILE_TYPES = [
  {
    id: 'child',
    label: 'Çocuk',
    desc: 'En kısıtlayıcı. Sadece onaylanan içerikler.',
    emoji: '👦',
    color: '#3B82F6',
  },
  {
    id: 'teen',
    label: 'Genç',
    desc: 'Dengeli kontrol. Sosyal medya ve oyunlara sınırlı erişim.',
    emoji: '🧑',
    color: '#8B5CF6',
  },
  {
    id: 'self_control',
    label: 'Öz Kontrol',
    desc: 'Yetişkin için. Dikkat dağıtıcıları engeller.',
    emoji: '💼',
    color: '#22C55E',
  },
  {
    id: 'unrestricted',
    label: 'Kısıtsız',
    desc: 'Filtreleme yok. Sadece izleme.',
    emoji: '🌐',
    color: '#0EA5E9',
  },
] as const;

const AVATARS = ['👧', '👦', '🧒', '👶', '🧑', '👱', '👨', '👩', '🧔', '👴', '👵', '🦸'];
const COLORS = ['#3B82F6', '#8B5CF6', '#22C55E', '#0EA5E9', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6'];

export default function NewProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState<typeof PROFILE_TYPES[number]['id']>('child');
  const [avatar, setAvatar] = useState('👧');
  const [color, setColor] = useState('#3B82F6');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    // TODO: call Supabase to create profile
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={20} color="#F9FAFB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Profil</Text>
        <TouchableOpacity
          style={[styles.saveBtn, (!name.trim() || saving) && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!name.trim() || saving}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Kaydediliyor…' : 'Kaydet'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar preview */}
        <View style={styles.avatarPreviewWrap}>
          <View style={[styles.avatarPreview, { backgroundColor: color + '22', borderColor: color + '55' }]}>
            <Text style={{ fontSize: 40 }}>{avatar}</Text>
          </View>
        </View>

        {/* Avatar picker */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Avatar seç</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map((em) => (
              <TouchableOpacity
                key={em}
                style={[styles.avatarOption, avatar === em && styles.avatarOptionSelected]}
                onPress={() => setAvatar(em)}
              >
                <Text style={{ fontSize: 24 }}>{em}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color picker */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Renk seç</Text>
          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </View>

        {/* Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>İsim</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="örn. Emma, İş Bilgisayarı..."
            placeholderTextColor="#6B7280"
            maxLength={32}
          />
        </View>

        {/* Profile type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Profil Türü</Text>
          <View style={styles.typeList}>
            {PROFILE_TYPES.map((pt) => (
              <TouchableOpacity
                key={pt.id}
                style={[styles.typeCard, type === pt.id && styles.typeCardSelected]}
                onPress={() => setType(pt.id)}
              >
                <View style={styles.typeLeft}>
                  <Text style={{ fontSize: 22 }}>{pt.emoji}</Text>
                  <View style={styles.typeInfo}>
                    <Text style={[styles.typeLabel, type === pt.id && { color: '#F9FAFB' }]}>{pt.label}</Text>
                    <Text style={styles.typeDesc}>{pt.desc}</Text>
                  </View>
                </View>
                {type === pt.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#6366F1" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={16} color="#6366F1" />
          <Text style={styles.infoText}>
            Profil oluşturduktan sonra cihaz ekleyebilir ve kategori kurallarını özelleştirebilirsiniz.
          </Text>
        </View>
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
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#F9FAFB' },
  saveBtn: { backgroundColor: '#6366F1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  scroll: { padding: 20, gap: 24, paddingBottom: 60 },
  avatarPreviewWrap: { alignItems: 'center' },
  avatarPreview: {
    width: 88, height: 88, borderRadius: 28,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  section: { gap: 10 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  avatarOption: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: '#1E1E3F', borderWidth: 1.5, borderColor: '#2D2D5A',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarOptionSelected: { borderColor: '#6366F1', backgroundColor: '#6366F120' },
  colorRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotSelected: { borderWidth: 3, borderColor: '#fff' },
  input: {
    backgroundColor: '#1E1E3F', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#2D2D5A',
    fontSize: 16, color: '#F9FAFB',
  },
  typeList: { gap: 8 },
  typeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1E1E3F', borderRadius: 16, padding: 14,
    borderWidth: 1.5, borderColor: '#2D2D5A',
  },
  typeCardSelected: { borderColor: '#6366F1', backgroundColor: '#6366F110' },
  typeLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  typeInfo: { flex: 1, gap: 2 },
  typeLabel: { fontSize: 15, fontWeight: '600', color: '#9CA3AF' },
  typeDesc: { fontSize: 12, color: '#6B7280', lineHeight: 16 },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#6366F110', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#6366F120',
  },
  infoText: { fontSize: 13, color: '#9CA3AF', flex: 1, lineHeight: 18 },
});
