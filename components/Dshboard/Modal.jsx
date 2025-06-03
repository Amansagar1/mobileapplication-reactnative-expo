import React from "react";
import { Modal as RNModal, View, TouchableOpacity, Text } from "react-native";

const Modal = ({ children, onClose, visible }) => (
  <RNModal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View className="flex-1 bg-black bg-opacity-40 justify-center items-center p-4">
      <View className="bg-white rounded-lg shadow-lg w-full max-w-[90%] max-h-[90vh] p-4">
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-2 right-2 p-2"
        >
          <Text className="text-gray-500 text-lg">✕</Text>
        </TouchableOpacity>
        {children}
      </View>
    </View>
  </RNModal>
);

export default Modal;