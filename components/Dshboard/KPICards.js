import React from "react";
import { View, Text, Pressable } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const kpiKeys = {
  "OEE Month": {
    main: "monthly_OEE",
    gra: "grA_Monthly_OEE",
    gcs: "gcS_Monthly_OEE",
    spc: "spc_Monthly_OEE",
    icon: "calendar-month",
    iconColor: "#4F46E5",
    cardBgColor: "#EEF2FF", // light indigo
  },
  "OEE Day": {
    main: "oee",
    gra: "grA_OEE",
    gcs: "gcS_OEE",
    spc: "spc_OEE",
    icon: "calendar-today",
    iconColor: "#10B981",
    cardBgColor: "#ECFDF5", // light emerald
  },
  "Previous Day OEE": {
    main: "previous_OEE",
    gra: "grA_prev_OEE",
    gcs: "gcS_prev_OEE",
    spc: "spc_prev_OEE",
    icon: "chart-line",
    iconColor: "#F59E0B",
    cardBgColor: "#FFFBEB", // light amber
  },
  "Availability": {
    main: "availability",
    gra: "grA_Avaialbility",
    gcs: "gcS_Avaialbility",
    spc: "spc_Avaialbility",
    icon: "check-circle",
    iconColor: "#3B82F6",
    cardBgColor: "#EFF6FF", // light blue
  },
  "Quality": {
    main: "quality",
    gra: "grA_Quality",
    gcs: "gcS_Quality",
    spc: "spc_Quality",
    icon: "medal",
    iconColor: "#EC4899",
    cardBgColor: "#FDF2F8", // light pink
  },
  "Performance": {
    main: "performance",
    gra: "grA_Performance",
    gcs: "gcS_Performance",
    spc: "spc_Performance",
    icon: "speedometer",
    iconColor: "#6366F1",
    cardBgColor: "#EEF2FF", // soft indigo
  },
};


const KPICards = ({ overviewData, isLoading }) => {
  return (
    <View className="flex-row flex-wrap justify-between px-3 py-2 bg-slate-50">
      {Object.keys(kpiKeys).map((label, index) => {
        const { main, gra, gcs, spc, icon, iconColor, cardBgColor } = kpiKeys[label];
        const mainValue = overviewData[main];

        const isPercentage = label !== "Downtime";
        const displayValue =
          mainValue !== undefined && mainValue !== null
            ? isPercentage
              ? `${Math.round(mainValue)}%`
              : `${mainValue}`
            : "N/A";

        return (
          <Pressable
            key={index}
            className="relative w-[48%] mb-4 bg-white rounded-2xl px-4 py-4 shadow-sm border border-slate-200"
             style={{ backgroundColor: cardBgColor }}
          >
            {/* Icon */}
            <View
              className="absolute top-4 right-4 w-9 h-9 rounded-xl justify-center items-center"
              style={{ backgroundColor: `${iconColor}20` }}
            >
              <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
            </View>

            {/* Label */}
            <Text className="text-slate-500 text-[13px] font-medium">
              {isLoading ? (
                <SkeletonPlaceholder backgroundColor="#E2E8F0">
                  <SkeletonPlaceholder.Item width={80} height={14} />
                </SkeletonPlaceholder>
              ) : (
                label
              )}
            </Text>

            {/* Value */}
            <View className="mt-2">
              <Text className="text-[26px] font-bold text-slate-800">
                {isLoading ? (
                  <SkeletonPlaceholder backgroundColor="#E2E8F0">
                    <SkeletonPlaceholder.Item width={70} height={28} />
                  </SkeletonPlaceholder>
                ) : (
                  displayValue
                )}
              </Text>

              
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default KPICards;
