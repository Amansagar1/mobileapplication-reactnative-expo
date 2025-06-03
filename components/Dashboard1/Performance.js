// import React from 'react'
// import { View, Text, Pressable, Dimensions } from 'react-native'
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// import { LineChart } from 'react-native-chart-kit'
// import { useNavigation } from '@react-navigation/native'
// import { BlurView } from 'expo-blur'
// const screenWidth = Dimensions.get('window').width

// const chartConfig = {
//     backgroundColor: 'transparent',
//     backgroundGradientFrom: 'transparent',
//     backgroundGradientTo: 'transparent',
//     color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//     labelColor: () => '#aaa',
//     propsForDots: {
//         r: '4',
//         strokeWidth: '2',
//         stroke: '#fff',
//     },
//     propsForBackgroundLines: {
//         stroke: '#333',
//     },
// }

// const ChartButton = ({ name, label, onPress }) => (
//     <Pressable
//         onPress={onPress}
//         className="items-center justify-center w-20 h-20 bg-white/10 rounded-xl border border-white/10"
//         android_ripple={{ color: '#ffffff20' }}
//     >
//         <Icon name={name} size={26} color="#fff" />
//         <Text className="text-white text-xs mt-1">{label}</Text>
//     </Pressable>
// )

// const Performance = () => {
//     const navigation = useNavigation()

//     const handleNavigate = (type) => {
//         navigation.navigate('Details', { type })
//     }

//     const dummyData = {
//         labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//         datasets: [
//             {
//                 data: [20, 45, 28, 80, 99, 43, 70],
//                 color: (opacity = 1) => `rgba(0, 255, 200, ${opacity})`,
//                 strokeWidth: 2,
//             },
//         ],
//         legend: ['GRA Performance', 'GCS Performance', 'SPC Performance'],
//     }

//     return (
//         <View className="flex items-center justify-center pr-5 pl-5 ">
//             {/* Header */}
//             <View className="flex-row p-3 justify-between items-center mb-2  rounded-2xl w-full  border border-white/10 shadow-lg ">
//                 <ChartButton name="chart-line" label="GRA" onPress={() => handleNavigate('GRA')} />
//                 <ChartButton name="chart-bar" label="GCS" onPress={() => handleNavigate('GCS')} />
//                 <ChartButton name="chart-areaspline" label="SPC" onPress={() => handleNavigate('SPC')} />
//             </View>

//             {/*GRA Chart Overview */}
//             <View
//                 className="rounded-2xl overflow-hidden mt-4 w-full"
//                 style={{
//                     backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glassy white effect
//                     borderColor: 'rgba(255,255,255,0.2)',
//                     borderWidth: 1,
//                     padding: 10,
//                 }}
//             >
//                 <BlurView intensity={30} tint="dark" className="rounded-2xl overflow-hidden mt-4 w-full">
//                     <LineChart
//                         data={dummyData}
//                         width={screenWidth - 40}
//                         height={220}
//                         chartConfig={chartConfig}
//                         withInnerLines
//                         bezier
//                         style={{
//                             borderRadius: 16,
//                         }}
//                     />
//                 </BlurView>

//             </View>

//             {/*GCS Chart Overview */}
//             <View
//                 className="rounded-2xl overflow-hidden mt-4 w-full"
//                 style={{
//                     backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glassy white effect
//                     borderColor: 'rgba(255,255,255,0.2)',
//                     borderWidth: 1,
//                     padding: 10,
//                 }}
//             >
//                 <BlurView intensity={30} tint="dark" className="rounded-2xl overflow-hidden mt-4 w-full">
//                     <LineChart
//                         data={dummyData}
//                         width={screenWidth - 40}
//                         height={220}
//                         chartConfig={chartConfig}
//                         withInnerLines
//                         bezier
//                         style={{
//                             borderRadius: 16,
//                         }}
//                     />
//                 </BlurView>

//             </View>

