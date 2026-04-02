import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setIsLoggedIn(!!token);
      setIsReady(true);
    };
    checkToken();
  }, []);

  const loginAuth = async (token: string) => {
    await AsyncStorage.setItem("userToken", token);
    setIsLoggedIn(true);
    router.replace("/(tabs)/home");
  };

  const logoutAuth = async () => {
    await AsyncStorage.removeItem("userToken");
    setIsLoggedIn(false);
    router.replace("/start");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isReady, loginAuth, logoutAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
