import React, { useState } from "react";
import { useRouter, Href } from "expo-router";
import { useForm, Controller, SubmitErrorHandler } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import AuthHeader from "@/components/app/auth/AuthHeader";
import GradientButton from "@/components/app/ui/GradientButton";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField } from "@/components/ui/input";

import { register } from "../api/auth";

type RegisterValues = {
  username: string;
  email: string;
  password: string;
};

const registerSchema = yup
  .object({
    username: yup
      .string()
      .required("Username is required.")
      .min(3, "Username must be at least 3 characters."),
    email: yup
      .string()
      .required("Email is required.")
      .email("Please enter a valid email address."),
    password: yup
      .string()
      .required("Password is required.")
      .min(6, "Password must be at least 6 characters."),
  })
  .required();

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<RegisterValues>({ resolver: yupResolver(registerSchema) });

  const onSubmit = async (data: RegisterValues) => {
    try {
      await register(data);

      router.replace("/login" as Href);
    } catch (err) {
      setError("Something went wrong! Try again!");
    }
  };

  const onError: SubmitErrorHandler<RegisterValues> = (formErrors, e) => {
    setError("Please fill in all required fields.");
  };

  return (
    <Box className="flex-1 bg-primary-500">
      <AuthHeader
        nextRoute="/login"
        actionText="Already have an account?"
        buttonText="Log In"
      />

      <Box className="relative h-[70%] w-full items-center">
        <Box className="absolute -top-5 w-[95%] h-20 bg-white/30 rounded-t-[2rem]" />
        <VStack
          space="xl"
          className="h-full w-full bg-white rounded-t-[2rem] shadow-2xl items-center pt-4 pb-12"
        >
          <Box className="flex flex-col items-center gap-4 mt-8 mb-6">
            <Heading className="text-4xl text-center">
              Get started free!
            </Heading>
            <Text className="text-black/70">Create an account</Text>
          </Box>

          <VStack space="xl" className="w-full px-10">
            <Box>
              <Text className="text-gray-600 mb-1">Username</Text>
              <Controller
                control={control}
                name="username"
                rules={{ required: "Required!" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    className={`w-full h-12 rounded-xl ${errors.username && dirtyFields.username ? "border-red-500" : ""}`}
                  >
                    <InputField
                      placeholder="PlantLover99"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                    />
                  </Input>
                )}
              />
              {errors.username && dirtyFields.username && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text className="text-gray-600 mb-1">Email</Text>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "Required!",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email adress not valid",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    className={`w-full h-12 rounded-xl ${errors.email && dirtyFields.email ? "border-red-500" : ""}`}
                  >
                    <InputField
                      placeholder="name@example.com"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </Input>
                )}
              />
              {errors.email && dirtyFields.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text className="text-gray-600 mb-1">Password</Text>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Required!",
                  minLength: {
                    value: 6,
                    message: "Password must have at least 6 characters!",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    className={`w-full h-12 rounded-xl ${errors.password && dirtyFields.password ? "border-red-500" : ""}`}
                  >
                    <InputField
                      placeholder="********"
                      type="password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry
                    />
                  </Input>
                )}
              />
              {errors.password && dirtyFields.password && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </Text>
              )}
            </Box>
            {error && isDirty && (
              <Text className="text-primary-900 text-sm mt-1">{error}</Text>
            )}

            <VStack space="md">
              <GradientButton
                title="Register"
                onPress={handleSubmit(onSubmit, onError)}
              />

              <Button
                variant="link"
                onPress={() => router.push("/login" as Href)}
              >
                <ButtonText className="font-normal text-black/50">
                  Do you already have an account? Login
                </ButtonText>
              </Button>
            </VStack>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}
