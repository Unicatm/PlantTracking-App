import { api } from "./api";

export const getFolders = async () => {
  const response = await api.get("/folders/");
  return response.data;
};

export const createFolder = async (name) => {
  const response = await api.post("/folders/", { name });
  return response.data;
};

export const updateFolder = async (folderId, name) => {
  const response = await api.put(`/folders/${folderId}`, { name });
  return response.data;
};

export const deleteFolder = async (folderId) => {
  const response = await api.delete(`/folders/${folderId}`);
  return response.data;
};
