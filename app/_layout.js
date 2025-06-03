// import { Stack } from "expo-router";
import "../global.css"
// export default function RootLayout() {
//   return <Stack />;
// }
// import { Tabs } from 'expo-router';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// export default function Layout() {
//   return (
//     <Tabs
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size, focused }) => {
//           let iconName;

//           if (route.name === 'index') {
//             iconName = focused ? 'home' : 'home-outline';
//           } else if (route.name === 'automation') {
//             iconName = focused ? 'settings' : 'settings-outline';
//           } else if (route.name === 'reports') {
//             iconName = focused ? 'bar-chart' : 'bar-chart-outline';
//           }

//           return <Ionicons name={iconName} size={22} color={color} />;
//         },
//         tabBarActiveTintColor: '#1E40AF', 
//         tabBarInactiveTintColor: 'gray',
//         tabBarLabelStyle: { fontSize: 12 },
//         tabBarStyle: {
//           backgroundColor: 'white',
//           borderTopWidth: 1,
//           borderColor: '#e5e7eb', // Tailwind gray-200
//           paddingBottom: 5,
//           height: 60,
//         },
//         headerShown: false,
//       })}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{ title: 'Home' }}
//       />
//       <Tabs.Screen
//         name="automation"
//         options={{ title: 'Automation' }}
//       />
//       <Tabs.Screen
//         name="reports"
//         options={{ title: 'Reports' }}
//       />
//     </Tabs>
//   );
// }
// app/_layout.js
// app/_layout.js or wherever your RootLayout is defined

import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../utils/auth-context';

// Auth-aware navigation guard
function RootNavigationGuard() {
  const { isLoggedIn, isAuthResolved } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Don't navigate until auth status is resolved
    if (!isAuthResolved) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    console.log('Navigation Guard:', {
      isLoggedIn,
      isAuthResolved,
      segments,
      inAuthGroup,
      inTabsGroup
    });

    // Redirect unauthenticated users to login
    if (!isLoggedIn && !inAuthGroup) {
      console.log('Redirecting to login');
      router.replace('/(auth)/login');
      return;
    }

    // Redirect authenticated users to home if they're on auth screens
    if (isLoggedIn && inAuthGroup) {
      console.log('Redirecting to home');
      router.replace('/(tabs)');
      return;
    }

    // Ensure authenticated users land on tabs if not already there
    if (isLoggedIn && !inTabsGroup && !inAuthGroup) {
      console.log('Ensuring user is on tabs');
      router.replace('/(tabs)');
      return;
    }
  }, [isAuthResolved, isLoggedIn, segments, router]);

  // Show loading or nothing while auth is resolving
  if (!isAuthResolved) {
    return null; // or a loading screen
  }

  return <Slot />;
}

// Main root layout with auth provider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigationGuard />
    </AuthProvider>
  );
}