import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

import { getUserProfile, logout } from "../api/auth";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
    } catch (error) {
      router.replace("/start");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();

    router.replace("/login");
  };

  if (isLoading) {
    return (
      <Box className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="mt-4 text-gray-600">Loading porfile...</Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-white p-6 justify-center">
      <VStack space="xl" className="items-center w-full">
        <Heading className="text-3xl text-gray-800">
          Hellooo, {user?.username}!
        </Heading>

        <Text className="text-gray-500 text-lg mb-8">{user?.email}</Text>

        <Button variant="outline" onPress={handleLogout}>
          <ButtonText className="text-red-500">Logout</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
