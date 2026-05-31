import React, { useState } from "react";
import { ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppModal from "@/components/app/ui/AppModal";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { createPlant } from "@/api/plants";
import { searchPlants } from "@/api/perenual";

type PerenualPlant = {
  id: number;
  common_name?: string;
  scientific_name?: string[] | string;
  default_image?: {
    thumbnail?: string;
    regular_url?: string;
  };
};

interface AddPlantModalProps {
  folderId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const formatScientificName = (name?: string[] | string) => {
  if (Array.isArray(name)) {
    return name.join(", ");
  }

  return name ?? "Unknown species";
};

export default function AddPlantModal({
  folderId,
  isOpen,
  onClose,
  onSuccess,
}: AddPlantModalProps) {
  const [query, setQuery] = useState("");
  const [nickname, setNickname] = useState("");
  const [results, setResults] = useState<PerenualPlant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PerenualPlant | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const resetModal = () => {
    setQuery("");
    setNickname("");
    setResults([]);
    setSelectedPlant(null);
    setIsSearching(false);
    setIsSaving(false);
    setError("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleSearch = async () => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setError("Search for at least 2 characters.");
      return;
    }

    try {
      setIsSearching(true);
      setError("");
      setSelectedPlant(null);

      const response = await searchPlants(trimmedQuery);
      setResults(response.data ?? []);
    } catch (error) {
      setError("Error at searching plants.");
      console.error("Error at searching plants", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlant = (plant: PerenualPlant) => {
    const plantName =
      plant.common_name || formatScientificName(plant.scientific_name);

    setSelectedPlant(plant);
    setNickname(plantName);
  };

  const handleAddPlant = async () => {
    const trimmedNickname = nickname.trim();

    if (!selectedPlant) {
      setError("Choose a plant from the list.");
      return;
    }

    if (trimmedNickname.length < 2) {
      setError("Nickname should have at least 2 characters.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      await createPlant({
        apiPlantId: selectedPlant.id,
        nickname: trimmedNickname,
        folderId,
      });

      onSuccess();
      handleClose();
    } catch (error) {
      setError("Error at adding the plant.");
      console.error("Error at adding plant", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Plant"
      description="Search and add a plant to this garden."
      contentClassName="max-h-[88%]"
      footer={
        <>
          <Button variant="link" onPress={handleClose} disabled={isSaving}>
            <ButtonText className="text-gray-500">Cancel</ButtonText>
          </Button>

          <Button
            className="rounded-xl px-6"
            onPress={handleAddPlant}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <ButtonText>Add Plant</ButtonText>
            )}
          </Button>
        </>
      }
    >
      <Box className="flex-row gap-3 mb-4">
        <Input className="flex-1 h-12 rounded-xl">
          <InputField
            placeholder="Search plant name..."
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
        </Input>

        <Button
          className="h-12 rounded-xl px-4"
          onPress={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Ionicons name="search" size={20} color="white" />
          )}
        </Button>
      </Box>

      {selectedPlant ? (
        <Box className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2">Nickname</Text>
          <Input className="h-12 rounded-xl">
            <InputField
              placeholder="Give your plant a nickname"
              value={nickname}
              onChangeText={setNickname}
            />
          </Input>
        </Box>
      ) : null}

      {error ? <Text className="text-red-500 text-sm mb-3">{error}</Text> : null}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="max-h-80"
        ListEmptyComponent={
          <Box className="items-center py-10">
            <Ionicons name="search-outline" size={46} color="#d4d4d4" />
            <Text className="text-gray-500 font-medium mt-3 text-center">
              Search for a plant to add it here.
            </Text>
          </Box>
        }
        renderItem={({ item }) => {
          const imageUrl =
            item.default_image?.thumbnail ?? item.default_image?.regular_url;
          const isSelected = selectedPlant?.id === item.id;

          return (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => handleSelectPlant(item)}
              className={`flex-row items-center gap-3 p-3 rounded-2xl mb-3 border ${
                isSelected
                  ? "bg-primary-50 border-primary-300"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <Box className="w-12 h-12 rounded-full bg-primary-100 overflow-hidden items-center justify-center">
                {imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="leaf" size={23} color="#22c55e" />
                )}
              </Box>

              <Box className="flex-1">
                <Text
                  className="text-gray-800 font-bold text-base"
                  numberOfLines={1}
                >
                  {item.common_name || "Unnamed plant"}
                </Text>
                <Text className="text-gray-500 mt-1" numberOfLines={1}>
                  {formatScientificName(item.scientific_name)}
                </Text>
              </Box>

              {isSelected ? (
                <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              ) : null}
            </TouchableOpacity>
          );
        }}
      />
    </AppModal>
  );
}
