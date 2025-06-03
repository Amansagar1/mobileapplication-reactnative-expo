import React, { useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import ReportFilters from "../../components/Reports/ReportFilters";
import ReportDisplay from "../../components/Reports/ReportDisplay";
import { getReportCsv } from "../../webServices/UCIAPIController";

export default function Reports()  {
  const [filters, setFilters] = useState({
    productionLine: "",
    startDate: "",
    endDate: "",
    frequency: "",
  });

  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const productionLines = [
    { id: "GRA", name: "GRA" },
    { id: "GCS", name: "GCS" },
    { id: "SPC", name: "SPC" },
  ];

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDateToLocalISOString = (date) => {
    const pad = (num) => num.toString().padStart(2, "0");
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds())
    );
  };

  const handleSubmit = async () => {
    const { productionLine, startDate, endDate, frequency } = filters;

    if (!productionLine || !startDate || !endDate || !frequency) {
      Alert.alert("Missing Information", "Please fill in all filters.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      Alert.alert("Date Error", "End date must be after start date.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setResponseData(null);

    try {
      const timezone = "America/Chicago";
      const startDateLocal = formatDateToLocalISOString(new Date(startDate));
      const endDateLocal = formatDateToLocalISOString(new Date(endDate));

      const csvString = await getReportCsv(
        productionLine,
        "",
        frequency.toLowerCase(),
        startDateLocal,
        endDateLocal,
        timezone
      );

      if (!csvString) {
        Alert.alert("No Data", "No data returned from server.");
        setIsLoading(false);
        return;
      }

      const lines = csvString.split("\n").filter((line) => line.trim() !== "");

      if (lines.length < 2) {
        Alert.alert("No Data", "No data available for selected inputs.");
        setIsLoading(false);
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim());
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        const row = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] ? values[idx].trim() : "";
        });
        data.push(row);
      }

      setResponseData({
        data,
        variables: headers.filter(
          (h) => !["timestamp", "date", "time"].includes(h.toLowerCase())
        ),
      });
    } catch (err) {
      console.error("API Error:", err);
      setError(`Failed to fetch data: ${err.message}`);
      Alert.alert("Error", `Failed to fetch data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      productionLine: "",
      startDate: "",
      endDate: "",
      frequency: "",
    });
    setResponseData(null);
    setError(null);
  };

  return (
    <View className="flex-1 p-4 bg-white pt-14 h-screen ">
      <ReportFilters
        onApply={handleSubmit}
        filters={filters}
        productionLines={productionLines}
        handleFilterChange={handleFilterChange}
        isLoading={isLoading}
      />

      {error && (
        <View className="bg-red-100 border border-red-400 p-3 rounded mt-4">
          <Text className="text-red-700 font-bold">Error:</Text>
          <Text className="text-red-700">{error}</Text>
        </View>
      )}

      {isLoading && (
        <View className="flex justify-center items-center mt-4">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-2 text-gray-600">Loading data...</Text>
        </View>
      )}

      {!isLoading && responseData && (
        <ReportDisplay
          responseData={responseData}
          filters={filters}
          onReset={resetFilters}
        />
      )}
    </View>
  );
}
