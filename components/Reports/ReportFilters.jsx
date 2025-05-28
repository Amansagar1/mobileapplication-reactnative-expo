import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Filter } from "lucide-react-native";

const ReportFilters = ({
  onApply,
  filters,
  productionLines,
  handleFilterChange,
  isLoading,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPickerType, setCurrentPickerType] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!filters.productionLine) newErrors.productionLine = "This field is required.";
    if (!filters.frequency) newErrors.frequency = "This field is required.";
    if (!filters.startDate) newErrors.startDate = "This field is required.";
    if (!filters.endDate) newErrors.endDate = "This field is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onApply();
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      handleFilterChange(currentPickerType, selectedDate.toISOString());
    }
  };

  const showDatepicker = (type) => {
    setCurrentPickerType(type);
    setShowDatePicker(true);
  };

  return (
    <View className="mb-6">
      <View className="flex-row flex-wrap justify-between gap-y-4">
        {/* Production Line */}
        <View className="w-[48%]">
          <Text className="mb-1 font-bold text-gray-700">Production Line</Text>
          <View
            className={`bg-white border-b-2 ${
              errors.productionLine ? "border-red-500" : "border-green-500"
            }`}
          >
            <Picker
              selectedValue={filters.productionLine}
              onValueChange={(val) => handleFilterChange("productionLine", val)}
              className="h-10"
            >
              <Picker.Item label="Select Production Line" value="" />
              {productionLines.map((line) => (
                <Picker.Item key={line.id} label={line.name} value={line.id} />
              ))}
            </Picker>
          </View>
          {errors.productionLine && (
            <Text className="text-red-500 text-xs mt-1">{errors.productionLine}</Text>
          )}
        </View>

        {/* Frequency */}
        <View className="w-[48%]">
          <Text className="mb-1 font-bold text-gray-700">Frequency</Text>
          <View
            className={`bg-white border-b-2 ${
              errors.frequency ? "border-red-500" : "border-green-500"
            }`}
          >
            <Picker
              selectedValue={filters.frequency}
              onValueChange={(val) => {
                const formatted = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
                handleFilterChange("frequency", formatted);
              }}
              className="h-10"
            >
              <Picker.Item label="Select Frequency" value="" />
              <Picker.Item label="Hourly" value="Hourly" />
              <Picker.Item label="Daily" value="Daily" />
              <Picker.Item label="Weekly" value="Weekly" />
              <Picker.Item label="Monthly" value="Monthly" />
            </Picker>
          </View>
          {errors.frequency && (
            <Text className="text-red-500 text-xs mt-1">{errors.frequency}</Text>
          )}
        </View>

        {/* Start Date */}
        <View className="w-[48%]">
          <Text className="mb-1 font-bold text-gray-700">Start Date</Text>
          <TouchableOpacity
            onPress={() => showDatepicker("startDate")}
            className={`bg-white justify-center py-2 border-b-2 ${
              errors.startDate ? "border-red-500" : "border-green-500"
            }`}
          >
            <Text>
              {filters.startDate
                ? new Date(filters.startDate).toLocaleDateString()
                : "Select start date"}
            </Text>
          </TouchableOpacity>
          {errors.startDate && (
            <Text className="text-red-500 text-xs mt-1">{errors.startDate}</Text>
          )}
        </View>

        {/* End Date */}
        <View className="w-[48%]">
          <Text className="mb-1 font-bold text-gray-700">End Date</Text>
          <TouchableOpacity
            onPress={() => showDatepicker("endDate")}
            className={`bg-white justify-center py-2 border-b-2 ${
              errors.endDate ? "border-red-500" : "border-green-500"
            }`}
          >
            <Text>
              {filters.endDate
                ? new Date(filters.endDate).toLocaleDateString()
                : "Select end date"}
            </Text>
          </TouchableOpacity>
          {errors.endDate && (
            <Text className="text-red-500 text-xs mt-1">{errors.endDate}</Text>
          )}
        </View>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={filters[currentPickerType] ? new Date(filters[currentPickerType]) : new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Apply Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isLoading}
        className={`bg-blue-600 rounded py-3 mt-6 items-center ${
          isLoading ? "opacity-50" : ""
        }`}
      >
        <View className="flex-row items-center justify-center space-x-2">
          <Filter color="white" size={20} />
          <Text className="text-white font-bold">Apply</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ReportFilters;
