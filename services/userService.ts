// services/userService.ts
import { api } from "./api";

export async function getChildren() {
  const response = await api.get("/users/me/children");
  return response.data;
}
