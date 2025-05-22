// services/deviceTokenService.ts

import { api } from "./api";

export async function registerDeviceToken(token: string, userId: number) {
  await api.post("/notifications/device-token", { token, userId });
}
