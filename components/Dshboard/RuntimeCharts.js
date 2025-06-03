import React, { useState } from "react";
import { View, Text, ScrollView,Pressable, Modal, ActivityIndicator, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

// Mocking skeleton component
const Skeleton = ({ height, width, count = 1 }) => {
  return Array.from({ length: count }).map((_, i) => (
    <View key={i} className="bg-gray-200 rounded mb-2" style={{ height, width }} />
  ));
};

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 1,
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
  propsForLabels: {
    fontSize: 10,
  },
  barPercentage: 0.8,
  fillShadowGradient: "#ffffff",
  fillShadowGradientOpacity: 1,
};

const RuntimeCharts = ({ assetNames, chartDataMap, handleNavigate, dateWindowMap }) => {
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

  const LoadingSpinner = ({ size = "large" }) => (
    <ActivityIndicator size={size} color="#1D4ED8" />
  );

  const NavigationButtons = ({ asset, size = 24, showInModal = false }) => (
    <View className={`flex flex-row gap-1 ${showInModal ? 'mb-2' : ''}`}>
      <Pressable
        onPress={() => handleAssetNavigate(asset, 1)}
        disabled={isLoading(asset)}
        className={`p-1 ${isLoading(asset) ? "opacity-50" : ""}`}
      >
        <AntDesign name="left" size={size} color="#3B82F6" />
      </Pressable>

      <Pressable
        onPress={() => handleAssetNavigate(asset, -1)}
        disabled={isAtCurrentDate(asset) || isLoading(asset)}
        className={`p-1 ${isAtCurrentDate(asset) || isLoading(asset) ? "opacity-30" : ""}`}
      >
        <AntDesign name="right" size={size} color="#3B82F6" />
      </Pressable>
    </View>
  );

  const prepareChartData = (asset) => {
    const data = chartDataMap?.[asset];
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

    // If there's a second dataset (Shift 2), combine the data
    if (data.datasets.length > 1) {
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

  const renderTable = (asset, isModal = false) => {
    if (!chartDataMap[asset] || isLoading(asset)) {
      return (
        <View className="mt-2">
          <Skeleton height={40} width="100%" count={3} />
        </View>
      );
    }

    const data = chartDataMap[asset];
    if (!data.datasets || !Array.isArray(data.datasets)) return null;

    return (
      <ScrollView horizontal className="mt-2">
        <View className="border border-gray-300 ">
          {/* Header */}
          <View className="flex-row bg-gray-100 border-b border-gray-400">
            <View className="w-20 border-r border-gray-400 p-1">
              <Text className="text-xs font-bold">Shift</Text>
            </View>
            {data?.labels?.map((label, idx) => (
              <View key={idx} className="w-16 border-r border-gray-400 p-1 items-center">
                <Text className="text-xs">{label}</Text>
              </View>
            ))}
          </View>

          {/* Rows */}
          {data?.datasets?.map((dataset, dsIdx) => (
            <View
              key={dsIdx}
              className="flex-row border-b border-gray-300"
              style={{ backgroundColor: dataset?.backgroundColor || (dsIdx === 0 ? '#047857' : '#34D399') }}
            >
              <View className="w-20 border-r border-gray-400 p-1">
                <Text className="text-xs text-white font-bold">
                  {dataset?.label === "Shift 1" ? "1" : dataset?.label === "Shift 2" ? "2" : dataset?.label || (dsIdx + 1)}
                </Text>
              </View>
              {(dataset?.data || []).map((val, idx) => (
                <View key={idx} className="w-16 border-r border-gray-400 p-1 items-center">
                  <Text className="text-xs text-white">{typeof val === 'number' ? val.toFixed(2) : '0.00'}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      <ScrollView className="mb-4 w-full">
        <View className="flex-row flex-wrap justify-between mx-2 ">
          {assetNames.map((asset) => (
             <Pressable
              key={asset}
              className="bg-white p-2 rounded shadow"
              onPress={() => setActiveAsset(asset)}
              activeOpacity={0.9}
            >
              {/* Loading overlay for entire card */}
              {isLoading(asset) && (
                <View className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded">
                  <View className="flex flex-col items-center gap-2">
                    <LoadingSpinner />
                    <Text className="text-sm text-gray-600">Loading...</Text>
                  </View>
                </View>
              )}

              <View className="flex-row justify-between items-center mb-1">
                <View className="flex-row gap-2 items-center">
                  <Text className="font-bold text-gray-700 text-sm">
                    {asset} - Runtime (Hrs)
                  </Text>
                  <View className="flex-row items-center gap-2">
                    {chartDataMap[asset]?.datasets?.map((dataset, idx) => (
                      <View key={idx} className="flex-row items-center gap-1">
                        <View
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: dataset?.backgroundColor || (idx === 0 ? '#047857' : '#34D399') }}
                        />
                        <Text className="text-xs text-gray-600">{dataset?.label || `Shift ${idx + 1}`}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <NavigationButtons asset={asset} />
              </View>

              <View className="h-40 mb-2 ">
                {chartDataMap[asset] && !isLoading(asset) ? (
                  (() => {
                    const chartData = prepareChartData(asset);
                    return chartData ? (
                      <BarChart
                        data={chartData}
                        width={screenWidth - 32}
                        height={160}
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        fromZero
                        showBarTops={false}
                        withInnerLines={false}
                        style={{
                          marginVertical: 8,
                          borderRadius: 16,
                        }}
                      />
                    ) : (
                      <View style={{ height: 120, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#666' }}>No data available</Text>
                      </View>
                    );
                  })()
                ) : (
                  <Skeleton height={120} />
                )}
              </View>

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
            <View className="flex-1">
              {/* Loading overlay for modal */}
              {isLoading(activeAsset) && (
                <View className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <View className="flex flex-col items-center gap-2">
                    <LoadingSpinner />
                    <Text className="text-lg text-gray-600">Loading data...</Text>
                  </View>
                </View>
              )}

              <View className="flex-row justify-between items-center mb-4">
                <Text className="font-bold text-lg">
                  {activeAsset} - Runtime (Hrs)
                </Text>
                <View className="flex-row items-center gap-4">
                  <NavigationButtons asset={activeAsset} size={28} showInModal={true} />
                  <Pressable onPress={() => setActiveAsset(null)}>
                    <MaterialIcons name="close" size={24} color="black" />
                  </Pressable>
                </View>
              </View>

              <View className="h-96 mb-4">
                {chartDataMap[activeAsset] && !isLoading(activeAsset) ? (
                  (() => {
                    const chartData = prepareChartData(activeAsset);
                    return chartData ? (
                      <BarChart
                        data={chartData}
                        width={screenWidth - 32}
                        height={400}
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        fromZero
                        showBarTops={false}
                        withInnerLines={false}
                        style={{
                          marginVertical: 8,
                          borderRadius: 16,
                        }}
                      />
                    ) : (
                      <View style={{ height: 400, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#666' }}>No data available</Text>
                      </View>
                    );
                  })()
                ) : (
                  <Skeleton height={400} />
                )}
              </View>

              {renderTable(activeAsset, true)}
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

export default RuntimeCharts;