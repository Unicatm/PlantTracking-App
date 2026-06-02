import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { formatWateringDate, formatWateringDateTime } from "./formatters";
import type { Watering } from "./types";

interface WateringHistoryProps {
  waterings: Watering[];
}

export default function WateringHistory({ waterings }: WateringHistoryProps) {
  if (waterings.length === 0) {
    return (
      <Box className="bg-white rounded-2xl p-6 border border-gray-50 items-center">
        <Box className="w-14 h-14 rounded-full bg-primary-100 items-center justify-center mb-3">
          <Ionicons name="water-outline" size={28} color="#22c55e" />
        </Box>
        <Text className="text-gray-800 text-lg font-bold text-center">
          No watering history yet
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Tap Watered today when you water this plant.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {waterings.map((watering) => (
        <Box
          key={watering.id}
          className="flex-row items-center gap-4 bg-white rounded-2xl p-4 mb-3 border border-gray-50"
        >
          <Box className="w-11 h-11 rounded-full bg-primary-100 items-center justify-center">
            <Ionicons name="water" size={22} color="#22c55e" />
          </Box>
          <Box className="flex-1">
            <Text className="text-gray-800 text-base font-bold">
              {formatWateringDate(watering.watered_at)}
            </Text>
            <Text className="text-gray-500 text-sm font-medium mt-1">
              {formatWateringDateTime(watering.watered_at)}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
