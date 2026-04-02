import { api } from "./api";

export const getFolders = async () => {
  const response = await api.get("/folders/");
  return response.data;
};
