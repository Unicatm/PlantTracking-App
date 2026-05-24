import { api } from "./api";

export const getPlantsByFolder = async (folderId) => {
  const response = await api.get(`/plants/${folderId}`);
  return response.data;
};
