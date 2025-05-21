// hooks/useChildren.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateChildInput,
  createUserChild,
  getChildren,
  updateUser,
} from "@/services/userService";
import { UpdateUserInput } from "@/types/user";

export function useChildren() {
  return useQuery({
    queryKey: ["children"],
    queryFn: getChildren,
  });
}

export function useCreateChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateChildInput) => createUserChild(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserInput }) =>
      updateUser({ id, data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["children"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
