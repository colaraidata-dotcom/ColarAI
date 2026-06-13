import { Redirect } from 'expo-router';

export default function Index() {
  // Auth kontrolü burada yapılacak (Clerk). MVP'de direkt dashboard'a yönlendir.
  const isAuthenticated = true;
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/welcome'} />;
}
