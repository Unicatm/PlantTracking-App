import React, { useState, useEffect } from "react";
import { Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { Text } from "@/components/ui/text";

import { identifyPlant, searchPlantsInPerenual } from "../../api/ai";
import { getFolders } from "../../api/folders";

// Importăm componentele noastre modulare
import ImageSelector from "../../components/app/ui/AiPage/ImageSelector";
import ScanStatus from "../../components/app/ui/AiPage/ScanStatus";
import PlantSuggestionsList from "../../components/app/ui/AiPage/PlantSuggestionsList";
import AddPlantModal from "../../components/app/ui/AiPage/AddPlantAIModal";

export type PerenualPlant = {
  id: number;
  common_name: string;
  scientific_name: string[];
  default_image: { thumbnail: string } | null;
};

export default function ScanPlant() {
  const router = useRouter();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [folders, setFolders] = useState([]);
  const [selectedPlantToAdd, setSelectedPlantToAdd] =
    useState<PerenualPlant | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plantResult, setPlantResult] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<PerenualPlant[]>([]);
  const [isSearchingPerenual, setIsSearchingPerenual] = useState(false);

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const res = await getFolders();
        if (res.status === "success") {
          setFolders(res.data);
        }
      } catch (e) {
        console.error("Eroare la aducerea folderelor", e);
      }
    };
    loadFolders();
  }, []);

  const handleImageSelection = async (uri: string) => {
    setImageUri(uri);
    setPlantResult(null);
    setSuggestions([]);
    setIsAnalyzing(true);

    try {
      const aiResponse = await identifyPlant(uri);

      if (aiResponse.status === "success") {
        const foundName = aiResponse.scientific_name;
        setPlantResult(foundName);

        setIsSearchingPerenual(true);
        const perenualResponse = await searchPlantsInPerenual(foundName);

        if (perenualResponse.status === "success") {
          setSuggestions(perenualResponse.data);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong during the analysis.");
    } finally {
      setIsAnalyzing(false);
      setIsSearchingPerenual(false);
    }
  };

  const isUIBusy = isAnalyzing || isSearchingPerenual;

  return (
    <ScrollView
      className="flex-1 bg-background-light"
      contentContainerStyle={{
        padding: 24,
        paddingTop: 64,
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-4xl font-extrabold text-primary-950 mb-2 text-center">
        Scan Plant
      </Text>
      <Text className="text-gray-500 mb-8 text-center px-4">
        Take a picture or upload one to discover its scientific name.
      </Text>

      <ImageSelector
        imageUri={imageUri}
        onImageSelected={handleImageSelection}
        isDisabled={isUIBusy}
      />

      <ScanStatus
        isAnalyzing={isAnalyzing}
        plantResult={plantResult}
        isSearchingPerenual={isSearchingPerenual}
        hasSuggestions={suggestions.length > 0}
      />

      {!isSearchingPerenual && (
        <PlantSuggestionsList
          suggestions={suggestions}
          onAddPlant={(plant) => setSelectedPlantToAdd(plant)}
        />
      )}

      <AddPlantModal
        isOpen={!!selectedPlantToAdd}
        onClose={() => setSelectedPlantToAdd(null)}
        plant={selectedPlantToAdd}
        folders={folders}
        onSuccess={() => {
          Alert.alert("Success!", "Plant added to your garden!");
          router.replace("/(tabs)/plants");
        }}
      />
    </ScrollView>
  );
}
