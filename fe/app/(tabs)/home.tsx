import React from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { useAuth } from "@/context/AuthContext";

export default function home() {
  const { logoutAuth } = useAuth();

  const onLogout = async () => {
    await logoutAuth();
  };
  return (
    <Box className="h-full items-center justify-center">
      <Button onPress={onLogout} variant="solid" size="md">
        <ButtonText>Logout</ButtonText>
      </Button>
    </Box>
  );
}