//              {/*SPC Chart Overview */}
//             <View
//                 className="rounded-2xl overflow-hidden mt-4 w-full"
//                 style={{
//                     backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glassy white effect
//                     borderColor: 'rgba(255,255,255,0.2)',
//                     borderWidth: 1,
//                     padding: 10,
//                 }}
//             >
//                 <BlurView intensity={30} tint="dark" className="rounded-2xl overflow-hidden mt-4 w-full">
//                     <LineChart
//                         data={dummyData}
//                         width={screenWidth - 40}
//                         height={220}
//                         chartConfig={chartConfig}
//                         withInnerLines
//                         bezier
//                         style={{
//                             borderRadius: 16,
//                         }}
//                     />
//                 </BlurView>
                
//             </View>

//         </View>
//     )
// }

// export default Performance
// import React, { useEffect, useState } from 'react';
// import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { useRoute } from '@react-navigation/native';
// import { getHisRuntimeDowntime } from '../../webServices/UCIAPIController'; // update path
// import ChartTab from './ChartTab'; 

// const screenWidth = Dimensions.get('window').width;
// const Tab = createMaterialTopTabNavigator();

// const Performance = () => {
//   const route = useRoute();
//   const { assetName = 'GRA', from = '2025-05-13', to = '2025-05-19', timezone = 'UTC' } = route.params || {};
//   const [loading, setLoading] = useState(true);
//   const [prodData, setProdData] = useState([]);
//   const [downTimeData, setDownTimeData] = useState([]);
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       console.log('Fetching data for:', { assetName, from, to, timezone });

//       const data = await getHisRuntimeDowntime(assetName, from, to, timezone);

//       console.log('API response:', data);

//       if (data) {
//         setProdData(data.prodData || []);
//         setDownTimeData(data.downTimeData || []);
//       } else {
//         console.warn('No data received from API');
//       }
//     } catch (error) {
//       console.error('Error fetching performance data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, [assetName]);


//   if (loading) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <ActivityIndicator size="large" color="#0ff" />
//       </View>
//     );
//   }

//   return (
// <>
// <View>
//   <ChartTab title="Production Count" data={prodData} type="product_count" />
// </View>
// <View>
  
//  <ChartTab title="Downtime (hrs)" data={downTimeData} type="downtime" />
// </View>
// </>
//   );
// };

// export default Performance;
import React from 'react';
import { View, ActivityIndicator, Text,Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChartTab from './ChartTab';
import { useNavigation } from '@react-navigation/native';

const Performance = ({ data }) => {
  const navigation = useNavigation();

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0ff" />
      </View>
    );
  }

  const prodData = data?.prodData || [];
  const downTimeData = data?.downTimeData || [];
const ChartButton = ({ name, label, onPress }) => (
    <Pressable
        onPress={onPress}
        className="items-center justify-center w-20 h-20 bg-white/10 rounded-xl border border-white/10"
        android_ripple={{ color: '#ffffff20' }}
    >
        <Icon name={name} size={26} color="#fff" />
        <Text className="text-white text-xs mt-1">{label}</Text>
    </Pressable>
)

    const handleNavigate = (type) => {
        navigation.navigate('Details', { type })
    }
  return (
    <>
    <View className=' items-center justify-center  '>
     <View className="flex-row p-3 justify-between items-center mb-2  rounded-2xl  border border-white/10 shadow-lg gap-24 bg-white/10 ">
               <ChartButton name="chart-line" label="GRA" onPress={() => handleNavigate('GRA')} />
                <ChartButton name="chart-bar" label="GCS" onPress={() => handleNavigate('GCS')} />
               <ChartButton name="chart-areaspline" label="SPC" onPress={() => handleNavigate('SPC')} />           </View>
      <View>
        </View>
        <ChartTab title="Production Count" data={prodData} type="product_count" />
      </View>
      <View>
        <ChartTab title="Downtime (hrs)" data={downTimeData} type="downtime" />
      </View>
    </>
  );
};

export default Performance;
