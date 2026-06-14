import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/auth';

export default function SignInScreen() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password) { setError('Email and password are required.'); return; }
    setError(null);
    setLoading(true);
    const err = await signIn(email.trim(), password);
    setLoading(false);
    if (err) { setError(err); return; }
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.sub}>Sign in to your Guardian account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.pwWrap}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                autoComplete="current-password"
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.primaryBtn} onPress={handleSignIn} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Sign In</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(auth)/sign-up')}>
            <Text style={styles.secondaryBtnText}>Don't have an account? <Text style={{ color: '#0EA5E9', fontWeight: '600' }}>Sign Up</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FF' },
  inner: { flex: 1, paddingHorizontal: 24 },
  back: { paddingTop: 16, paddingBottom: 8, alignSelf: 'flex-start' },
  header: { paddingTop: 24, paddingBottom: 32, gap: 6 },
  title: { fontSize: 28, fontWeight: '700', color: '#0F172A' },
  sub: { fontSize: 15, color: '#64748B' },
  form: { gap: 16 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500', color: '#334155' },
  input: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#DBEAFE', backgroundColor: '#fff', paddingHorizontal: 14, fontSize: 15, color: '#0F172A' },
  pwWrap: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#DBEAFE', backgroundColor: '#fff', paddingLeft: 14 },
  eyeBtn: { paddingHorizontal: 14 },
  error: { fontSize: 13, color: '#B91C1C' },
  primaryBtn: { height: 52, borderRadius: 14, backgroundColor: '#0EA5E9', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  secondaryBtn: { alignItems: 'center', paddingVertical: 12 },
  secondaryBtnText: { fontSize: 14, color: '#64748B' },
});
