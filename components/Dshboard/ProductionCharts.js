import React, { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Modal, Pressable, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { DateTime } from 'luxon';

const screenWidth = Dimensions.get("window").width;

// Function to get chart configuration
const getProductionChartConfig = (showLegend = false) => ({
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
  propsForBackgroundLines: {
    stroke: "#E5E7EB",
    strokeWidth: 1,
  },
  propsForLabels: {
    fontSize: 10,
  },
  barPercentage: 0.6,
  fillShadowGradient: "#ffffff",
  fillShadowGradientOpacity: 1,
});

const ProductionCharts = ({
  assetNames,
  plannedChartDataMap,
  handleNavigate,
  dateWindowMap = {},
}) => {
  const [activeAsset, setActiveAsset] = useState(null);
  const [loadingAssets, setLoadingAssets] = useState(new Set());

  const handleAssetNavigate = async (asset, direction) => {
    setLoadingAssets(prev => new Set([...prev, asset]));
    try {
      await handleNavigate(asset, direction);
    } finally {
      setLoadingAssets(prev => {
        const newSet = new Set(prev);
        newSet.delete(asset);
        return newSet;
      });
    }
  };

  const isAtCurrentDate = (asset) => (dateWindowMap?.[asset] || 0) === 0;
  const isLoading = (asset) => loadingAssets.has(asset);

  const LoadingSpinner = ({ size = 20 }) => (
    <ActivityIndicator size={size} color="#1D4ED8" />
  );

  const NavigationButtons = ({ asset, size = 20, showInModal = false }) => (
    <View 
      className={`flex-row gap-1 ${showInModal ? 'mb-2' : ''}`}
      style={{ minWidth: 50 }}
    >
      <Pressable
        onPress={() => handleAssetNavigate(asset, 1)}
        disabled={isLoading(asset)}
        className={`p-1 ${isLoading(asset) ? 'opacity-50' : ''}`}
      >
        <AntDesign name="left" size={size} color="#3B82F6" />
      </Pressable>
      
      <Pressable
        onPress={() => handleAssetNavigate(asset, -1)}
        disabled={isAtCurrentDate(asset) || isLoading(asset)}
        className={`p-1 ${isAtCurrentDate(asset) || isLoading(asset) ? 'opacity-30' : ''}`}
      >
        <AntDesign name="right" size={size} color="#3B82F6" />
      </Pressable>
    </View>
  );

  const prepareChartData = (asset) => {
    const data = plannedChartDataMap?.[asset];
    if (!data || !data.datasets || !Array.isArray(data.datasets)) {
      return null;
    }

    // Transform data for react-native-chart-kit
    const chartData = {
      labels: data.labels || [],
      datasets: [
        {
          data: data.datasets.length > 0 ? (data.datasets[0]?.data || []) : [],
          colors: data.datasets.length > 0 ? 
            (data.datasets[0]?.data || []).map(() => (opacity = 1) => `rgba(4, 120, 87, ${opacity})`) : // Green for Shift 1
            []
        }
      ]
    };

    // If there's a second dataset (Shift 2), we need to handle it differently
    // react-native-chart-kit doesn't support multiple datasets in bar charts easily
    // So we'll combine them or show them separately
    if (data.datasets.length > 1) {
      // For now, let's show both datasets combined
      const combinedData = [];
      const maxLength = Math.max(
        data.datasets[0]?.data?.length || 0,
        data.datasets[1]?.data?.length || 0
      );

      for (let i = 0; i < maxLength; i++) {
        const shift1Value = data.datasets[0]?.data?.[i] || 0;
        const shift2Value = data.datasets[1]?.data?.[i] || 0;
        combinedData.push(shift1Value + shift2Value); // Stack them
      }

      chartData.datasets[0].data = combinedData;
    }

    return chartData;
  };

  const renderChart = (asset, height = 130, showLegend = false, showInModal = false) => {
    const data = plannedChartDataMap?.[asset];
    if (!data || isLoading(asset)) {
      return (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item height={height} width="100%" borderRadius={4} />
        </SkeletonPlaceholder>
      );
    }

    const chartData = prepareChartData(asset);
    if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
      return (
        <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#666' }}>No data available</Text>
        </View>
      );
    }

    return (
      <BarChart
        data={chartData}
        width={screenWidth - (showInModal ? 40 : 32)}
        height={height}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={getProductionChartConfig(showLegend)}
        verticalLabelRotation={0}
        fromZero
        showBarTops={false}
        withInnerLines={true}
        style={{
          marginVertical: 8,
          borderRadius: 4,
        }}
      />
    );
  };

  const renderTable = (asset, isModal = false) => {
    if (isLoading(asset)) {
      return (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item height={20} width="100%" marginBottom={8} />
          <SkeletonPlaceholder.Item height={20} width="100%" marginBottom={8} />
        </SkeletonPlaceholder>
      );
    }

    const data = plannedChartDataMap?.[asset];
    if (!data || !data.datasets) return null;

    return (
      <View className="mt-2">
        {/* Table Header */}
        <View className="flex-row bg-gray-100 border border-gray-300">
          <View className="w-16 border-r border-gray-300 p-1">
            <Text className="text-xs font-bold">Shift</Text>
          </View>
          {(data?.labels || []).map((label, idx) => (
            <View key={idx} className="flex-1 border-r border-gray-300 p-1 items-center">
              <Text className="text-xs">{label}</Text>
            </View>
          ))}
        </View>
        
        {/* Table Rows */}
        {(data?.datasets || []).map((dataset, dsIdx) => (
          <View 
            key={dsIdx} 
            className="flex-row border-b border-l border-r border-gray-300"
            style={{ backgroundColor: dataset?.backgroundColor || (dsIdx === 0 ? '#047857' : '#34D399') }}
          >
            <View className="w-16 border-r border-gray-300 p-1">
              <Text className="text-xs font-bold text-white">
                {dataset?.label?.trim() === "Shift 1" ? "1" : dataset?.label?.trim() === "Shift 2" ? "2" : dataset?.label || (dsIdx + 1)}
              </Text>
            </View>
            {(dataset?.data || []).map((val, idx) => (
              <View key={idx} className="flex-1 border-r border-gray-300 p-1 items-center">
                <Text className="text-xs text-white">{typeof val === 'number' ? val.toFixed(2) : '0.00'}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <>
      <ScrollView className="mb-4">
        <View className="flex-row flex-wrap justify-between mx-2">
          {assetNames.map((asset) => (
            <Pressable
              key={asset}
              className="bg-white p-2 rounded shadow mb-4 w-full md:w-[48%]"
              onPress={() => setActiveAsset(asset)}
            >
              {/* Loading overlay */}
              {isLoading(asset) && (
                <View className="absolute inset-0 bg-white bg-opacity-75 items-center justify-center z-10 rounded">
                  <View className="items-center gap-2">
                    <LoadingSpinner size={24} />
                    <Text className="text-sm text-gray-600">Loading...</Text>
                  </View>
                </View>
              )}

              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center flex-wrap">
                  <Text className="font-bold text-gray-700 text-sm mr-2">
                    {asset} - Production
                  </Text>
                  
                  {/* Legend */}
                  <View className="flex-row flex-wrap">
                    {plannedChartDataMap?.[asset]?.datasets?.map((dataset, idx) => (
                      <View key={idx} className="flex-row items-center mr-2">
                        <View 
                          className="w-3 h-3 rounded-sm mr-1"
                          style={{ backgroundColor: dataset?.backgroundColor || (idx === 0 ? '#047857' : '#34D399') }}
                        />
                        <Text className="text-xs text-gray-600">{dataset?.label || `Shift ${idx + 1}`}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <NavigationButtons asset={asset} size={16} />
              </View>

              {/* Chart */}
              <View className="h-32 mb-2">
                {renderChart(asset, 130, false, false)}
              </View>

              {/* Table */}
              {renderTable(asset)}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={!!activeAsset}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setActiveAsset(null)}
      >
        <View className="flex-1 p-4 bg-white">
          {activeAsset && (
            <>
              {/* Header with close button */}
              <View className="flex-row justify-between items-center mb-4">
                <Text className="font-bold text-lg">{activeAsset} - Production</Text>
                <Pressable onPress={() => setActiveAsset(null)}>
                  <MaterialIcons name="close" size={24} color="black" />
                </Pressable>
              </View>

              {/* Loading overlay */}
              {isLoading(activeAsset) && (
                <View className="absolute inset-0 bg-white bg-opacity-75 items-center justify-center z-10">
                  <View className="items-center gap-2">
                    <LoadingSpinner size={32} />
                    <Text className="text-lg text-gray-600">Loading data...</Text>
                  </View>
                </View>
              )}

              {/* Navigation buttons */}
              <View className="items-end mb-2">
                <NavigationButtons asset={activeAsset} size={24} showInModal={true} />
              </View>

              {/* Chart */}
              <View className="h-80 mb-4">
                {renderChart(activeAsset, 300, true, true)}
              </View>

              {/* Table */}
              <ScrollView>
                {renderTable(activeAsset, true)}
              </ScrollView>
            </>
          )}
        </View>
      </Modal>
    </>
  );
};

export default ProductionCharts;