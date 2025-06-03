import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import AutomationDetails from '../../pages/AutomationDetails';

export default function AutomationScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        className="pt-16 pb-6 px-6 rounded-b-3xl shadow-lg"
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-white">Automation Dashboard</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity>
              <Feather name="bell" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="settings" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row justify-between mb-2">
          <StatCard 
            icon="rocket-launch" 
            value="124" 
            label="Automations" 
            color="bg-indigo-400" 
            iconColor="text-indigo-200"
          />
          <StatCard 
            icon="check-circle" 
            value="98%" 
            label="Success Rate" 
            color="bg-emerald-400" 
            iconColor="text-emerald-200"
          />
          <StatCard 
            icon="clock" 
            value="2.4s" 
            label="Avg Runtime" 
            color="bg-amber-400" 
            iconColor="text-amber-200"
          />
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View className="px-6 -mt-6">
        {/* Status Overview */}
        <View className="bg-white rounded-2xl p-5 shadow-md mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">System Overview</Text>
            <View className="flex-row items-center bg-green-50 px-3 py-1 rounded-full">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-2"></View>
              <Text className="text-sm text-green-700">All systems operational</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between">
            <MiniCard 
              icon="update" 
              title="Last Deployed" 
              value="Invoice Extractor" 
              subValue="May 12, 2025"
            />
            <MiniCard 
              icon="sync" 
              title="Recent Run" 
              value="Bot #84921" 
              subValue="Success"
              statusColor="text-green-500"
            />
            <MiniCard 
              icon="trending-up" 
              title="Performance" 
              value="+12%" 
              subValue="vs last week"
              statusColor="text-green-500"
            />
          </View>
        </View>

        {/* Recent Activity Section */}
        <SectionHeader 
          title="Recent Activity" 
          action="View All" 
          icon="history"
        />
        
        <View className="bg-white rounded-2xl p-5 shadow-md mb-6">
          {[
            { 
              id: 1, 
              name: 'Email Parser', 
              status: 'success', 
              time: '1.2s', 
              date: '10:42 AM', 
              icon: 'email' 
            },
            { 
              id: 2, 
              name: 'Data Clean', 
              status: 'failed', 
              time: '0.8s', 
              date: '09:15 AM', 
              icon: 'database' 
            },
            { 
              id: 3, 
              name: 'PDF Export', 
              status: 'success', 
              time: '1.5s', 
              date: '08:30 AM', 
              icon: 'file-pdf' 
            },
          ].map(item => (
            <ActivityItem key={item.id} item={item} />
          ))}
        </View>

        {/* Scheduled Automations */}
        <SectionHeader 
          title="Scheduled Automations" 
          action="Manage" 
          icon="calendar-clock"
        />
        
        <View className="bg-white rounded-2xl p-5 shadow-md mb-6">
          {[
            { 
              id: 1, 
              name: 'InvoiceBot', 
              nextRun: 'May 30, 8:00 AM', 
              frequency: 'Daily', 
              icon: 'file-invoice-dollar' 
            },
            { 
              id: 2, 
              name: 'LeadSync', 
              nextRun: 'May 31, 9:00 AM', 
              frequency: 'Weekly', 
              icon: 'users' 
            },
            { 
              id: 3, 
              name: 'Email Cleanup', 
              nextRun: 'Jun 1, 12:00 AM', 
              frequency: 'Monthly', 
              icon: 'broom' 
            },
          ].map(item => (
            <ScheduleItem key={item.id} item={item} />
          ))}
        </View>

        {/* Performance Metrics */}
        <SectionHeader 
          title="Performance Trends" 
          action="Detailed Report" 
          icon="chart-line"
        />
        
        <View className="bg-white rounded-2xl p-5 shadow-md mb-6">
          <View className="flex-row justify-between mb-4">
            <MetricPill value="98%" label="Today" trend="up" />
            <MetricPill value="96%" label="Yesterday" trend="down" />
            <MetricPill value="97.5%" label="7-day Avg" trend="up" />
          </View>
          
          <View className="border-b border-gray-100 pb-2 mb-3 flex-row justify-between">
            <Text className="w-1/4 font-medium text-gray-500">Date</Text>
            <Text className="w-1/4 font-medium text-gray-500 text-right">Success</Text>
            <Text className="w-1/4 font-medium text-gray-500 text-right">Avg Time</Text>
            <Text className="w-1/4 font-medium text-gray-500 text-right">Volume</Text>
          </View>
          
          {[
            { date: 'May 27', success: '99%', avgTime: '2.0s', volume: '1,842' },
            { date: 'May 26', success: '96%', avgTime: '2.3s', volume: '1,765' },
            { date: 'May 25', success: '98%', avgTime: '2.1s', volume: '1,921' },
          ].map((item, index) => (
            <View key={index} className="flex-row justify-between py-3 border-b border-gray-50">
              <Text className="w-1/4 font-medium text-gray-700">{item.date}</Text>
              <Text className="w-1/4 text-right font-medium text-green-600">{item.success}</Text>
              <Text className="w-1/4 text-right text-gray-600">{item.avgTime}</Text>
              <Text className="w-1/4 text-right text-gray-600">{item.volume}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* AutomationDetails Component */}
      <AutomationDetails />
    </ScrollView>
  );
}

