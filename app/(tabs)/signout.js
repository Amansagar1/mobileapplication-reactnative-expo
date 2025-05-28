import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../../utils/auth-context'; // Adjust if your path is different

export default function SignOutScreen() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    const signOut = async () => {
      await SecureStore.deleteItemAsync('token'); // Clear token
      setIsLoggedIn(false); // Update auth state
      router.replace('/(auth)/login'); // Redirect to login
    };

    signOut();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#1E40AF" />
      <Text className="mt-4 text-gray-600">Signing out...</Text>
    </View>
  );
}
