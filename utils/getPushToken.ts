import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform, Alert } from "react-native";

function handleRegistrationError(errorMessage: string) {
  Alert.alert("Erro ao registrar notificação", errorMessage);
  throw new Error(errorMessage);
}

export async function getPushToken() {
  try {
    if (!Device.isDevice) {
      handleRegistrationError(
        "Notificações push requerem um dispositivo físico."
      );
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      handleRegistrationError("Permissão para notificações foi negada.");
      return null;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      handleRegistrationError(
        "Project ID não encontrado nas configurações do Expo."
      );
      return null;
    }

    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    return pushTokenString;
  } catch (error: any) {
    handleRegistrationError(
      error?.message || "Erro inesperado ao registrar notificações push."
    );
    return null;
  }
}
