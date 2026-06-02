import React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box/index.web";

interface WaterPlantButtonProps {
  isWatering: boolean;
  onWaterPlant: () => void;
}

export default function WaterPlantButton({
  isWatering,
  onWaterPlant,
}: WaterPlantButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isWatering}
      onPress={onWaterPlant}
      className={`flex-row items-center justify-center gap-2 rounded-2xl py-4 mb-5 ${
        isWatering ? "bg-primary-300" : "bg-primary-500"
      }`}
    >
      {isWatering ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Ionicons name="water" size={22} color="white" />
      )}
      <Text className="text-white font-extrabold text-base text-center w-[25%]">
        {isWatering ? "Saving..." : "Watered today"}
      </Text>
    </TouchableOpacity>
  );
}
