import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import AutomationDetails from '../../pages/AutomationDetails';

export default function AutomationScreen() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <View className="flex-1 p-4 bg-white top-12">
      <Text className="text-xl font-bold text-gray-800 mb-4">🤖 Automation Line</Text>
   <AutomationDetails />
    </View>
  );
}
