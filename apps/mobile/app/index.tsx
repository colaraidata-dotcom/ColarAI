import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/auth';

export default function Index() {
  const { user, isLoading, initialize } = useAuthStore();

  useEffect(() => { initialize(); }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F5F8FF', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#0EA5E9" />
      </View>
    );
  }

  return <Redirect href={user ? '/(tabs)' : '/(auth)/welcome'} />;
}
