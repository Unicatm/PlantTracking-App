import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";

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
  onSuccess: () => void;
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
  }, [folderToEdit, isOpen]);

  const onSubmit = async (data: FolderValues) => {
    try {
      setServerError("");
      if (folderToEdit) {
        await updateFolder(folderToEdit.id, data.name);
      } else {
        await createFolder(data.name);
      }

      reset();
      onSuccess();
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
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
        className="flex-1 bg-black/50 justify-center px-6"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
            className="w-full"
          >
            <Box className="w-full bg-white rounded-3xl p-6 shadow-2xl">
              <Box className="flex-col items-start gap-1 pb-4">
                <Text className="text-2xl font-bold text-gray-800">
                  {folderToEdit ? "Edit Garden" : "New Garden"}
                </Text>
                <Text className="text-gray-500">
                  {folderToEdit
                    ? "Change the name of your plant collection."
                    : "Give your new plant collection a name."}
                </Text>
              </Box>

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
                  <Text className="text-red-500 text-sm mt-1">
                    {serverError}
                  </Text>
                ) : null}
              </Box>

              <Box className="pt-6 flex-row justify-end gap-4 w-full">
                <Button
                  variant="link"
                  onPress={handleClose}
                  disabled={isSubmitting}
                >
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
              </Box>
            </Box>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}
