import { api } from "./api";

export const getPlantsByFolder = async (folderId) => {
  const response = await api.get(`/plants/${folderId}`);
  return response.data;
};

export const deletePlant = async (plantId) => {
  const response = await api.delete(`/plants/${plantId}`);
  return response.data;
};
