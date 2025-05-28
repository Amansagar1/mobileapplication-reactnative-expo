import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../utils/auth-context';
import { loginApi } from '../../webServices/UCIAPIController';

export default function Login() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateInputs = () => {
    if (!userName.trim()) {
      setError('Username is required');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    if (userName.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    // Clear previous errors
    setError('');
    
    // Validate inputs
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginApi(userName.trim(), password);
      
      if (response?.token) {
        // Store token securely
        await SecureStore.setItemAsync('token', response.token);
        
        // Update auth context
        setIsLoggedIn(true);
        
        // Navigate to tabs - this should trigger the auth guard
        router.replace('/(tabs)');
        
        // Optional: Show success message
        Alert.alert('Success', 'Login successful!', [{ text: 'OK' }]);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    if (error) setError('');
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-green-200 to-indigo-200">
      {/* Background Decoration */}
      <View className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
      <View className="absolute bottom-0 right-0 w-40 h-40 bg-green-200 rounded-full opacity-20 translate-x-20 translate-y-20" />
      
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100">
          {/* Logo Section */}
          <View className="items-center mb-8">
            <View className="bg-green-50 p-4 rounded-full mb-4">
              <Image
                source={require('../../assets/images/icon.png')}
                className="w-16 h-16"
                resizeMode="contain"
              />
            </View>
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-500 text-center">
              Sign in to your account to continue
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-4">
            {/* Username Field */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Username
              </Text>
              <View className="relative">
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-4 pr-12 text-gray-800 bg-gray-50 focus:bg-white focus:border-green-500"
                  placeholder="Enter your username"
                  placeholderTextColor="#9CA3AF"
                  value={userName}
                  onChangeText={(text) => {
                    setUserName(text);
                    clearError();
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={25}
                  editable={!isLoading}
                />
                <View className="absolute right-4 top-4">
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                </View>
              </View>
            </View>

            {/* Password Field */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Password
              </Text>
              <View className="relative">
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-4 pr-12 text-gray-800 bg-gray-50 focus:bg-white focus:border-green-500"
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearError();
                  }}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#9CA3AF"
                  />
                </Pressable>
              </View>
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-xl p-3">
                <View className="flex-row items-center">
                  <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
                  <Text className="text-red-600 text-sm ml-2 flex-1">
                    {error}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Login Button */}
            <Pressable
              onPress={handleLogin}
              disabled={isLoading || !userName.trim() || !password.trim()}
              className={`py-4 rounded-xl flex-row justify-center items-center mt-6 ${
                isLoading || !userName.trim() || !password.trim()
                  ? 'bg-gray-300'
                  : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
              }`}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-semibold ml-2">
                    Signing in...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Sign In
                  </Text>
                </>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <View className="mt-6 pt-4 border-t border-gray-100">
            <Text className="text-center text-gray-500 text-sm">
              Having trouble signing in?{'\n'}
              <Text className="text-green-600 font-medium">Contact Support</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
// import { View, Text, TextInput, Pressable } from 'react-native';
// import { useState } from 'react';
// import { useRouter } from 'expo-router';
// import * as SecureStore from 'expo-secure-store';

// export default function LoginScreen() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleLogin = async () => {
//     if (username === 'admin' && password === '123456') {
//       await SecureStore.setItemAsync('token', 'fake-token-123');
//       router.replace('/');
//     } else {
//       setError('Invalid credentials');
//     }
//   };

//   return (
//     <View className="flex-1 justify-center items-center bg-white px-6">
//       <Text className="text-2xl font-bold mb-6">Login</Text>

//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         className="border w-full mb-4 p-3 rounded"
//       />

//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         className="border w-full mb-4 p-3 rounded"
//       />

//       <Pressable onPress={handleLogin} className="bg-green-500 w-full py-3 rounded">
//         <Text className="text-white text-center">Login</Text>
//       </Pressable>

//       {error && <Text className="text-red-500 mt-4">{error}</Text>}
//     </View>
//   );
// }
