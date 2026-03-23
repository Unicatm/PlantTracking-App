import React from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { LinearGradient } from "expo-linear-gradient";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
}

export default function GradientButton({
  title,
  onPress,
}: GradientButtonProps) {
  return (
    <Button
      className="w-full h-16 rounded-xl justify-center items-center shadow-hard-2 p-0 overflow-hidden"
      onPress={onPress}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={["#51c777", "#aac90c"]}
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ButtonText className="text-white font-bold">{title}</ButtonText>
      </LinearGradient>
    </Button>
  );
}
