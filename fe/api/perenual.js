import { api } from "./api";

export const getPlantDetails = async (plantId) => {
  const response = await api.get(`/perenual/${plantId}`);
  return response.data;
};
