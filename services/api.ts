import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { logout } from "./authService";

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.API_URL,
});

// Interceptor de requisição: injeta o token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@focusHero:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta: trata token expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expirado ou inválido. Realizando logout...");
      await logout(); // remove token do AsyncStorage
      // aqui você pode também emitir evento global, limpar zustand/contexto, etc.
    }
    return Promise.reject(error);
  }
);

export { api };
