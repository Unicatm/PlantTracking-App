import React from "react";

import { Box } from "@/components/ui/box";
import DetailRow from "./DetailRow";
import {
  formatValue,
  formatWateringBenchmark,
  formatWateringDate,
} from "./formatters";
import type { PlantDetails } from "./types";

interface GeneralPlantInfoProps {
  details: PlantDetails | null;
  lastWatered: string;
}

export default function GeneralPlantInfo({
  details,
  lastWatered,
}: GeneralPlantInfoProps) {
  return (
    <Box>
      <DetailRow
        icon="water-outline"
        label="Last watered"
        value={formatWateringDate(lastWatered)}
      />
      <DetailRow
        icon="repeat-outline"
        label="Watering period"
        value={formatWateringBenchmark(details?.watering_general_benchmark)}
      />
      <DetailRow
        icon="sunny-outline"
        label="Light preference"
        value={formatValue(details?.sunlight)}
      />
      <DetailRow
        icon="leaf-outline"
        label="Growth cycle"
        value={formatValue(details?.cycle)}
      />
      <DetailRow
        icon="heart-outline"
        label="Care level"
        value={formatValue(details?.care_level)}
      />
    </Box>
  );
}
