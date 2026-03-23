import { Platform } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { Button, ButtonText } from "@/components/ui/button";
import { Badge, BadgeText } from "@/components/ui/badge";
import { useRouter } from "expo-router";

import StartPageImage from "../assets/StartPageImage.png";

export default function StartPage() {
  const router = useRouter();

  return (
    <Box className="flex-1 bg-primary-500">
      <Box className="flex-1 justify-center items-center pb-8 pt-8 px-6">
        <Box className="items-center pt-10">
          <Text className="text-white text-5xl font-bold tracking-tight mb-4">
            Plantino
          </Text>
        </Box>
      </Box>

      <Box className="relative h-[70%] w-full items-center">
        <Box className="absolute -top-5 w-[95%] h-20 bg-white/30 rounded-t-[2rem]" />

        <Box className="flex flex-col justify-between h-full w-full bg-white rounded-t-[2rem] shadow-2xl items-center px-6 pt-4 pb-12">
          <Image
            source={StartPageImage}
            alt="StartPageImg"
            className="aspect-[1/1] w-[23rem] h-[23rem]"
          />
          <Box className="w-full items-center justify-center px-4">
            <Badge
              className="mb-4 bg-primary-100/50 rounded-full"
              size="sm"
              variant="solid"
            >
              <BadgeText className="text-primary-900">
                With Plantino you Care
              </BadgeText>
            </Badge>

            <Text className="text-black text-center text-3xl font-extrabold leading-tight mb-6">
              Comprehensive plant care for your growing collection
            </Text>

            <Button
              className="w-full h-16 bg-primary-100 rounded-xl justify-center items-center shadow-hard-2"
              onPress={() => router.replace("/login")}
            >
              <ButtonText className="text-primary-900 text-xl font-bold">
                Get Started
              </ButtonText>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
