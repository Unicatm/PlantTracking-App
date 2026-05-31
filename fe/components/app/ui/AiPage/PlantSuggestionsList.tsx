import React from "react";
import { Image } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";

type PerenualPlant = {
  id: number;
  common_name: string;
  scientific_name: string[];
  default_image: { thumbnail: string } | null;
};

interface PlantSuggestionsListProps {
  suggestions: PerenualPlant[];
  onAddPlant: (plant: PerenualPlant) => void;
}

export default function PlantSuggestionsList({
  suggestions,
  onAddPlant,
}: PlantSuggestionsListProps) {
  if (suggestions.length === 0) return null;

  return (
    <Box className="w-full mt-2">
      <Text className="text-lg font-bold text-gray-800 mb-4">
        Matches found in database:
      </Text>

      {suggestions.map((plant) => (
        <Box
          key={plant.id}
          className="flex-row items-center bg-white p-3 rounded-2xl mb-3 shadow-soft-1"
        >
          <Box className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden mr-4">
            {plant.default_image?.thumbnail ? (
              <Image
                source={{ uri: plant.default_image.thumbnail }}
                className="w-full h-full"
              />
            ) : (
              <Box className="w-full h-full items-center justify-center">
                <Ionicons name="leaf" size={24} color="#d4d4d4" />
              </Box>
            )}
          </Box>

          <Box className="flex-1">
            <Text
              className="text-lg font-bold text-gray-800 capitalize"
              numberOfLines={1}
            >
              {plant.common_name}
            </Text>
            <Text className="text-gray-500 text-sm italic" numberOfLines={1}>
              {plant.scientific_name?.[0]}
            </Text>
          </Box>

          <Button
            size="sm"
            className="bg-primary-500 rounded-full w-10 h-10 p-0 items-center justify-center ml-2"
            onPress={() => onAddPlant(plant)}
          >
            <Ionicons name="add" size={20} color="white" />
          </Button>
        </Box>
      ))}
    </Box>
  );
}
