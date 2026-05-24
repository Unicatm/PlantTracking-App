import { Stack } from "expo-router";
import "react-native-reanimated";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="start"
            options={{ title: "Start", headerShown: false }}
          />
          <Stack.Screen
            name="login"
            options={{ title: "Login", headerShown: false }}
          />
          <Stack.Screen
            name="register"
            options={{ title: "Register", headerShown: false }}
          />
          <Stack.Screen
            name="folder/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="plant/[id]"
            options={{ headerShown: false }}
          />
        </Stack>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
