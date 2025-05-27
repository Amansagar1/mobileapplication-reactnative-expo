import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import ReportsDetails from '../pages/ReportsDetails';

export default function ReportsScreen() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <View className="flex-1 p-4 bg-white top-12">
      <Text className="text-xl font-bold text-gray-800 mb-4">📊 Reports</Text>
      <Button title="Show Details" onPress={() => setShowDetails(!showDetails)} />
      {showDetails && <ReportsDetails />}
    </View>
  );
}
