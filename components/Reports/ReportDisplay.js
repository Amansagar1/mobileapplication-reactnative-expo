import * as FileSystem from "expo-file-system";
import { Alert, View, Text, ScrollView, TouchableOpacity } from "react-native";

// Constants
const COLUMN_WIDTH = 150;

// Utility Functions
function formatDateOnly(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function formatTime(timeStr) {
  const d = new Date(timeStr);
  if (isNaN(d)) return timeStr;
  return d.toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDowntime(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}


const desiredColumnOrder = [
  "Start_Date",
  "Start_Time",
  "End_Date",
  "End_Time",
  "Product_Count",
  "Ok_Quantity",
  "Rejected_Quantity",
  "Downtime",
  "OEE",
  "Quality",
  "Performance",
  "Availability",
];

// CSV cell escaping helper
const escapeCSV = (value) => {
  if (value === null || value === undefined) return "";
  // Convert to string, escape inner quotes by doubling them
  return `"${String(value).replace(/"/g, '""')}"`;
};

const ReportDisplay = ({ responseData, filters }) => {
  const { data = [], variables = [] } = responseData;

  const downloadCSV = async () => {
    if (!data?.length) return;

    const formattedStartDate = filters.startDate.replace(/-/g, "");
    const formattedEndDate = filters.endDate.replace(/-/g, "");
    const csvHeaders = desiredColumnOrder;

    const csvRows = data.map((row) =>
      desiredColumnOrder
        .map((col) => {
          if (col === "Start_Date") return escapeCSV(row.Date ? formatDateOnly(row.Date) : "");
          if (col === "End_Date") return escapeCSV(row.timestamp ? formatDateOnly(row.timestamp) : "");
          if (col === "Start_Time" || col === "End_Time") return escapeCSV(row[col] ? formatTime(row[col]) : "");
          if (col === "Downtime") return escapeCSV(formatDowntime(Number(row[col]) || 0));
          return escapeCSV(row[col] ?? "");
        })
        .join(",")
    );

    const totals = {
      Product_Count: 0,
      Ok_Quantity: 0,
      Rejected_Quantity: 0,
      Downtime: 0,
    };

    data.forEach((row) => {
      totals.Product_Count += Number(row.Product_Count) || 0;
      totals.Ok_Quantity += Number(row.Ok_Quantity) || 0;
      totals.Rejected_Quantity += Number(row.Rejected_Quantity) || 0;
      totals.Downtime += Number(row.Downtime) || 0;
    });

    const totalRow = desiredColumnOrder
      .map((col) => {
        if (col === "Product_Count") return escapeCSV(`Total = ${totals.Product_Count}`);
        if (col === "Ok_Quantity") return escapeCSV(`Total = ${totals.Ok_Quantity}`);
        if (col === "Rejected_Quantity") return escapeCSV(`Total = ${totals.Rejected_Quantity}`);
        if (col === "Downtime") return escapeCSV(`Total = ${formatDowntime(totals.Downtime)}`);
        return escapeCSV("");
      })
      .join(",");

    // BOM for Excel UTF-8 recognition
    const BOM = "\uFEFF";

    const csvContent = BOM + [csvHeaders.map(escapeCSV).join(","), ...csvRows, totalRow].join("\n");

    try {
      const fileUri =
        FileSystem.documentDirectory + `report_${formattedStartDate}_to_${formattedEndDate}.csv`;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      Alert.alert(
        "File saved",
        `Report saved locally at:\n${fileUri}\n\nYou can access it using a file manager app.`
      );
    } catch (error) {
      console.error("Error saving CSV:", error);
      Alert.alert("Error", "Failed to save the report locally.");
    }
  };

  return (
    <View className="px-4 mt-2 flex-1">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">Report Data</Text>
      </View>

      {/* Filter Summary */}
      <View className="mb-4">
        <Text>Production Line: {filters.productionLine}</Text>
        <Text>Frequency: {filters.frequency}</Text>
        <Text>
          Date Range: {new Date(filters.startDate).toLocaleDateString()} -{" "}
          {new Date(filters.endDate).toLocaleDateString()}
        </Text>
              {/* Download Button */}
      <TouchableOpacity
        onPress={downloadCSV}
        className="w-full bg-green-600 p-3 mt-2 rounded items-center"
      >
        <Text className="text-white font-bold">Download</Text>
      </TouchableOpacity>
      </View>

      {/* Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View
          className="border border-gray-300 rounded-md bg-white overflow-hidden max-h-[600px]"
          style={{ minWidth: COLUMN_WIDTH * desiredColumnOrder.length }}
        >
          {/* Header Row */}
          <View className="flex-row bg-gray-100 border-b border-gray-300">
            {desiredColumnOrder.map((variable) => (
              <View
                key={variable}
                className="justify-center items-center border-r border-gray-300 py-3 px-2"
                style={{ width: COLUMN_WIDTH }}
              >
                <Text className="font-bold text-center">{variable}</Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          <ScrollView style={{ maxHeight: 600 }}>
            {data.map((row, idx) => (
              <View
                key={idx}
                className={`flex-row border-b border-gray-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {desiredColumnOrder.map((variable) => {
                  let displayValue = "";
                  if (variable === "Start_Date") displayValue = row.Date ? formatDateOnly(row.Date) : "";
                  else if (variable === "End_Date") displayValue = row.timestamp ? formatDateOnly(row.timestamp) : "";
                  else if (variable === "Start_Time" || variable === "End_Time") displayValue = row[variable] ? formatTime(row[variable]) : "";
                  else if (variable === "Downtime") displayValue = formatDowntime(Number(row[variable]) || 0);
                  else displayValue = row[variable] ?? "";

                  return (
                    <View
                      key={variable}
                      className="justify-center items-center border-r border-gray-200 py-3 px-2"
                      style={{ width: COLUMN_WIDTH }}
                    >
                      <Text className="text-center">{displayValue}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>


    </View>
  );
};

export default ReportDisplay;
