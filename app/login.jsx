import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Button, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Login() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = () => {
    setError('');
    if (!userName || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // TODO: Replace with real login logic
    if (userName === 'admin' && password === '123456') {
      setSuccessMessage('Login successful!');
      setTimeout(() => {
        setSuccessMessage('');
        router.replace('/'); 
      }, 1500);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-blue-100 px-6">
      <View className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        {/* Logo */}
        <View className="items-center mb-6">
          <Image
            source={require('../assets/images/icon.png')}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>

        <Text className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </Text>

        {/* Username */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">Username</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-4"
            placeholder="Enter Username"
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
            maxLength={25}
          />
        </View>

        {/* Password */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-1">
            <TextInput
              className="flex-1"
              placeholder="Enter Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="gray"
              />
            </Pressable>
          </View>
        </View>

        {/* Submit */}
        <Pressable
          onPress={handleLogin}
          className="bg-green-500 py-3 rounded-lg"
        >
          <Text className="text-center text-white font-semibold">Login</Text>
        </Pressable>

        {/* Error message */}
        {error ? (
          <Text className="text-red-600 text-center mt-4">{error}</Text>
        ) : null}

        {/* Success message */}
        {successMessage ? (
          <Text className="text-green-600 text-center mt-4">
            {successMessage}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
