import { api } from "./api";

export const identifyPlant = async (imageUri) => {
  const formData = new FormData();

  const filename = imageUri.split("/").pop() || "plant.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image/jpeg`;

  formData.append("image", {
    uri: imageUri,
    name: filename,
    type: type,
  });

  const response = await api.post("/plants/identify", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const searchPlantsInPerenual = async (plantName) => {
  const response = await api.get(`/plants/search-perenual?q=${plantName}`);
  return response.data;
};
