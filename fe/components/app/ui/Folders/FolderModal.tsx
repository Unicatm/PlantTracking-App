import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import AppModal from "@/components/app/ui/AppModal";

import { createFolder, updateFolder } from "@/api/folders";

const folderSchema = yup
  .object({
    name: yup
      .string()
      .required("Name is mandatory!")
      .min(3, "Should have at least 3 characters!")
      .max(25, "Name too long!"),
  })
  .required();

type FolderValues = yup.InferType<typeof folderSchema>;

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name?: string) => void;
  folderToEdit?: { id: number; name: string } | null;
}

export default function FolderModal({
  isOpen,
  onClose,
  onSuccess,
  folderToEdit,
}: FolderModalProps) {
  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FolderValues>({
    resolver: yupResolver(folderSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (folderToEdit) {
      reset({ name: folderToEdit.name });
    } else {
      reset({ name: "" });
    }
  }, [folderToEdit, isOpen, reset]);

  const onSubmit = async (data: FolderValues) => {
    try {
      setServerError("");
      if (folderToEdit) {
        await updateFolder(folderToEdit.id, data.name);
      } else {
        await createFolder(data.name);
      }

      reset();
      onSuccess(data.name);
      onClose();
    } catch (error) {
      console.error("Error creating the folder:", error);
      setServerError("An error occurred! Try again!");
    }
  };

  const handleClose = () => {
    reset();
    setServerError("");
    onClose();
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      title={folderToEdit ? "Edit Garden" : "New Garden"}
      description={
        folderToEdit
          ? "Change the name of your plant collection."
          : "Give your new plant collection a name."
      }
      footer={
        <>
          <Button variant="link" onPress={handleClose} disabled={isSubmitting}>
            <ButtonText className="text-gray-500">Cancel</ButtonText>
          </Button>

          <Button
            className="bg-primary-500 rounded-xl px-6"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <ButtonText>
                {folderToEdit ? "Save Changes" : "Create"}
              </ButtonText>
            )}
          </Button>
        </>
      }
    >
      <Box className="py-2">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className={`w-full h-12 rounded-xl ${
                errors.name ? "border-red-500" : ""
              }`}
            >
              <InputField
                placeholder="e.g. Living Room, Balcony..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoFocus={false}
              />
            </Input>
          )}
        />
        {errors.name && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </Text>
        )}
        {serverError ? (
          <Text className="text-red-500 text-sm mt-1">{serverError}</Text>
        ) : null}
      </Box>
    </AppModal>
  );
}
