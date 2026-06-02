import React from "react";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { formatValue } from "./formatters";
import type { PlantDetails } from "./types";

interface PlantDescriptionProps {
  details: PlantDetails | null;
  displayName: string;
}

export default function PlantDescription({
  details,
  displayName,
}: PlantDescriptionProps) {
  return (
    <Box className="bg-white rounded-2xl p-5 border border-gray-50">
      <Text className="text-xl font-bold text-gray-800 mb-2">
        {details?.common_name || displayName}
      </Text>
      <Text className="text-gray-500 font-medium mb-4">
        Scientific name: {formatValue(details?.scientific_name)}
      </Text>
      <Text className="text-gray-700 leading-6">
        {details?.description || "No description available yet."}
      </Text>
    </Box>
  );
}
