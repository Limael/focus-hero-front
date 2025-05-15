import RadialBackground from "@/components/RadialBackground";
import { Stack } from "expo-router";
import React from "react";
export default function AuthLayout() {
  return (
    <RadialBackground>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </RadialBackground>
  );
}
