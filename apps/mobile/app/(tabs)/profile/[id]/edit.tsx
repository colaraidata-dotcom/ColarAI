import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../../lib/supabase';
import { CATEGORIES, PROFILE_TYPE_META } from '@guardian/shared/constants';
import type { CategoryId } from '@guardian/shared/types';

interface ContentRule {
  id: string;
  category: CategoryId;
  action: 'allow' | 'block' | 'limit';
  daily_limit_minutes: number | null;
}

interface ProfileRow {
  id: string;
  display_name: string;
  type: 'child' | 'teen' | 'adult_self' | 'adult_unrestricted';
  avatar_emoji: string;
  content_rules: ContentRule[];
}

export default function RuleEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // kural durumu: categoryId → 'allow' | 'block'
  const [rules, setRules] = useState<Record<string, 'allow' | 'block'>>({});

  useEffect(() => {
    if (!id) return;
    supabase
      .from('profiles')
      .select('id, display_name, type, avatar_emoji, content_rules(id, category, action, daily_limit_minutes)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          const p = data as unknown as ProfileRow;
          setProfile(p);
          const initial: Record<string, 'allow' | 'block'> = {};
          (p.content_rules ?? []).forEach((r) => {
            initial[r.category] = r.action === 'block' ? 'block' : 'allow';
          });
          setRules(initial);
        }
        setIsLoading(false);
      });
  }, [id]);

  const toggle = (categoryId: string) => {
    setRules((prev) => ({ ...prev, [categoryId]: prev[categoryId] === 'allow' ? 'block' : 'allow' }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);

    const ruleMap = Object.fromEntries((profile.content_rules ?? []).map((r) => [r.category, r]));
    const updates: PromiseLike<any>[] = [];

    for (const cat of CATEGORIES) {
      const newAction = rules[cat.id] ?? 'allow';
      const existing = ruleMap[cat.id];
      if (existing) {
        if (existing.action !== newAction) {
          updates.push(
            supabase
              .from('content_rules')
              .update({ action: newAction })
              .eq('id', existing.id)
              .eq('profile_id', profile.id)
          );
        }
      } else {
        // kural yoksa insert — id'nin DB default'u yok, açıkça üretilmeli
        updates.push(
          supabase
            .from('content_rules')
            .insert({ id: `rule_${profile.id}_${cat.id}`, profile_id: profile.id, category: cat.id, action: newAction })
        );
      }
    }

    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);
    setIsSaving(false);

    if (hasError) {
      Alert.alert('Hata', 'Bazı kurallar kaydedilemedi.');
    } else {
      Alert.alert('Kaydedildi', 'Kurallar güncellendi.', [
        { text: 'Tamam', onPress: () => router.back() },
      ]);
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

  if (!profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Profil bulunamadı</Text>
        </View>
      </SafeAreaView>
    );
  }

  const meta = PROFILE_TYPE_META[profile.type];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#F9FAFB" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={{ fontSize: 20 }}>{profile.avatar_emoji}</Text>
          <View>
            <Text style={styles.headerName}>{profile.display_name} — Kurallar</Text>
            <Text style={styles.headerType}>{meta?.label ?? profile.type}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Kaydet</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={16} color="#6366F1" />
          <Text style={styles.infoText}>
            Değişiklikler kaydedildiğinde bağlı tüm cihazlara anında uygulanır.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Kategori Kuralları</Text>
        <Text style={styles.sectionSub}>Açık = İzinli, Kapalı = Engelli</Text>

        {CATEGORIES.map((category) => {
          const isAllowed = (rules[category.id] ?? 'allow') !== 'block';
          return (
            <View key={category.id} style={styles.ruleRow}>
              <View style={styles.ruleLeft}>
                <View style={[styles.ruleIcon, { backgroundColor: category.color + '20' }]}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={category.color} />
                </View>
                <View style={styles.ruleInfo}>
                  <Text style={styles.ruleLabel}>{category.label}</Text>
                  <Text style={styles.ruleDesc}>{category.description}</Text>
                </View>
              </View>
              <View style={styles.ruleRight}>
                <Text style={[styles.ruleStatus, { color: isAllowed ? '#10B981' : '#EF4444' }]}>
                  {isAllowed ? 'İzinli' : 'Engelli'}
                </Text>
                <Switch
                  value={isAllowed}
                  onValueChange={() => toggle(category.id)}
                  trackColor={{ false: '#EF444420', true: '#10B98120' }}
                  thumbColor={isAllowed ? '#10B981' : '#EF4444'}
                />
              </View>
            </View>
          );
        })}

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Site Özel Kurallar</Text>
        <TouchableOpacity style={styles.addSiteBtn}>
          <Ionicons name="add-circle-outline" size={18} color="#6366F1" />
          <Text style={styles.addSiteBtnText}>URL ekle (izin ver veya engelle)</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Zaman Programı</Text>
        <TouchableOpacity style={styles.addSiteBtn}>
          <Ionicons name="time-outline" size={18} color="#6366F1" />
          <Text style={styles.addSiteBtnText}>Zaman programı ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F23' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 14, color: '#EF4444' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2D2D5A',
  },
  backBtn: { padding: 6 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerName: { fontSize: 15, fontWeight: '600', color: '#F9FAFB' },
  headerType: { fontSize: 12, color: '#9CA3AF' },
  saveBtn: { backgroundColor: '#6366F1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7, minWidth: 70, alignItems: 'center' },
  saveBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  scroll: { padding: 20, gap: 12, paddingBottom: 60 },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#6366F110', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#6366F120',
  },
  infoText: { fontSize: 13, color: '#9CA3AF', flex: 1, lineHeight: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#F9FAFB' },
  sectionSub: { fontSize: 12, color: '#6B7280', marginTop: -6 },
  ruleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1E1E3F', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#2D2D5A',
  },
  ruleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  ruleIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  ruleInfo: { flex: 1 },
  ruleLabel: { fontSize: 14, fontWeight: '500', color: '#F9FAFB' },
  ruleDesc: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  ruleRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ruleStatus: { fontSize: 12, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#2D2D5A', marginVertical: 4 },
  addSiteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: '#2D2D5A', borderStyle: 'dashed',
    borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16,
  },
  addSiteBtnText: { fontSize: 14, color: '#6366F1' },
});
