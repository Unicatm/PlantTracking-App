import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { getPlantsByFolder } from "@/api/plants";
import { deleteFolder } from "@/api/folders";
import FolderModal from "@/components/app/ui/Folders/FolderModal";
import AddPlantModal from "@/components/app/ui/Plants/AddPlantModal";

type Plant = {
  id: number;
  nickname: string;
  api_plant_id: number;
  folder_id: number;
  last_watered: string | null;
};

const formatWateringDate = (date: string | null) => {
  if (!date) {
    return "Not watered yet";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export default function FolderPlants() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();

  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddPlantModalVisible, setIsAddPlantModalVisible] = useState(false);
  const [folderName, setFolderName] = useState(name ?? "Garden");
  const [error, setError] = useState("");

  const fetchPlants = useCallback(
    async (showLoader = true) => {
      if (!id) {
        setError("Garden not found.");
        setIsLoading(false);
        return;
      }

      try {
        if (showLoader) {
          setIsLoading(true);
        }
        setError("");

        const response = await getPlantsByFolder(id);

        if (response.status === "success") {
          setPlants(response.data ?? []);
        }
      } catch (error) {
        setError("Error at getting the plants");
        console.error("Error at getting plants", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [id]
  );

  useFocusEffect(
    useCallback(() => {
      fetchPlants();
    }, [fetchPlants])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchPlants(false);
  };

  const handleDeleteFolder = () => {
    Alert.alert(
      "Delete garden",
      `Are you sure you want to delete "${folderName}"? All plants inside it will be deleted too.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFolder(id);
              router.back();
            } catch (error) {
              setError("Error at deleting the garden");
              console.error("Error at deleting garden", error);
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
    <Box className="flex-1 bg-background-light px-6 pt-16">
      <Box className="flex-row items-center gap-4 mb-6">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full bg-white items-center justify-center border border-gray-100"
        >
          <Ionicons name="chevron-back" size={24} color="#14532d" />
        </TouchableOpacity>

        <Box className="flex-1">
          <Text className="text-sm font-semibold text-primary-600">
            My Garden
          </Text>
          <Text
            className="text-3xl font-extrabold text-primary-950"
            numberOfLines={1}
          >
            {folderName}
          </Text>
        </Box>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsEditModalVisible(true)}
          className="w-11 h-11 rounded-full bg-white items-center justify-center border border-gray-100"
        >
          <Ionicons name="pencil-outline" size={21} color="#14532d" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsAddPlantModalVisible(true)}
          className="w-11 h-11 rounded-full bg-primary-500 items-center justify-center"
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDeleteFolder}
          className="w-11 h-11 rounded-full bg-red-50 items-center justify-center border border-red-100"
        >
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </TouchableOpacity>
      </Box>

      {error ? (
        <Box className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4">
          <Text className="text-red-600 font-medium">{error}</Text>
        </Box>
      ) : null}

      {plants.length === 0 ? (
        <Box className="items-center justify-center mt-32">
          <Ionicons name="leaf-outline" size={80} color="#d4d4d4" />
          <Text className="text-gray-500 text-lg mt-4 font-medium text-center">
            There are no plants in this garden yet.
          </Text>
        </Box>
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#22c55e"
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                router.push({
                  pathname: "/plant/[id]",
                  params: {
                    id: item.id.toString(),
                    apiPlantId: item.api_plant_id.toString(),
                    nickname: item.nickname,
                    lastWatered: item.last_watered ?? "",
                    folderName,
                  },
                })
              }
              className="bg-white p-4 rounded-2xl mb-4 border border-gray-50 shadow-soft-1"
            >
              <Box className="flex-row items-center gap-4">
                <Box className="w-12 h-12 rounded-full bg-primary-100 justify-center items-center">
                  <Ionicons name="leaf" size={24} color="#22c55e" />
                </Box>

                <Box className="flex-1">
                  <Text
                    className="text-xl font-bold text-gray-800"
                    numberOfLines={1}
                  >
                    {item.nickname || "Unnamed plant"}
                  </Text>
                  <Text className="text-gray-500 mt-1">
                    Last watered: {formatWateringDate(item.last_watered)}
                  </Text>
                </Box>

                <Ionicons name="chevron-forward" size={22} color="#a3a3a3" />
              </Box>
            </TouchableOpacity>
          )}
        />
      )}

      <FolderModal
        isOpen={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={(updatedName) => {
          if (updatedName) {
            setFolderName(updatedName);
          }
        }}
        folderToEdit={{ id: Number(id), name: folderName }}
      />

      <AddPlantModal
        folderId={id}
        isOpen={isAddPlantModalVisible}
        onClose={() => setIsAddPlantModalVisible(false)}
        onSuccess={() => fetchPlants(false)}
      />
    </Box>
  );
}
