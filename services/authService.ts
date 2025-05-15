import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

const TOKEN_KEY = "@focusHero:token";

export async function loginParent(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  const token = res.data.access_token;
  await AsyncStorage.setItem(TOKEN_KEY, token);
  return token;
}

export async function loginChild(
  parentEmail: string,
  name: string,
  password: string
) {
  const res = await api.post("/auth/child/login", {
    parentEmail,
    name,
    password,
  });
  const token = res.data.access_token;
  await AsyncStorage.setItem(TOKEN_KEY, token);
  return token;
}

export async function logout() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}
