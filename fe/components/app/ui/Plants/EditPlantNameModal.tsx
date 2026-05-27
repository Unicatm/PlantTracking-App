import React from "react";
import { ActivityIndicator } from "react-native";

import AppModal from "@/components/app/ui/AppModal";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";

interface EditPlantNameModalProps {
  isOpen: boolean;
  isSaving: boolean;
  name: string;
  onChangeName: (name: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function EditPlantNameModal({
  isOpen,
  isSaving,
  name,
  onChangeName,
  onClose,
  onSave,
}: EditPlantNameModalProps) {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit plant name"
      description="Change the nickname shown in your garden."
      footer={
        <>
          <Button variant="link" onPress={onClose} disabled={isSaving}>
            <ButtonText className="text-gray-500">Cancel</ButtonText>
          </Button>

          <Button className="rounded-xl px-6" onPress={onSave} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <ButtonText>Save</ButtonText>
            )}
          </Button>
        </>
      }
    >
      <Input className="h-12 rounded-xl">
        <InputField
          placeholder="Plant nickname"
          value={name}
          onChangeText={onChangeName}
          autoFocus={true}
        />
      </Input>
    </AppModal>
  );
}
