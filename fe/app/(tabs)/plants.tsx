import React, { useEffect, useState } from "react";
import { FlatList, ActivityIndicator, Alert } from "react-native";
import { useRouter, Href } from "expo-router";

import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Ionicons } from "@expo/vector-icons";

import { deleteFolder, getFolders } from "../../api/folders";
import FolderCard from "@/components/app/ui/Folders/FolderCard";
import { Button, ButtonIcon } from "@/components/ui/button";
import { AddIcon } from "@/components/ui/icon";
import CreateFolderModal from "@/components/app/ui/Folders/FolderModal";

type Folder = {
  id: number;
  name: string;
};

export default function Plants() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const router = useRouter();

  const fetchFolders = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getFolders();

      if (response.status === "success") {
        setFolders(response.data ?? []);
      }
    } catch (error) {
      setError("Error at getting the folders");
      console.error("Error at getting folders", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleDeleteFolder = (folder: Folder) => {
    Alert.alert(
      "Delete garden",
      `Are you sure you want to delete "${folder.name}"? All plants inside it will be deleted too.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFolder(folder.id);
              setFolders((currentFolders) =>
                currentFolders.filter((item) => item.id !== folder.id)
              );
            } catch (error) {
              setError("Error at deleting the folder");
              console.error("Error at deleting folder", error);
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
      <Box className="flex flex-row justify-between">
        <Text className="text-4xl font-extrabold text-primary-950 mb-6">
          My Gardens
        </Text>

        <Button
          variant="solid"
          size="md"
          className="rounded-full p-4"
          onPress={() => setIsModalVisible(true)}
        >
          <ButtonIcon as={AddIcon} />
        </Button>
      </Box>

      {folders?.length === 0 ? (
        <Box className="items-center justify-center mt-32">
          <Ionicons name="leaf-outline" size={80} color="#d4d4d4" />
          <Text className="text-gray-500 text-lg mt-4 font-medium">
            {error || "You don't have any folders yet."}
          </Text>
        </Box>
      ) : (
        <FlatList
          data={folders}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <FolderCard
              name={item.name}
              onDelete={() => handleDeleteFolder(item)}
              onPress={() =>
                router.push({
                  pathname: "/folder/[id]",
                  params: { id: item.id.toString(), name: item.name },
                } as Href)
              }
            />
          )}
        />
      )}
      <CreateFolderModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={fetchFolders}
      />
    </Box>
  );
}
