import React, { useState, useEffect } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";

import { createPlant } from "@/api/plants";
import AppModal from "@/components/app/ui/AppModal";

interface AddPlantAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plant: any | null;
  folders: { id: number; name: string }[];
}

export default function AddPlantAIModal({
  isOpen,
  onClose,
  onSuccess,
  plant,
  folders,
}: AddPlantAIModalProps) {
  const [nickname, setNickname] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (plant) {
      setNickname(plant.common_name || plant.scientific_name[0] || "");
      setSelectedFolderId(null);
      setError("");
    }
  }, [plant, isOpen]);

  const handleSave = async () => {
    if (!selectedFolderId) {
      setError("Please select a garden folder!");
      return;
    }
    if (!nickname.trim()) {
      setError("Please give your plant a nickname!");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await createPlant({
        apiPlantId: plant.id,
        nickname: nickname.trim(),
        folderId: selectedFolderId,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError("Something went wrong. Try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!plant) return null;

  const modalFooter = (
    <>
      <Button variant="link" onPress={onClose} disabled={isSubmitting}>
        <ButtonText className="text-gray-500">Cancel</ButtonText>
      </Button>

      <Button
        className="bg-primary-500 rounded-xl px-6"
        onPress={handleSave}
        disabled={isSubmitting || !selectedFolderId}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <ButtonText>Save Plant</ButtonText>
        )}
      </Button>
    </>
  );

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add to Garden"
      description={`Customize your new ${plant.common_name}.`}
      footer={modalFooter}
      showCloseButton={false}
    >
      <Box className="mb-4">
        <Text className="text-sm font-bold text-gray-700 mb-1">
          Plant Nickname
        </Text>
        <Input className="w-full h-12 rounded-xl">
          <InputField
            placeholder="e.g. My lovely Ficus"
            value={nickname}
            onChangeText={setNickname}
            autoFocus={false}
          />
        </Input>
      </Box>

      <Box className="mb-4">
        <Text className="text-sm font-bold text-gray-700 mb-2">
          Select a Garden
        </Text>
        {folders.length === 0 ? (
          <Text className="text-red-500 text-sm">
            You need to create a folder first!
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-2"
          >
            {folders.map((folder) => {
              const isSelected = selectedFolderId === folder.id;
              return (
                <Button
                  key={folder.id}
                  onPress={() => setSelectedFolderId(folder.id)}
                  className={`px-5 py-2 mr-2 rounded-full border ${
                    isSelected
                      ? "bg-green-200 border-green-400"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <Text
                    className={`${
                      isSelected ? "font-bold text-green-700" : "text-gray-600"
                    }`}
                  >
                    {folder.name}
                  </Text>
                </Button>
              );
            })}
          </ScrollView>
        )}
      </Box>

      {error ? <Text className="text-red-500 text-sm">{error}</Text> : null}
    </AppModal>
  );
}
