import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

interface AppModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  closeOnBackdropPress?: boolean;
  showCloseButton?: boolean;
  contentClassName?: string;
}

export default function AppModal({
  isOpen,
  title,
  description,
  children,
  footer,
  onClose,
  closeOnBackdropPress = true,
  showCloseButton = true,
  contentClassName = "",
}: AppModalProps) {
  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleBackdropPress}
        className="flex-1 bg-black/50 justify-center px-6"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
            className="w-full"
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => undefined}
              className={`w-full bg-white rounded-3xl p-6 shadow-2xl ${contentClassName}`}
            >
              {(title || description || showCloseButton) && (
                <Box className="flex-row items-start justify-between gap-4 pb-4">
                  <Box className="flex-1">
                    {title ? (
                      <Text className="text-2xl font-bold text-gray-800">
                        {title}
                      </Text>
                    ) : null}
                    {description ? (
                      <Text className="text-gray-500 mt-1">{description}</Text>
                    ) : null}
                  </Box>

                  {showCloseButton ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={onClose}
                      className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                    >
                      <Ionicons name="close" size={22} color="#525252" />
                    </TouchableOpacity>
                  ) : null}
                </Box>
              )}

              <Box>{children}</Box>

              {footer ? (
                <Box className="pt-6 flex-row justify-end gap-4 w-full">
                  {footer}
                </Box>
              ) : null}
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}
