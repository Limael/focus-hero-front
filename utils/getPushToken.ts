import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function getPushToken(): Promise<string | null> {
  try {
    if (!Device.isDevice) {
      console.log("Push Notifications só funcionam em dispositivo físico.");
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
      console.log("Permissão de notificação negada.");
      return null;
    }

    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
    console.log("Expo push token:", expoPushToken);
    return expoPushToken;
  } catch (error) {
    console.error("Erro ao obter push token:", error);
    return null;
  }
}
