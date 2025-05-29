import { User } from "@/context/AuthContext";
import { api } from "./api";


// Buscar o perfil do usuário autenticado
export async function getProfile(): Promise<User> {
  const response = await api.get<User>("users/me");
  return response.data;
}

// Se quiser, já deixa aqui função para atualizar também (exemplo):
export type UpdateProfileInput = Partial<
  Pick<User, "name" | "email" | "gender">
>;
export async function updateProfile(data: UpdateProfileInput): Promise<User> {
  const response = await api.put<User>("/users/me", data);
  return response.data;
}
