import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const ChartTab = ({ title, data, type }) => {
  const isProduction = type === 'product_count';

  const dailyTotals = {};
  const shift1 = {};
  const shift2 = {};

  data.forEach(entry => {
    const date = formatDate(entry.timestamp);
    const shift = entry.shift;
    const value = isProduction ? entry.product_count : entry.downtime;

    if (!dailyTotals[date]) dailyTotals[date] = 0;
    dailyTotals[date] += value;

    if (shift === 'Shift1') shift1[date] = value;
    if (shift === 'Shift2') shift2[date] = value;
  });

  const labels = Object.keys(dailyTotals);
  const totalValues = labels.map(label => dailyTotals[label]);
  const shift1Values = labels.map(label => shift1[label] || 0);
  const shift2Values = labels.map(label => shift2[label] || 0);

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>{title}</Text>

      {/* Chart 1: Daily Total */}
      <Text>Total per Day</Text>
      <BarChart
        data={{
          labels,
          datasets: [{ data: totalValues }],
        }}
        width={screenWidth - 20}
        height={220}
        yAxisLabel=""
        chartConfig={chartConfig}
        style={{ marginBottom: 20 }}
      />

      {/* Chart 2: Shift Comparison */}
      <Text>Shift-wise Comparison</Text>
      <BarChart
        data={{
          labels,
          datasets: [
            { data: shift1Values, color: () => 'rgba(134, 65, 244, 1)', label: 'Shift1' },
            { data: shift2Values, color: () => 'rgba(244, 65, 134, 1)', label: 'Shift2' },
          ],
          legend: ['Shift1', 'Shift2'],
        }}
        width={screenWidth - 20}
        height={220}
        chartConfig={chartConfig}
        style={{ marginBottom: 20 }}
        fromZero
        yAxisLabel=""
      />

      {/* Chart 3: Trend Lines */}
      <Text>Trend per Shift</Text>
      <LineChart
        data={{
          labels,
          datasets: [
            { data: shift1Values, color: () => 'rgba(0, 0, 255, 1)' },
            { data: shift2Values, color: () => 'rgba(255, 0, 0, 1)' },
          ],
          legend: ['Shift1', 'Shift2'],
        }}
        width={screenWidth - 20}
        height={220}
        chartConfig={chartConfig}
        bezier
      />
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "4", strokeWidth: "2", stroke: "#ffa726" }
};

export default ChartTab;
