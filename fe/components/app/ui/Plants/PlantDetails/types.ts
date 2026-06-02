export type PlantDetails = {
  common_name?: string;
  scientific_name?: string[] | string;
  description?: string;
  watering_general_benchmark?: {
    unit?: string;
    value?: string;
  };
  sunlight?: string[] | string;
  cycle?: string;
  care_level?: string;
  default_image?: {
    regular_url?: string;
    medium_url?: string;
    original_url?: string;
  };
};

export type Watering = {
  id: number;
  plant_id: number;
  watered_at: string;
};

export type PlantDetailsTab = "general" | "details" | "history";
