import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

interface DetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export default function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <Box className="flex-row items-center gap-4 bg-white rounded-2xl p-4 mb-3 border border-gray-50">
      <Box className="w-11 h-11 rounded-full bg-primary-100 items-center justify-center">
        <Ionicons name={icon} size={22} color="#22c55e" />
      </Box>
      <Box className="flex-1">
        <Text className="text-gray-500 text-sm font-medium">{label}</Text>
        <Text className="text-gray-800 text-base font-bold mt-1">{value}</Text>
      </Box>
    </Box>
  );
}
