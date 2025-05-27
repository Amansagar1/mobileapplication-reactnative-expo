// import { useRouter } from "expo-router";
// import { Text,TouchableOpacity, View } from "react-native";

// export default function Index() {
//   const router = useRouter();
//   return (
//     <View className=""
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//       <TouchableOpacity onPress={() =>router.push("/testing")}>
// <Text>
//   Change route
// </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
// import { useState } from 'react';
// import { Button, Text, View } from 'react-native';
// import HomePageDetails from '../../pages/HomePageDetails';

// export default function HomeScreen() {
//   const [showDetails, setShowDetails] = useState(false);

//   return (
//     <View className="flex-1 p-4 bg-white top-12 ">
//       <Text className="text-xl font-bold text-gray-800 mb-4">🏠 Home Screen</Text>
//       <Button title="Show Details" onPress={() => setShowDetails(!showDetails)} />
//       {showDetails && <HomePageDetails />}
//     </View>
//   );
// }

import { View, Text, Button } from 'react-native';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { emitLogout } from '../_layout';
import HomePageDetails from '../../pages/HomePageDetails';
export default function HomeScreen() {
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

const handleLogout = async () => {
  await SecureStore.deleteItemAsync('token');
  emitLogout();  
  router.replace('/(auth)/login');
};


  return (
    <View className="flex-1 p-4 bg-white top-12">
      <Text className="text-xl font-bold text-gray-800 mb-4">🏠 Home Screen</Text>
      
   
      
<HomePageDetails/>

      <View className="mt-6">
        <Button title="Logout" onPress={handleLogout} color="green" />
      </View>
    </View>
  );
}
