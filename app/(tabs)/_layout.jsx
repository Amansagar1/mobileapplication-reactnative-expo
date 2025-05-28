import { Tabs, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../utils/auth-context';
import * as SecureStore from 'expo-secure-store';

export default function TabsLayout() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear stored token
              await SecureStore.deleteItemAsync('token');
              
              // Update auth context
              setIsLoggedIn(false);
              
              // Navigate to login
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Error during sign out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused, size }) => {
          const iconMap = {
            index: focused ? 'home' : 'home-outline',
            automation: focused ? 'settings' : 'settings-outline',
            reports: focused ? 'bar-chart' : 'bar-chart-outline',
            signout: focused ? 'log-out' : 'log-out-outline',
          };
          
          const iconName = iconMap[route.name] || 'help-outline';
          
          return <Ionicons name={iconName} size={size || 24} color={color} />;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
        tabBarButton: route.name === 'signout' ? undefined : undefined, // Keep default for all
      })}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarAccessibilityLabel: 'Home Tab'
        }} 
      />
      
      <Tabs.Screen 
        name="automation" 
        options={{ 
          title: 'Automation',
          tabBarAccessibilityLabel: 'Automation Tab'
        }} 
      />
      
      <Tabs.Screen 
        name="reports" 
        options={{ 
          title: 'Reports',
          tabBarAccessibilityLabel: 'Reports Tab'
        }} 
      />
      
      {/* Sign Out Tab with Custom Handler */}
      <Tabs.Screen
        name="signout"
        options={{ 
          title: 'Sign Out',
          tabBarAccessibilityLabel: 'Sign Out'
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Prevent default tab navigation
            handleSignOut(); // Show confirmation and handle sign out
          },
        }}
      />
    </Tabs>
  );
}