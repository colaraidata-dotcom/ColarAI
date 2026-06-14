import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, CheckCircle } from '@expo/vector-icons';
import { useAuthStore } from '../../store/auth';

export default function SignUpScreen() {
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSignUp() {
    if (!name.trim() || !email.trim() || !password) { setError('All fields are required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError(null);
    setLoading(true);
    const err = await signUp(email.trim(), password, name.trim());
    setLoading(false);
    if (err) { setError(err); return; }
    setDone(true);
  }

  if (done) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.doneWrap}>
          <Ionicons name="checkmark-circle" size={64} color="#22C55E" />
          <Text style={styles.doneTitle}>Check your email</Text>
          <Text style={styles.doneSub}>We sent a confirmation link. Click it to activate your account.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(auth)/sign-in')}>
            <Text style={styles.primaryBtnText}>Go to Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.sub}>Start protecting your family today</Text>
        </View>

        <View style={styles.form}>
          {[
            { label: 'Your name', value: name, setter: setName, placeholder: 'John Doe', type: 'default' as const },
            { label: 'Email', value: email, setter: setEmail, placeholder: 'you@example.com', type: 'email-address' as const },
          ].map((f) => (
            <View key={f.label} style={styles.field}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input}
                value={f.value}
                onChangeText={f.setter}
                placeholder={f.placeholder}
                placeholderTextColor="#94A3B8"
                keyboardType={f.type}
                autoCapitalize={f.type === 'email-address' ? 'none' : 'words'}
              />
            </View>
          ))}

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 8 characters"
              placeholderTextColor="#94A3B8"
              secureTextEntry
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.primaryBtn} onPress={handleSignUp} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Create Account</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(auth)/sign-in')}>
            <Text style={styles.secondaryBtnText}>Already have an account? <Text style={{ color: '#0EA5E9', fontWeight: '600' }}>Sign In</Text></Text>
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
  error: { fontSize: 13, color: '#B91C1C' },
  primaryBtn: { height: 52, borderRadius: 14, backgroundColor: '#0EA5E9', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  secondaryBtn: { alignItems: 'center', paddingVertical: 12 },
  secondaryBtnText: { fontSize: 14, color: '#64748B' },
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 },
  doneTitle: { fontSize: 24, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
  doneSub: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 22 },
});
