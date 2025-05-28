// import { useRouter } from "expo-router";
// import { Text,TouchableOpacity, View } from "react-native";

// export default function Index() {
//   const router = useRouter();
//   return (
//     <View className=""
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//       <TouchableOpacity onPress={() =>router.push("/testing")}>
// <Text>
//   Change route
// </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
// import { useState } from 'react';
// import { Button, Text, View } from 'react-native';
// import HomePageDetails from '../../pages/HomePageDetails';

// export default function HomeScreen() {
//   const [showDetails, setShowDetails] = useState(false);

//   return (
//     <View className="flex-1 p-4 bg-white top-12 ">
//       <Text className="text-xl font-bold text-gray-800 mb-4">🏠 Home Screen</Text>
//       <Button title="Show Details" onPress={() => setShowDetails(!showDetails)} />
//       {showDetails && <HomePageDetails />}
//     </View>
//   );
// }

// DashboardScreen.js
import React from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../utils/auth-context';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const { logout } = useAuth();

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [120, 160, 140, 200, 180],
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
      },
    ],
  };

  const barChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        data: [450, 560, 610, 720],
      },
    ],
  };

  const kpiData = [
    {
      title: 'Revenue',
      value: '₹12.4K',
      change: '+12.5%',
      isPositive: true,
      bg: 'bg-green-50',
      iconBg: 'bg-green-500',
      icon: 'cash-outline',
    },
    {
      title: 'Users',
      value: '3.2K',
      change: '+8.2%',
      isPositive: true,
      bg: 'bg-green-50',
      iconBg: 'bg-green-500',
      icon: 'people-outline',
    },
    {
      title: 'Conversion',
      value: '2.8%',
      change: '-0.3%',
      isPositive: false,
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-500',
      icon: 'trending-up-outline',
    },
    {
      title: 'Sessions',
      value: '8.4K',
      change: '+15.7%',
      isPositive: true,
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-500',
      icon: 'analytics-outline',
    },
    {
      title: 'Bounce Rate',
      value: '38%',
      change: '-2.1%',
      isPositive: true,
      bg: 'bg-red-50',
      iconBg: 'bg-red-500',
      icon: 'exit-outline',
    },
    {
      title: 'Avg. Time',
      value: '2m 45s',
      change: '+0.5%',
      isPositive: true,
      bg: 'bg-indigo-50',
      iconBg: 'bg-indigo-500',
      icon: 'time-outline',
    },
  ];

  const KPICard = ({ item }) => (
    <View className={`${item.bg} p-4 rounded-2xl flex-1 mx-1 mb-3 border border-gray-100`}>
      <View className="flex-row items-center justify-between mb-3">
        <View className={`${item.iconBg} p-2 rounded-lg`}>
          <Ionicons name={item.icon} size={20} color="white" />
        </View>
        <View className={`px-2 py-1 rounded-full ${item.isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
          <Text className={`text-xs font-semibold ${item.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {item.change}
          </Text>
        </View>
      </View>
      <Text className="text-gray-600 text-sm font-medium">{item.title}</Text>
      <Text className="text-xl font-bold text-gray-800 mt-1">{item.value}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-14 pb-6 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Dashboard</Text>
            <Text className="text-gray-500 mt-1">Welcome back! Here&apos;s your overview</Text>
          </View>
          <Pressable 
            className="bg-green-50 p-3 rounded-full"
            onPress={() => {/* Add notification handler */}}
          >
            <Ionicons name="notifications-outline" size={24} color="#2563EB" />
          </Pressable>
        </View>
      </View>

      <View className="px-6">
        {/* KPI Cards Grid */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</Text>
          <View className="flex-row flex-wrap -mx-1">
            {kpiData.map((item, index) => (
              <View key={index} className="w-1/2">
                <KPICard item={item} />
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Sales Chart */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-800">Monthly Sales</Text>
            <Pressable className="flex-row items-center">
              <Text className="text-green-600 text-sm font-medium mr-1">View Details</Text>
              <Ionicons name="chevron-forward" size={16} color="#2563EB" />
            </Pressable>
          </View>
          
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <LineChart
              data={lineChartData}
              width={screenWidth - 80}
              height={220}
              yAxisLabel="₹"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '3',
                  stroke: '#2563EB',
                  fill: '#ffffff',
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: '#f3f4f6',
                  strokeWidth: 1,
                },
              }}
              style={{
                borderRadius: 16,
              }}
              bezier
            />
          </View>
        </View>

        {/* Quarterly Performance Chart */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-800">Quarterly Performance</Text>
            <Pressable className="flex-row items-center">
              <Text className="text-green-600 text-sm font-medium mr-1">View Details</Text>
              <Ionicons name="chevron-forward" size={16} color="#2563EB" />
            </Pressable>
          </View>
          
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <BarChart
              data={barChartData}
              width={screenWidth - 80}
              height={200}
              yAxisLabel="₹"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
                barPercentage: 0.7,
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: '#f3f4f6',
                  strokeWidth: 1,
                },
              }}
              style={{
                borderRadius: 16,
              }}
            />
          </View>
        </View>

        {/* Insights Section */}
        <View className="mt-6 mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Insights</Text>
          <View className="bg-gradient-to-r from-green-50 to-indigo-50 p-6 rounded-2xl border border-green-100">
            <View className="flex-row items-start">
              <View className="bg-green-500 p-2 rounded-lg mr-4">
                <Ionicons name="bulb-outline" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-green-900 font-semibold mb-2">Performance Summary</Text>
                <Text className="text-green-800 text-sm leading-5">
                  April saw a significant spike in sales with 25% growth. Q4 is showing the best performance in revenue. 
                  Consider reallocating marketing resources toward Q4 campaigns to maximize ROI.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;