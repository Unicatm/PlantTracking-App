import React from "react";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

interface PlantImageCardProps {
  imageUrl?: string;
}

export default function PlantImageCard({ imageUrl }: PlantImageCardProps) {
  return (
    <Box className="h-56 rounded-3xl overflow-hidden bg-primary-100 border border-primary-200 mb-6 items-center justify-center">
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <Box className="items-center px-8">
          <Box className="w-16 h-16 rounded-full bg-white items-center justify-center mb-3">
            <Ionicons name="camera-outline" size={30} color="#22c55e" />
          </Box>
          <Text className="text-primary-900 font-bold text-center">
            Plant photo
          </Text>
          <Text className="text-primary-700 text-center mt-1">
            Space reserved for uploading your own plant photo later.
          </Text>
        </Box>
      )}
    </Box>
  );
}
