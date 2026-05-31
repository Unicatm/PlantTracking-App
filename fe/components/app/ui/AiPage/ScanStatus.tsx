import React from "react";
import { ActivityIndicator } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";

interface ScanStatusProps {
  isAnalyzing: boolean;
  plantResult: string | null;
  isSearchingPerenual: boolean;
  hasSuggestions: boolean;
}

export default function ScanStatus({
  isAnalyzing,
  plantResult,
  isSearchingPerenual,
  hasSuggestions,
}: ScanStatusProps) {
  if (isAnalyzing) {
    return (
      <Box className="items-center mb-6 mt-4">
        <ActivityIndicator size="large" color="#22c55e" className="mb-2" />
        <Text className="text-primary-600 font-medium">
          We are analyzing the plant...
        </Text>
      </Box>
    );
  }

  if (plantResult && isSearchingPerenual) {
    return (
      <Box className="items-center mb-6 mt-4 bg-primary-50 p-4 rounded-2xl border border-primary-100">
        <Text className="text-gray-500 text-sm mb-1">Identified as:</Text>
        <Text className="text-xl font-bold text-primary-900 text-center mb-3">
          {plantResult}
        </Text>
        <ActivityIndicator size="small" color="#22c55e" className="mb-2" />
        <Text className="text-primary-600 text-sm">
          Searching care guides in database...
        </Text>
      </Box>
    );
  }

  if (plantResult && !hasSuggestions && !isSearchingPerenual && !isAnalyzing) {
    return (
      <Box className="items-center bg-orange-50 p-5 rounded-2xl border border-orange-200 mt-4 w-full">
        <Text className="text-gray-600 text-sm mb-1">Identified as:</Text>
        <Text className="text-xl font-bold text-orange-900 mb-3 text-center">
          {plantResult}
        </Text>
        <Ionicons
          name="warning-outline"
          size={32}
          color="#ea580c"
          className="mb-2"
        />
        <Text className="text-orange-700 text-center text-sm">
          We couldn't find exact care details for this plant in our database
          yet.
        </Text>
      </Box>
    );
  }

  return null;
}
