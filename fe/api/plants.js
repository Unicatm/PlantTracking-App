import { api } from "./api";

export const getPlantsByFolder = async (folderId) => {
  const response = await api.get(`/plants/${folderId}`);
  return response.data;
};

export const createPlant = async ({ apiPlantId, nickname, folderId }) => {
  const response = await api.post("/plants/", {
    api_plant_id: apiPlantId,
    nickname,
    folder_id: folderId,
  });
  return response.data;
};

export const updatePlant = async (plantId, data) => {
  const response = await api.put(`/plants/${plantId}`, data);
  return response.data;
};

export const deletePlant = async (plantId) => {
  const response = await api.delete(`/plants/${plantId}`);
  return response.data;
};

export const identifyPlant = async (formData) => {
  const response = await api.post("/plants/identify", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
