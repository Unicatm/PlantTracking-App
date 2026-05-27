import React from "react";
import { TouchableOpacity } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";

interface FolderCardProps {
  name: string;
  onPress: () => void;
}

export default function FolderCard({ name, onPress }: FolderCardProps) {
  return (
    <Box className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-4 shadow-soft-1 border border-gray-50">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className="flex-1 flex-row items-center gap-4"
      >
        <Box className="w-12 h-12 rounded-full bg-primary-100 justify-center items-center">
          <Ionicons name="folder-open" size={24} color="#22c55e" />
        </Box>

        <Text
          className="flex-1 text-xl font-bold text-gray-800"
          numberOfLines={1}
        >
          {name}
        </Text>

        <Ionicons name="chevron-forward" size={24} color="#a3a3a3" />
      </TouchableOpacity>
    </Box>
  );
}
