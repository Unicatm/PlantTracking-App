import React from "react";
import { TouchableOpacity } from "react-native";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import type { PlantDetailsTab } from "./types";

const tabs: { label: string; value: PlantDetailsTab }[] = [
  { label: "General", value: "general" },
  { label: "Details", value: "details" },
  { label: "History", value: "history" },
];

interface PlantTabsProps {
  activeTab: PlantDetailsTab;
  onChangeTab: (tab: PlantDetailsTab) => void;
}

export default function PlantTabs({
  activeTab,
  onChangeTab,
}: PlantTabsProps) {
  return (
    <Box className="flex-row bg-white rounded-2xl p-1 mb-5 border border-gray-100">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.value}
          activeOpacity={0.8}
          onPress={() => onChangeTab(tab.value)}
          className={`flex-1 py-3 rounded-xl items-center ${
            activeTab === tab.value ? "bg-primary-500" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-bold ${
              activeTab === tab.value ? "text-white" : "text-gray-500"
            }`}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </Box>
  );
}
