// import { Stack } from "expo-router";
import "../global.css"
// export default function RootLayout() {
//   return <Stack />;
// }
import { Tabs } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'automation') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'reports') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#1E40AF', 
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderColor: '#e5e7eb', // Tailwind gray-200
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="automation"
        options={{ title: 'Automation' }}
      />
      <Tabs.Screen
        name="reports"
        options={{ title: 'Reports' }}
      />
    </Tabs>
  );
}
