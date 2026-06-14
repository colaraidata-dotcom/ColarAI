import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Background glow */}
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={48} color="#fff" />
          </View>
          <Text style={styles.logoText}>Guardian</Text>
        </View>

        {/* Hero text */}
        <View style={styles.heroWrap}>
          <Text style={styles.heroTitle}>
            İnternet,{'\n'}
            <Text style={styles.heroHighlight}>herkes için değil.</Text>
            {'\n'}Senin için.
          </Text>
          <Text style={styles.heroSub}>
            Aile güvenliği ve kişisel odaklanma için tasarlanmış profil tabanlı internet kontrolü.
          </Text>
        </View>

        {/* Feature bullets */}
        <View style={styles.bullets}>
          {[
            'Sınırsız profil, tek hesap',
            'iOS ve Android desteği',
            'Ebeveyn onay akışı',
          ].map((item) => (
            <View key={item} style={styles.bullet}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* CTA buttons */}
        <View style={styles.ctas}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={styles.primaryBtnText}>Başla</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(auth)/sign-in')}>
            <Text style={styles.secondaryBtnText}>Hesabım var, giriş yap</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>Kredi kartı gerekmez · 1 profil sonsuza kadar ücretsiz</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F23' },
  glow1: {
    position: 'absolute', top: 80, left: -60,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: '#6366F120',
  },
  glow2: {
    position: 'absolute', bottom: 120, right: -80,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#8B5CF615',
  },
  content: { flex: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 32, gap: 36 },
  logoWrap: { alignItems: 'center', gap: 12 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: '#6366F1', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 28, fontWeight: '700', color: '#F9FAFB', letterSpacing: -0.5 },
  heroWrap: { gap: 12 },
  heroTitle: { fontSize: 36, fontWeight: '700', color: '#F9FAFB', lineHeight: 44 },
  heroHighlight: { color: '#818CF8' },
  heroSub: { fontSize: 16, color: '#9CA3AF', lineHeight: 24 },
  bullets: { gap: 12 },
  bullet: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bulletText: { fontSize: 15, color: '#D1D5DB' },
  ctas: { gap: 12 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#6366F1', borderRadius: 16, paddingVertical: 16,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  secondaryBtn: {
    alignItems: 'center', borderRadius: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: '#2D2D5A',
  },
  secondaryBtnText: { fontSize: 15, color: '#9CA3AF' },
  note: { textAlign: 'center', fontSize: 12, color: '#6B7280' },
});
