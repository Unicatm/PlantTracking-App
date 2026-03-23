import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const register = async (credentials) => {
  const response = await api.post("/auth/register", credentials);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/user/me");
  return response.data.data;
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem("userToken");
  } catch (error) {
    console.error("Error at deleting the token", error);
  }
};
