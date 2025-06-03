import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const kpiKeys = {
  "OEE Month": {
    main: "monthly_OEE",
    gra: "grA_Monthly_OEE",
    gcs: "gcS_Monthly_OEE",
    spc: "spc_Monthly_OEE",
  },
  "OEE Day": {
    main: "oee",
    gra: "grA_OEE",
    gcs: "gcS_OEE",
    spc: "spc_OEE",
  },
  "Previous Day OEE": {
    main: "previous_OEE",
    gra: "grA_prev_OEE",
    gcs: "gcS_prev_OEE",
    spc: "spc_prev_OEE",
  },
  "Availability": {
    main: "availability",
    gra: "grA_Avaialbility",
    gcs: "gcS_Avaialbility",
    spc: "spc_Avaialbility",
  },
  "Quality": {
    main: "quality",
    gra: "grA_Quality",
    gcs: "gcS_Quality",
    spc: "spc_Quality",
  },
  "Performance": {
    main: "performance",
    gra: "grA_Performance",
    gcs: "gcS_Performance",
    spc: "spc_Performance",
  },
};

const KPICards = ({ overviewData, isLoading }) => {
  return (
    <View className="flex-row flex-wrap justify-between mx-2 my-2">
      {Object.keys(kpiKeys).map((label, index) => {
        const mainValue = overviewData[kpiKeys[label]?.main];
        const isPercentage = label !== "Downtime";
        const displayValue =
          mainValue !== undefined && mainValue !== null
            ? isPercentage
              ? `${label ? Math.round(mainValue) : mainValue} %`
              : `${mainValue}`
            : "N/A";

        return (
          <TouchableOpacity
            key={index}
            className="group relative p-2 flex-col items-center justify-center rounded-lg shadow bg-white border-l-4 border-emerald-500 h-24 w-[48%] mb-4"
            activeOpacity={1}
          >
            {/* Tooltip */}
            <View className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black bg-opacity-80 p-3 gap-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 z-50 w-64">
              <Text className="text-white font-bold text-sm">{label}</Text>
              <View className="h-px my-1 bg-gray-400" />
              <View className="flex-row justify-between">
                <Text className="text-white text-xs">
                  <Text>GRA </Text>
                  {overviewData[kpiKeys[label]?.gra] ?? "N/A"}
                </Text>
                <Text className="text-white text-xs">
                  <Text>GCS </Text>
                  {overviewData[kpiKeys[label]?.gcs] ?? "N/A"}
                </Text>
                <Text className="text-white text-xs">
                  <Text>SPC </Text>
                  {overviewData[kpiKeys[label]?.spc] ?? "N/A"}
                </Text>
              </View>
            </View>

            <Text className="text-gray-500 text-sm text-center">
              {isLoading ? (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={100} height={20} />
                </SkeletonPlaceholder>
              ) : (
                label
              )}
            </Text>
            <Text className="text-2xl font-bold text-gray-800 text-center mt-1">
              {isLoading ? (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={60} height={36} />
                </SkeletonPlaceholder>
              ) : (
                displayValue
              )}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default KPICards;