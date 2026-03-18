import React from "react";

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

export default function Home() {
  return (
    <Box className="flex-1 bg-white p-6 justify-center">
      <VStack space="xl" className="items-center w-full">
        <Heading className="text-3xl text-gray-800">Hellooo</Heading>

        <Button variant="outline">
          <ButtonText className="text-red-500">Bla</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
