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
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export default function RootLayout() {
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await SecureStore.getItemAsync('token');
      setIsLoggedIn(!!token);
      setIsAuthResolved(true);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
  if (!isAuthResolved) return;

  console.log('Segments:', segments);
  console.log('Logged in?', isLoggedIn);

  const inAuthGroup = segments[0] === '(auth)';
  const inTabsGroup = segments[0] === '(tabs)';

  if (!isLoggedIn && !inAuthGroup) {
    router.replace('/(auth)/login');
  }

  if (isLoggedIn && !inTabsGroup) {
    router.replace('/(tabs)');
  }
}, [isAuthResolved, isLoggedIn, segments]);


  return <Slot />;
}
