import axios from "axios";
import Constants from "expo-constants";

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl?.replace(/\/$/, ""), // Remove a barra final se houver
});

export default api;
