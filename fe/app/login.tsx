import React, { useState } from "react";
import { Href, useRouter } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useForm, Controller, SubmitErrorHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField } from "@/components/ui/input";

import { login } from "../api/auth";
import AuthHeader from "@/components/app/auth/AuthHeader";
import GradientButton from "@/components/app/ui/GradientButton";

type LoginValues = {
  email: string;
  password: string;
};

const loginSchema = yup
  .object({
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

export default function LoginScreen() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { isDirty, dirtyFields, errors },
  } = useForm<LoginValues>({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data: LoginValues) => {
    try {
      const response = await login(data);

      await AsyncStorage.setItem("userToken", response.access_token);
      router.replace("/" as Href);
    } catch (error) {
      setError("Something went wrong! Try again!");
    }
  };

  const onError: SubmitErrorHandler<LoginValues> = (formErrors, e) => {
    setError("Please fill in all required fields.");
  };

  return (
    <Box className="flex-1 bg-primary-500">
      <AuthHeader
        nextRoute="/register"
        actionText="You don't have an account?"
        buttonText="Get Started"
      />
      <Box className="relative h-[70%] w-full items-center">
        <Box className="absolute -top-5 w-[95%] h-20 bg-white/30 rounded-t-[2rem]" />
        <VStack
          space="xl"
          className="h-full w-full bg-white rounded-t-[2rem] shadow-2xl items-center pt-4 pb-12"
        >
          <Box className="flex flex-col items-center gap-4 mt-8 mb-6">
            <Heading className="text-4xl text-center">Welcome back!</Heading>
            <Text className="text-black/70">Enter your details below</Text>
          </Box>

          <VStack space="xl" className="w-full px-10">
            <Box>
              <Text className="text-gray-600 mb-1">Email</Text>
              <Controller
                control={control}
                name="email"
                rules={{ required: "Required!" }}
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
                rules={{ required: "Required!" }}
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
                title="Login"
                onPress={handleSubmit(onSubmit, onError)}
              />

              <Button variant="link" onPress={() => router.push("/register" as Href)}>
                <ButtonText className="font-normal text-black/50">
                  You don&apos;t have an account? Register
                </ButtonText>
              </Button>
            </VStack>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}
