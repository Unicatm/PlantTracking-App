import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { getPlantDetails } from "@/api/perenual";

type PlantDetails = {
  common_name?: string;
  scientific_name?: string[] | string;
  description?: string;
  watering?: string;
  sunlight?: string[] | string;
  cycle?: string;
  care_level?: string;
  default_image?: {
    regular_url?: string;
    medium_url?: string;
    original_url?: string;
  };
};

type ActiveTab = "general" | "details";

const formatWateringDate = (date: string) => {
  if (!date) {
    return "Not watered yet";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatValue = (value?: string[] | string) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not available";
  }

  return value || "Not available";
};

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
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

export default function PlantDetailsScreen() {
  const router = useRouter();
  const { apiPlantId, nickname, lastWatered, folderName } =
    useLocalSearchParams<{
      id: string;
      apiPlantId: string;
      nickname?: string;
      lastWatered?: string;
      folderName?: string;
    }>();

  const [details, setDetails] = useState<PlantDetails | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("general");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!apiPlantId) {
        setError("Plant details not found.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const response = await getPlantDetails(apiPlantId);

        if (response.status === "success") {
          setDetails(response.data);
        }
      } catch (error) {
        setError("Error at getting plant details");
        console.error("Error at getting plant details", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [apiPlantId]);

  const displayName =
    nickname || details?.common_name || formatValue(details?.scientific_name);
  const imageUrl =
    details?.default_image?.regular_url ??
    details?.default_image?.medium_url ??
    details?.default_image?.original_url;

  if (isLoading) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-light">
        <ActivityIndicator size="large" color="#22c55e" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-light">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Box className="px-6 pt-16">
          <Box className="flex-row items-center gap-4 mb-5">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
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
          </Box>

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

          <Box className="flex-row bg-white rounded-2xl p-1 mb-5 border border-gray-100">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab("general")}
              className={`flex-1 py-3 rounded-xl items-center ${
                activeTab === "general" ? "bg-primary-500" : "bg-transparent"
              }`}
            >
              <Text
                className={`font-bold ${
                  activeTab === "general" ? "text-white" : "text-gray-500"
                }`}
              >
                General
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab("details")}
              className={`flex-1 py-3 rounded-xl items-center ${
                activeTab === "details" ? "bg-primary-500" : "bg-transparent"
              }`}
            >
              <Text
                className={`font-bold ${
                  activeTab === "details" ? "text-white" : "text-gray-500"
                }`}
              >
                Details
              </Text>
            </TouchableOpacity>
          </Box>

          {error ? (
            <Box className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <Text className="text-red-600 font-medium">{error}</Text>
            </Box>
          ) : activeTab === "general" ? (
            <Box>
              <DetailRow
                icon="water-outline"
                label="Last watered"
                value={formatWateringDate(lastWatered ?? "")}
              />
              <DetailRow
                icon="repeat-outline"
                label="Watering period"
                value={formatValue(details?.watering)}
              />
              <DetailRow
                icon="sunny-outline"
                label="Light preference"
                value={formatValue(details?.sunlight)}
              />
              <DetailRow
                icon="leaf-outline"
                label="Growth cycle"
                value={formatValue(details?.cycle)}
              />
              <DetailRow
                icon="heart-outline"
                label="Care level"
                value={formatValue(details?.care_level)}
              />
            </Box>
          ) : (
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
          )}
        </Box>
      </ScrollView>
    </Box>
  );
}
