import { useMutation, useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/profileService";
import { User } from "@/context/AuthContext";

export function useProfile() {
  return useQuery<User | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        return await getProfile();
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
