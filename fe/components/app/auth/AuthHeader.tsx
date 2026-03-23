import React from "react";
import { Href, useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { ChevronLeftIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";

interface AuthHeaderProps {
  nextRoute: string;
  actionText: string;
  buttonText: string;
}

export default function AuthHeader({
  nextRoute,
  actionText,
  buttonText,
}: AuthHeaderProps) {
  const router = useRouter();
  return (
    <Box className="flex-1 justify-center items-center pb-8 pt-2 px-6">
      <Box className="flex flex-row justify-between items-center w-full">
        <Button className="rounded-full p-3.5" onPress={() => router.back()}>
          <ButtonIcon as={ChevronLeftIcon} />
        </Button>
        <HStack space="md" className="items-center">
          <Text className="text-white/80">{actionText}</Text>
          <Button
            className="w-24 h-10 bg-white/20 rounded-md justify-center items-center shadow-hard-2 p-0 overflow-hidden"
            onPress={() => router.push(nextRoute as Href)}
          >
            <ButtonText className="font-normal text-white">
              {buttonText}
            </ButtonText>
          </Button>
        </HStack>
      </Box>
      <Box className="items-center pt-10">
        <Text className="text-white text-5xl font-bold tracking-tight mb-4">
          Plantino
        </Text>
      </Box>
    </Box>
  );
}
