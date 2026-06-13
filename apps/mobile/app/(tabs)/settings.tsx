import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mockAccount, mockDevices } from '@guardian/shared/mock';

const settingSections = [
  {
    title: 'Hesap',
    items: [
      { icon: 'person-outline', label: 'Hesap Bilgileri', color: '#6366F1' },
      { icon: 'card-outline', label: 'Abonelik — Family Plan', color: '#10B981' },
      { icon: 'notifications-outline', label: 'Bildirim Ayarları', color: '#F59E0B' },
    ],
  },
  {
    title: 'Cihazlar',
    items: [
      { icon: 'phone-portrait-outline', label: 'Bağlı Cihazlar', color: '#8B5CF6', badge: String(mockDevices.length) },
      { icon: 'wifi-outline', label: 'Ağ Ayarları (DNS)', color: '#06B6D4' },
      { icon: 'add-circle-outline', label: 'Yeni Cihaz Ekle', color: '#10B981' },
    ],
  },
  {
    title: 'Gizlilik & Güvenlik',
    items: [
      { icon: 'lock-closed-outline', label: 'PIN Yönetimi', color: '#6366F1' },
      { icon: 'eye-outline', label: 'Veri Saklama Ayarları', color: '#9CA3AF' },
      { icon: 'shield-outline', label: 'Kurcalama Koruması', color: '#EF4444' },
    ],
  },
  {
    title: 'Destek',
    items: [
      { icon: 'help-circle-outline', label: 'Yardım Merkezi', color: '#6B7280' },
      { icon: 'mail-outline', label: 'Destek İle İletişim', color: '#6B7280' },
      { icon: 'document-text-outline', label: 'Gizlilik Politikası', color: '#6B7280' },
    ],
  },
];

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Ayarlar</Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Account card */}
        <View style={styles.accountCard}>
          <View style={styles.accountAvatar}>
            <Text style={{ fontSize: 24 }}>👤</Text>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{mockAccount.displayName}</Text>
            <Text style={styles.accountEmail}>{mockAccount.email}</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>Family Plan</Text>
            </View>
          </View>
        </View>

        {settingSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, idx) => (
                <View key={item.label}>
                  <TouchableOpacity style={styles.settingRow}>
                    <View style={[styles.settingIcon, { backgroundColor: item.color + '20' }]}>
                      <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={18} color={item.color} />
                    </View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <View style={styles.settingRight}>
                      {item.badge && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                      )}
                      <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                    </View>
                  </TouchableOpacity>
                  {idx < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.signOutBtn}>
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.signOutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Guardian v0.1.0 — MVP Preview</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F23' },
  title: { fontSize: 24, fontWeight: '700', color: '#F9FAFB', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  scroll: { padding: 20, gap: 20, paddingBottom: 60 },
  accountCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#1E1E3F', borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: '#2D2D5A',
  },
  accountAvatar: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: '#6366F120', borderWidth: 1.5, borderColor: '#6366F140',
    alignItems: 'center', justifyContent: 'center',
  },
  accountInfo: { flex: 1, gap: 4 },
  accountName: { fontSize: 17, fontWeight: '700', color: '#F9FAFB' },
  accountEmail: { fontSize: 13, color: '#9CA3AF' },
  planBadge: { backgroundColor: '#10B98115', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  planBadgeText: { fontSize: 11, color: '#10B981', fontWeight: '600' },
  section: { gap: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, paddingLeft: 4 },
  sectionCard: {
    backgroundColor: '#1E1E3F', borderRadius: 16,
    borderWidth: 1, borderColor: '#2D2D5A', overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: 15, color: '#D1D5DB', flex: 1 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { backgroundColor: '#6366F120', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 12, color: '#818CF8', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#2D2D5A', marginLeft: 62 },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: '#EF444430', borderRadius: 16, paddingVertical: 14,
    backgroundColor: '#EF444408',
  },
  signOutText: { fontSize: 15, fontWeight: '600', color: '#EF4444' },
  version: { textAlign: 'center', fontSize: 12, color: '#6B7280' },
});
