import type { PlantDetails } from "./types";

export const formatWateringDate = (date: string) => {
  if (!date) {
    return "Not watered yet";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export const formatWateringDateTime = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

export const formatValue = (value?: string[] | string) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not available";
  }

  return value || "Not available";
};

export const formatWateringBenchmark = (
  benchmark?: PlantDetails["watering_general_benchmark"]
) => {
  if (!benchmark?.value) {
    return "Not available";
  }

  const value = benchmark.value.replaceAll('"', "");

  return benchmark.unit ? `${value} ${benchmark.unit}` : value;
};
