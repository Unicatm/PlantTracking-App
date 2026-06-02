import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import {
  deletePlant,
  getPlantWaterings,
  updatePlant,
  waterPlant,
} from "@/api/plants";
import { getPlantDetails } from "@/api/perenual";
import EditPlantNameModal from "@/components/app/ui/Plants/EditPlantNameModal";
import GeneralPlantInfo from "@/components/app/ui/Plants/PlantDetails/GeneralPlantInfo";
import PlantDescription from "@/components/app/ui/Plants/PlantDetails/PlantDescription";
import PlantHeader from "@/components/app/ui/Plants/PlantDetails/PlantHeader";
import PlantImageCard from "@/components/app/ui/Plants/PlantDetails/PlantImageCard";
import PlantTabs from "@/components/app/ui/Plants/PlantDetails/PlantTabs";
import WaterPlantButton from "@/components/app/ui/Plants/PlantDetails/WaterPlantButton";
import WateringHistory from "@/components/app/ui/Plants/PlantDetails/WateringHistory";
import { formatValue } from "@/components/app/ui/Plants/PlantDetails/formatters";
import type {
  PlantDetails,
  PlantDetailsTab,
  Watering,
} from "@/components/app/ui/Plants/PlantDetails/types";

export default function PlantDetailsScreen() {
  const router = useRouter();
  const { id, apiPlantId, nickname, lastWatered, folderName } =
    useLocalSearchParams<{
      id: string;
      apiPlantId: string;
      nickname?: string;
      lastWatered?: string;
      folderName?: string;
    }>();

  const [details, setDetails] = useState<PlantDetails | null>(null);
  const [activeTab, setActiveTab] = useState<PlantDetailsTab>("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [plantName, setPlantName] = useState(nickname ?? "");
  const [nameInput, setNameInput] = useState(nickname ?? "");
  const [currentLastWatered, setCurrentLastWatered] = useState(
    lastWatered ?? ""
  );
  const [wateringHistory, setWateringHistory] = useState<Watering[]>([]);
  const [error, setError] = useState("");

  const fetchWateringHistory = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      const response = await getPlantWaterings(id);

      if (response.status === "success") {
        setWateringHistory(response.data ?? []);
      }
    } catch (error) {
      setError("Error at getting watering history");
      console.error("Error at getting watering history", error);
    }
  }, [id]);

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
    fetchWateringHistory();
  }, [apiPlantId, fetchWateringHistory]);

  const displayName =
    plantName || details?.common_name || formatValue(details?.scientific_name);
  const imageUrl =
    details?.default_image?.regular_url ??
    details?.default_image?.medium_url ??
    details?.default_image?.original_url;

  const openEditNameModal = () => {
    setNameInput(displayName);
    setError("");
    setIsEditNameModalVisible(true);
  };

  const closeEditNameModal = () => {
    setNameInput(plantName);
    setIsEditNameModalVisible(false);
  };

  const handleSaveName = async () => {
    const trimmedName = nameInput.trim();

    if (trimmedName.length < 2) {
      setError("Plant name should have at least 2 characters.");
      return;
    }

    try {
      setIsSavingName(true);
      setError("");
      await updatePlant(id, { nickname: trimmedName });
      setPlantName(trimmedName);
      setIsEditNameModalVisible(false);
    } catch (error) {
      setError("Error at updating the plant name");
      console.error("Error at updating plant name", error);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleWaterPlant = async () => {
    try {
      setIsWatering(true);
      setError("");

      const response = await waterPlant(id);

      if (response.status === "success") {
        setCurrentLastWatered(response.data?.last_watered ?? "");

        if (response.data?.watering) {
          setWateringHistory((history) => [
            response.data.watering,
            ...history,
          ]);
        } else {
          fetchWateringHistory();
        }
      }
    } catch (error) {
      setError("Error at updating watering date");
      console.error("Error at watering plant", error);
    } finally {
      setIsWatering(false);
    }
  };

  const handleDeletePlant = () => {
    Alert.alert(
      "Delete plant",
      `Are you sure you want to delete "${displayName}" from this garden?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePlant(id);
              router.back();
            } catch (error) {
              setError("Error at deleting the plant");
              console.error("Error at deleting plant", error);
            }
          },
        },
      ]
    );
  };

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
          <PlantHeader
            displayName={displayName}
            folderName={folderName}
            onBack={() => router.back()}
            onEditName={openEditNameModal}
            onDeletePlant={handleDeletePlant}
          />

          <PlantImageCard imageUrl={imageUrl} />

          <WaterPlantButton
            isWatering={isWatering}
            onWaterPlant={handleWaterPlant}
          />

          <PlantTabs activeTab={activeTab} onChangeTab={setActiveTab} />

          {error ? (
            <Box className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <Text className="text-red-600 font-medium">{error}</Text>
            </Box>
          ) : activeTab === "general" ? (
            <GeneralPlantInfo
              details={details}
              lastWatered={currentLastWatered}
            />
          ) : activeTab === "details" ? (
            <PlantDescription details={details} displayName={displayName} />
          ) : (
            <WateringHistory waterings={wateringHistory} />
          )}
        </Box>
      </ScrollView>

      <EditPlantNameModal
        isOpen={isEditNameModalVisible}
        isSaving={isSavingName}
        name={nameInput}
        onChangeName={setNameInput}
        onClose={closeEditNameModal}
        onSave={handleSaveName}
      />
    </Box>
  );
}
