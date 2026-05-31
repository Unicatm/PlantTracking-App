import React from "react";
import { Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";

interface ImageSelectorProps {
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
  isDisabled: boolean;
}

export default function ImageSelector({
  imageUri,
  onImageSelected,
  isDisabled,
}: ImageSelectorProps) {
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need access to your camera to scan plants.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need access to your photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <Box className="w-full">
      <Box className="w-full h-72 bg-gray-100 rounded-3xl overflow-hidden justify-center items-center mb-6 border-2 border-dashed border-gray-300">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="camera-outline" size={80} color="#d4d4d4" />
        )}
      </Box>

      <Box className="flex-row gap-4 w-full mb-8">
        <Button
          className="flex-1 bg-primary-500 rounded-xl py-3 h-full flex-row gap-2"
          onPress={takePhoto}
          disabled={isDisabled}
        >
          <Ionicons name="camera" size={20} color="white" />
          <ButtonText>Camera</ButtonText>
        </Button>

        <Button
          variant="outline"
          className="flex-1 rounded-xl py-3 border-primary-500 h-full flex-row gap-2"
          onPress={pickImage}
          disabled={isDisabled}
        >
          <Ionicons name="image" size={20} color="#22c55e" />
          <ButtonText className="text-primary-500">Gallery</ButtonText>
        </Button>
      </Box>
    </Box>
  );
}
