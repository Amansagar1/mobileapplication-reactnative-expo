import { Tabs } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName = {
            index: focused ? 'home' : 'home-outline',
            automation: focused ? 'settings' : 'settings-outline',
            reports: focused ? 'bar-chart' : 'bar-chart-outline',
          }[route.name];

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#1E40AF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="automation" options={{ title: 'Automation' }} />
      <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
    </Tabs>
  );
}
