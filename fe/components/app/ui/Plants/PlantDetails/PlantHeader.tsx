import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

interface PlantHeaderProps {
  displayName: string;
  folderName?: string;
  onBack: () => void;
  onEditName: () => void;
  onDeletePlant: () => void;
}

export default function PlantHeader({
  displayName,
  folderName,
  onBack,
  onEditName,
  onDeletePlant,
}: PlantHeaderProps) {
  return (
    <Box className="flex-row items-center gap-4 mb-5">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onBack}
        className="w-11 h-11 rounded-full bg-white items-center justify-center border border-gray-100"
      >
        <Ionicons name="chevron-back" size={24} color="#14532d" />
      </TouchableOpacity>

      <Box className="flex-1">
        <Text className="text-sm font-semibold text-primary-600">
          {folderName || "My Garden"}
        </Text>
        <Text
          className="text-3xl font-extrabold text-primary-950"
          numberOfLines={1}
        >
          {displayName}
        </Text>
      </Box>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onEditName}
        className="w-11 h-11 rounded-full bg-white items-center justify-center border border-gray-100"
      >
        <Ionicons name="pencil-outline" size={21} color="#14532d" />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onDeletePlant}
        className="w-11 h-11 rounded-full bg-red-50 items-center justify-center border border-red-100"
      >
        <Ionicons name="trash-outline" size={22} color="#ef4444" />
      </TouchableOpacity>
    </Box>
  );
}
