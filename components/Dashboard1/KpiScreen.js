// DashboardScreen.js
import React from 'react';
import { Pressable, ScrollView, Text, View, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ rawData }) => {
  const kpiData = [
    {
      title: 'OEE Month',
      value: `${rawData?.monthly_OEE || 0}`,
      unit: '%',
      icon: 'speedometer',
      gradient: ['#4A90E2', '#6B73FF'],
      trend: rawData?.monthly_trend || 'flat',
    },
    {
      title: 'OEE Day',
      value: `${rawData?.oee || 0}`,
      unit: '%',
      icon: 'calendar',
      gradient: ['#50C9BA', '#6BEA8D'],
      trend: rawData?.daily_trend || 'flat',
    },
    {
      title: 'Previous  OEE',
      value: `${rawData?.previous_OEE || 0}`,
      unit: '%',
      icon: 'refresh',
      gradient: ['#FFB347', '#FFCC33'],
      trend: rawData?.previous_trend || 'flat',
    },
    {
      title: 'Availability',
      value: `${rawData?.availability || 0}`,
      unit: '%',
      icon: 'time',
      gradient: ['#FF5E62', '#FF9966'],
      trend: rawData?.availability_trend || 'flat',
    },
    {
      title: 'Quality',
      value: `${rawData?.quality || 0}`,
      unit: '%',
      icon: 'checkmark-circle',
      gradient: ['#9D50BB', '#6E48AA'],
      trend: rawData?.quality_trend || 'flat',
    },
    {
      title: 'Performance',
      value: `${rawData?.performance || 0}`,
      unit: '%',
      icon: 'trending-up',
      gradient: ['#A18CD1', '#FBC2EB'],
      trend: rawData?.performance_trend || 'flat',
    },
  ];

  const KPICard = ({ item }) => (
    <View className="flex-1 mx-1.5 mb-2 rounded-xl overflow-hidden">
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-4 rounded-xl"
      >
        <View className="flex-row items-center">
          <View>
            <Text className="text-white text-xs font-medium mt-2">{item.title}</Text>
            <View className="flex-row items-end mt-1">
              <Text className="text-white text-xl font-bold">{item.value}</Text>
              <Text className="text-white/70 text-sm font-medium ml-1 mb-1">{item.unit}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <ScrollView className="flex-1 px-5 pt-14" contentContainerStyle={{ paddingBottom: 1 }}>
      {/* Header */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-white">UCI Dashboard</Text>
            <Text className="text-white/70 mt-1 text-sm">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <Pressable
            className="bg-white/10 p-3 rounded-full border border-white/20"
            android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: true }}
          >
            <Ionicons name="notifications" size={22} color="#ffffff" />
            <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></View>
          </Pressable>
        </View>
      </View>

      {/* KPI Cards */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white text-lg font-semibold"></Text>
          <Pressable className="flex-row items-center">
            <Text className="text-white/70 text-sm mr-1">Details</Text>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>

        <View className="flex-row flex-wrap -mx-1.5">
          {kpiData.map((item, index) => (
            <View key={index} style={{ width: width / 2 - 14 }} className="px-1.5">
              <KPICard item={item} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
