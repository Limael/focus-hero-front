import React, { createContext, useContext } from "react";
import { useProfile } from "@/hooks/useProfile";
import { getToken, logout as logoutService } from "@/services/authService";
import { api } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { getPushToken } from "@/utils/getPushToken";
import { registerDeviceToken } from "@/services/deviceTokenService";

export type Psychologist = { id: number; name: string; email: string };
export type Parent = {
  id: number;
  name: string;
  email: string;
  psychologist?: Psychologist | null;
};
export type User = {
  id: number;
  email: string;
  name: string;
  role: "parent" | "child" | "psychologist";
  gender?: "male" | "female" | "other";
  parent?: Parent | null;
  psychologist?: Psychologist | null;
  associationKey?: string;
  points?: number;
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
  const {
    data: user,
    isLoading: loadingUser,
    refetch: refetchUser,
  } = useProfile();
  const [token, setToken] = React.useState<string | null>(null);
  const [loadingToken, setLoadingToken] = React.useState(true);

  const queryClient = useQueryClient();

  React.useEffect(() => {
    (async () => {
      const storedToken = await getToken();
      if (storedToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        setToken(storedToken);
      }

      setLoadingToken(false);
    })();
  }, []);

  const loginAsParent = async (email: string, password: string) => {
    const res = await api.post("auth/login", { email, password });
    const newToken = res.data.access_token;
    await AsyncStorage.setItem("@focusHero:token", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setToken(newToken);

    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    await refetchUser();
  };

  const loginAsChild = async (
    email: string,
    name: string,
    password: string
  ) => {
    const res = await api.post("/auth/child-login", {
      parentEmail: email,
      name,
      password,
    });
    const newToken = res?.data?.access_token;
    await AsyncStorage.setItem("@focusHero:token", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setToken(newToken);

    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    await refetchUser();

    const expoPushToken = await getPushToken();
    console.log("expoPushToken", expoPushToken);
    /* if (expoPushToken && user?.id) {
      await registerDeviceToken(expoPushToken, user.id);
    }
 */
  };

  const logout = async () => {
    await logoutService();
    setToken(null);
    delete api.defaults.headers.common["Authorization"];

    await queryClient.removeQueries({ queryKey: ["profile"] });

    await refetchUser();
  };

  const loading = loadingUser || loadingToken;

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        token,
        loading,
        loginAsParent,
        loginAsChild,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