// Reusable Component: Stat Card
function StatCard({ icon, value, label, color, iconColor }) {
  return (
    <View className={`${color} rounded-xl p-4 w-[30%] shadow-sm`}>
      <View className={`${iconColor} bg-white bg-opacity-20 w-10 h-10 rounded-full items-center justify-center mb-2`}>
        <FontAwesome5 name={icon} size={16} color="white" />
      </View>
      <Text className="text-white text-xl font-bold">{value}</Text>
      <Text className="text-white text-opacity-80 text-xs">{label}</Text>
    </View>
  );
}

// Reusable Component: Mini Card
function MiniCard({ icon, title, value, subValue, statusColor = 'text-gray-600' }) {
  return (
    <View className="w-[30%]">
      <View className="flex-row items-center mb-1">
        <MaterialIcons name={icon} size={16} color="#6B7280" className="mr-1" />
        <Text className="text-xs text-gray-500">{title}</Text>
      </View>
      <Text className="text-sm font-medium text-gray-800">{value}</Text>
      <Text className={`text-xs ${statusColor}`}>{subValue}</Text>
    </View>
  );
}

// Reusable Component: Section Header
function SectionHeader({ title, action, icon }) {
  return (
    <View className="flex-row justify-between items-center mb-3">
      <View className="flex-row items-center">
        <FontAwesome5 name={icon} size={16} color="#4F46E5" className="mr-2" />
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
      </View>
      <TouchableOpacity>
        <Text className="text-sm text-indigo-600">{action}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Reusable Component: Activity Item
function ActivityItem({ item }) {
  const statusColor = item.status === 'success' ? 'text-green-500' : 'text-red-500';
  const statusIcon = item.status === 'success' ? 'check-circle' : 'error';
  
  return (
    <View className="flex-row py-3 border-b border-gray-100 items-center">
      <View className="bg-indigo-50 w-10 h-10 rounded-full items-center justify-center mr-3">
        <MaterialIcons name={item.icon} size={18} color="#4F46E5" />
      </View>
      <View className="flex-1">
        <Text className="font-medium text-gray-800">{item.name}</Text>
        <Text className="text-xs text-gray-500">{item.date}</Text>
      </View>
      <View className="items-end">
        <View className="flex-row items-center">
          <MaterialIcons name={statusIcon} size={16} className={`mr-1 ${statusColor}`} />
          <Text className={`text-sm ${statusColor}`}>{item.status}</Text>
        </View>
        <Text className="text-xs text-gray-500">{item.time}</Text>
      </View>
    </View>
  );
}

// Reusable Component: Schedule Item
function ScheduleItem({ item }) {
  return (
    <View className="flex-row py-3 border-b border-gray-100 items-center">
      <View className="bg-purple-50 w-10 h-10 rounded-full items-center justify-center mr-3">
        <FontAwesome5 name={item.icon} size={16} color="#7C3AED" />
      </View>
      <View className="flex-1">
        <Text className="font-medium text-gray-800">{item.name}</Text>
        <Text className="text-xs text-gray-500">Next: {item.nextRun}</Text>
      </View>
      <View className="bg-gray-100 px-2 py-1 rounded-full">
        <Text className="text-xs text-gray-700">{item.frequency}</Text>
      </View>
    </View>
  );
}

// Reusable Component: Metric Pill
function MetricPill({ value, label, trend }) {
  const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';
  const trendIcon = trend === 'up' ? 'arrow-upward' : 'arrow-downward';
  
  return (
    <View className="items-center">
      <View className="flex-row items-center">
        <Text className="text-lg font-bold text-gray-800 mr-1">{value}</Text>
        <MaterialIcons name={trendIcon} size={16} className={trendColor} />
      </View>
      <Text className="text-xs text-gray-500">{label}</Text>
    </View>
  );
}