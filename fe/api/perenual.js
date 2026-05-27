import { api } from "./api";

export const searchPlants = async (query) => {
  const response = await api.get("/perenual/", {
    params: { q: query },
  });
  return response.data;
};

export const getPlantsPage = async (page = 1) => {
  const response = await api.get("/perenual/", {
    params: { page },
  });
  return response.data;
};

export const getPlantDetails = async (plantId) => {
  const response = await api.get(`/perenual/${plantId}`);
  return response.data;
};
