import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { DateTime } from "luxon";
import {
  getOverallPerformanceIndex,
  getHisRuntimeDowntime,
} from "../../webServices/UCIAPIController";

import KPICards from "../../components/Dshboard/KPICards";
import ProductionCharts from "../../components/Dshboard/ProductionCharts";
import RuntimeCharts from "../../components/Dshboard/RuntimeCharts";

const DashboardPage = () => {
  const assetNames = ["GRA", "GCS", "SPC"];
  const [overviewData, setOverviewData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Separate date windows for production and runtime charts
  const [productionDateWindowMap, setProductionDateWindowMap] = useState({
    GRA: 0,
    GCS: 0,
    SPC: 0,
  });

  const [runtimeDateWindowMap, setRuntimeDateWindowMap] = useState({
    GRA: 0,
    GCS: 0,
    SPC: 0,
  });

  // Chart data states
  const [chartDataMap, setChartDataMap] = useState({}); // runtime data
  const [plannedChartDataMap, setPlannedChartDataMap] = useState({}); // production data

  // Dummy data fallback
  const dummyChartData = {
    labels: [],
    datasets: [],
  };

  // Helper function to fetch runtime data for a specific asset
  const fetchRuntimeData = async (asset, windowOffset) => {
    const timezone = "America/Chicago";
    const now = DateTime.now().setZone(timezone);

    const from = now
      .minus({ days: 7 * (windowOffset + 1) })
      .startOf("day")
      .toFormat("yyyy-MM-dd HH:mm");

    const to = now
      .minus({ days: 7 * windowOffset })
      .endOf("day")
      .toFormat("yyyy-MM-dd HH:mm");

    try {
      const res = await getHisRuntimeDowntime(asset, from, to, timezone);
      
      if (!res || !res.downTimeData) {
        return dummyChartData;
      }

      // Process runtime data only (res.downTimeData)
      const runtimeGrouped = {};
      res.downTimeData.forEach((item) => {
        const date = DateTime.fromISO(item.timestamp).toFormat("dd/LL");
        if (!runtimeGrouped[date]) {
          runtimeGrouped[date] = { Shift1: null, Shift2: null };
        }
        runtimeGrouped[date][item.shift] = item.downtime;
      });

      const runtimeLabels = Object.keys(runtimeGrouped);
      const shift1Runtime = [];
      const shift2Runtime = [];

      runtimeLabels.forEach((date) => {
        const shifts = runtimeGrouped[date];
        shift1Runtime.push(shifts.Shift1 !== null ? 9.5 - shifts.Shift1 : 0);
        shift2Runtime.push(shifts.Shift2 !== null ? 9.5 - shifts.Shift2 : 0);
      });

      return {
        labels: runtimeLabels,
        datasets: [
          {
            label: "Shift 1",
            data: shift1Runtime,
            backgroundColor: "#047857", 
            barThickness: 16,
            categoryPercentage: 0.6,
            barPercentage: 0.6,
          },
          {
            label: "Shift 2",
            data: shift2Runtime,
            backgroundColor: "#34D399",
            barThickness: 16,
            categoryPercentage: 0.6,
            barPercentage: 0.6,
          },
        ],
      };
    } catch (error) {
      console.error(`Error fetching runtime data for ${asset}:`, error);
      return dummyChartData;
    }
  };

  // Helper function to fetch production data for a specific asset
  const fetchProductionData = async (asset, windowOffset) => {
    const timezone = "America/Chicago";
    const now = DateTime.now().setZone(timezone);

    const from = now
      .minus({ days: 7 * (windowOffset + 1) })
      .startOf("day")
      .toFormat("yyyy-MM-dd HH:mm");

    const to = now
      .minus({ days: 7 * windowOffset })
      .endOf("day")
      .toFormat("yyyy-MM-dd HH:mm");

    try {
      const res = await getHisRuntimeDowntime(asset, from, to, timezone);
      
      if (!res || !res.prodData) {
        return dummyChartData;
      }

      // Process production data only (res.prodData)
      const prodGrouped = {};
      res.prodData.forEach((item) => {
        const date = DateTime.fromISO(item.timestamp).toFormat("dd/LL");
        if (!prodGrouped[date]) {
          prodGrouped[date] = { Shift1: 0, Shift2: 0 };
        }
        prodGrouped[date][item.shift] = item.product_count;
      });

      const prodLabels = Object.keys(prodGrouped);
      const shift1Prod = [];
      const shift2Prod = [];

      prodLabels.forEach((date) => {
        const shifts = prodGrouped[date];
        shift1Prod.push(shifts.Shift1 || 0);
        shift2Prod.push(shifts.Shift2 || 0);
      });

      return {
        labels: prodLabels,
       datasets: [
          {
            label: "Shift 1",
            data: shift1Prod,
            backgroundColor: "#1D4ED8",
            barThickness: 16,
            categoryPercentage: 0.6,
            barPercentage: 0.6,
          },
          {
            label: "Shift 2",
            data: shift2Prod,
            backgroundColor: "#93C5FD",
            barThickness: 16,
            categoryPercentage: 0.6,
            barPercentage: 0.6,
          },
        ],
      };
    } catch (error) {
      console.error(`Error fetching production data for ${asset}:`, error);
      return dummyChartData;
    }
  };

  // Handlers for navigation arrows - now return promises
  const handleProductionNavigate = async (asset, direction) => {
    const newWindowOffset = productionDateWindowMap[asset] + direction;
    
    // Update the window map first
    setProductionDateWindowMap((prev) => ({
      ...prev,
      [asset]: newWindowOffset,
    }));

    // Fetch new data
    const newData = await fetchProductionData(asset, newWindowOffset);
    
    // Update chart data
    setPlannedChartDataMap((prev) => ({
      ...prev,
      [asset]: newData,
    }));
  };

  const handleRuntimeNavigate = async (asset, direction) => {
    const newWindowOffset = runtimeDateWindowMap[asset] + direction;
    
    // Update the window map first
    setRuntimeDateWindowMap((prev) => ({
      ...prev,
      [asset]: newWindowOffset,
    }));

    // Fetch new data
    const newData = await fetchRuntimeData(asset, newWindowOffset);
    
    // Update chart data
    setChartDataMap((prev) => ({
      ...prev,
      [asset]: newData,
    }));
  };

  // Initial load for overall performance index
  useEffect(() => {
    const timezone = "America/Chicago";
    const now = DateTime.now().setZone(timezone);
    const from = now.startOf("day").toFormat("yyyy-MM-dd HH:mm");
    const to = now.set({ hour: 20, minute: 0 }).toFormat("yyyy-MM-dd HH:mm");

    getOverallPerformanceIndex(from, to, timezone)
      .then((performanceData) => {
        if (performanceData && Object.keys(performanceData).length > 0) {
          setOverviewData(performanceData);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching performance index data:", error);
        setIsLoading(false);
      });
  }, []);

  // Initial load for production data
  useEffect(() => {
    const loadInitialProductionData = async () => {
      const productionPromises = assetNames.map(async (asset) => {
        const data = await fetchProductionData(asset, 0);
        return { asset, data };
      });

      const results = await Promise.all(productionPromises);
      
      const newPlannedChartDataMap = {};
      results.forEach(({ asset, data }) => {
        newPlannedChartDataMap[asset] = data;
      });
      
      setPlannedChartDataMap(newPlannedChartDataMap);
    };

    loadInitialProductionData();
  }, []);

  // Initial load for runtime data
  useEffect(() => {
    const loadInitialRuntimeData = async () => {
      const runtimePromises = assetNames.map(async (asset) => {
        const data = await fetchRuntimeData(asset, 0);
        return { asset, data };
      });

      const results = await Promise.all(runtimePromises);
      
      const newChartDataMap = {};
      results.forEach(({ asset, data }) => {
        newChartDataMap[asset] = data;
      });
      
      setChartDataMap(newChartDataMap);
    };

    loadInitialRuntimeData();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#1D4ED8" />
      </View>
    );
  }
  
  return (
    <ScrollView 
      className="bg-gray-100 flex-1 pb-4 pt-14 h-screen"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <KPICards overviewData={overviewData} isLoading={isLoading} />

      <ProductionCharts
        assetNames={assetNames}
        plannedChartDataMap={plannedChartDataMap}
        handleNavigate={handleProductionNavigate}
        dateWindowMap={productionDateWindowMap}
      />

      <RuntimeCharts
        assetNames={assetNames}
        chartDataMap={chartDataMap}
        handleNavigate={handleRuntimeNavigate}
        dateWindowMap={runtimeDateWindowMap}
      />
    </ScrollView>
  );
};

export default DashboardPage;
// DashboardScreen.js
// import React from 'react';
// import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
// import { BarChart, LineChart } from 'react-native-chart-kit';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useAuth } from '../../utils/auth-context';

// const screenWidth = Dimensions.get('window').width;

// const DashboardScreen = () => {
//   const { logout } = useAuth();

//   const lineChartData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
//     datasets: [
//       {
//         data: [120, 160, 140, 200, 180],
//         strokeWidth: 3,
//         color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
//       },
//     ],
//   };

//   const barChartData = {
//     labels: ['Q1', 'Q2', 'Q3', 'Q4'],
//     datasets: [
//       {
//         data: [450, 560, 610, 720],
//       },
//     ],
//   };

//   const kpiData = [
//     {
//       title: 'Revenue',
//       value: '₹12.4K',
//       change: '+12.5%',
//       isPositive: true,
//       bg: 'bg-green-50',
//       iconBg: 'bg-green-500',
//       icon: 'cash-outline',
//     },
//     {
//       title: 'Users',
//       value: '3.2K',
//       change: '+8.2%',
//       isPositive: true,
//       bg: 'bg-green-50',
//       iconBg: 'bg-green-500',
//       icon: 'people-outline',
//     },
//     {
//       title: 'Conversion',
//       value: '2.8%',
//       change: '-0.3%',
//       isPositive: false,
//       bg: 'bg-yellow-50',
//       iconBg: 'bg-yellow-500',
//       icon: 'trending-up-outline',
//     },
//     {
//       title: 'Sessions',
//       value: '8.4K',
//       change: '+15.7%',
//       isPositive: true,
//       bg: 'bg-purple-50',
//       iconBg: 'bg-purple-500',
//       icon: 'analytics-outline',
//     },
//     {
//       title: 'Bounce Rate',
//       value: '38%',
//       change: '-2.1%',
//       isPositive: true,
//       bg: 'bg-red-50',
//       iconBg: 'bg-red-500',
//       icon: 'exit-outline',
//     },
//     {
//       title: 'Avg. Time',
//       value: '2m 45s',
//       change: '+0.5%',
//       isPositive: true,
//       bg: 'bg-indigo-50',
//       iconBg: 'bg-indigo-500',
//       icon: 'time-outline',
//     },
//   ];

//   const KPICard = ({ item }) => (
//     <View className={`${item.bg} p-4 rounded-2xl flex-1 mx-1 mb-3 border border-gray-100`}>
//       <View className="flex-row items-center justify-between mb-3">
//         <View className={`${item.iconBg} p-2 rounded-lg`}>
//           <Ionicons name={item.icon} size={20} color="white" />
//         </View>
//         <View className={`px-2 py-1 rounded-full ${item.isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
//           <Text className={`text-xs font-semibold ${item.isPositive ? 'text-green-600' : 'text-red-600'}`}>
//             {item.change}
//           </Text>
//         </View>
//       </View>
//       <Text className="text-gray-600 text-sm font-medium">{item.title}</Text>
//       <Text className="text-xl font-bold text-gray-800 mt-1">{item.value}</Text>
//     </View>
//   );

//   return (
//     <ScrollView className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-white px-6 pt-14 pb-6 shadow-sm">
//         <View className="flex-row items-center justify-between">
//           <View>
//             <Text className="text-2xl font-bold text-gray-800">Dashboard</Text>
//             <Text className="text-gray-500 mt-1">Welcome back! Here&apos;s your overview</Text>
//           </View>
//           <Pressable 
//             className="bg-green-50 p-3 rounded-full"
//             onPress={() => {/* Add notification handler */}}
//           >
//             <Ionicons name="notifications-outline" size={24} color="#2563EB" />
//           </Pressable>
//         </View>
//       </View>

//       <View className="px-6">
//         {/* KPI Cards Grid */}
//         <View className="mt-6">
//           <Text className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</Text>
//           <View className="flex-row flex-wrap -mx-1">
//             {kpiData.map((item, index) => (
//               <View key={index} className="w-1/2">
//                 <KPICard item={item} />
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Monthly Sales Chart */}
//         <View className="mt-6">
//           <View className="flex-row items-center justify-between mb-4">
//             <Text className="text-lg font-semibold text-gray-800">Monthly Sales</Text>
//             <Pressable className="flex-row items-center">
//               <Text className="text-green-600 text-sm font-medium mr-1">View Details</Text>
//               <Ionicons name="chevron-forward" size={16} color="#2563EB" />
//             </Pressable>
//           </View>
          
//           <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
//             <LineChart
//               data={lineChartData}
//               width={screenWidth - 80}
//               height={220}
//               yAxisLabel="₹"
//               chartConfig={{
//                 backgroundColor: '#ffffff',
//                 backgroundGradientFrom: '#ffffff',
//                 backgroundGradientTo: '#ffffff',
//                 decimalPlaces: 1,
//                 color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
//                 labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
//                 style: {
//                   borderRadius: 16,
//                 },
//                 propsForDots: {
//                   r: '6',
//                   strokeWidth: '3',
//                   stroke: '#2563EB',
//                   fill: '#ffffff',
//                 },
//                 propsForBackgroundLines: {
//                   strokeDasharray: '',
//                   stroke: '#f3f4f6',
//                   strokeWidth: 1,
//                 },
//               }}
//               style={{
//                 borderRadius: 16,
//               }}
//               bezier
//             />
//           </View>
//         </View>

//         {/* Quarterly Performance Chart */}
//         <View className="mt-6">
//           <View className="flex-row items-center justify-between mb-4">
//             <Text className="text-lg font-semibold text-gray-800">Quarterly Performance</Text>
//             <Pressable className="flex-row items-center">
//               <Text className="text-green-600 text-sm font-medium mr-1">View Details</Text>
//               <Ionicons name="chevron-forward" size={16} color="#2563EB" />
//             </Pressable>
//           </View>
          
//           <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
//             <BarChart
//               data={barChartData}
//               width={screenWidth - 80}
//               height={200}
//               yAxisLabel="₹"
//               chartConfig={{
//                 backgroundColor: '#ffffff',
//                 backgroundGradientFrom: '#ffffff',
//                 backgroundGradientTo: '#ffffff',
//                 decimalPlaces: 0,
//                 color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
//                 labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
//                 barPercentage: 0.7,
//                 propsForBackgroundLines: {
//                   strokeDasharray: '',
//                   stroke: '#f3f4f6',
//                   strokeWidth: 1,
//                 },
//               }}
//               style={{
//                 borderRadius: 16,
//               }}
//             />
//           </View>
//         </View>

//         {/* Insights Section */}
//         <View className="mt-6 mb-8">
//           <Text className="text-lg font-semibold text-gray-800 mb-4">Insights</Text>
//           <View className="bg-gradient-to-r from-green-50 to-indigo-50 p-6 rounded-2xl border border-green-100">
//             <View className="flex-row items-start">
//               <View className="bg-green-500 p-2 rounded-lg mr-4">
//                 <Ionicons name="bulb-outline" size={20} color="white" />
//               </View>
//               <View className="flex-1">
//                 <Text className="text-green-900 font-semibold mb-2">Performance Summary</Text>
//                 <Text className="text-green-800 text-sm leading-5">
//                   April saw a significant spike in sales with 25% growth. Q4 is showing the best performance in revenue. 
//                   Consider reallocating marketing resources toward Q4 campaigns to maximize ROI.
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default DashboardScreen;