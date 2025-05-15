import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, logout as logoutService } from "@/services/authService";
import { api } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: number;
  email: string;
  name?: string;
  role: "parent" | "child";
};

type AuthContextData = {
  user: User | null;
  token: string | null;
  loading: boolean;
  loginAsParent: (email: string, password: string) => Promise<void>;
  loginAsChild: (
    email: string,
    name: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const storedToken = await getToken();
    if (!storedToken) return setLoading(false);

    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      const res = await api.get("/users/me");
      setUser(res.data);
      setToken(storedToken);
    } catch (err) {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const loginAsParent = async (email: string, password: string) => {
    const res = await api.post("auth/login", { email, password });
    const newToken = res.data.access_token;
    await AsyncStorage.setItem("@focusHero:token", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    const profile = await api.get("users/me");
    setUser(profile.data);
    setToken(newToken);
  };

  const loginAsChild = async (
    email: string,
    name: string,
    password: string
  ) => {
    const res = await api.post("/auth/child/login", {
      parentEmail: email,
      name,
      password,
    });
    const newToken = res.data.access_token;
    await AsyncStorage.setItem("@focusHero:token", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    const profile = await api.get("/users/me");
    setUser(profile.data);
    setToken(newToken);
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, loginAsParent, loginAsChild, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
