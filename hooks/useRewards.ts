import {
  getRewardsForCurrentChild,
  getRewardsForParent,
  createReward,
  updateReward,
  deleteReward,
  getRewardsByChildId,
  getRewardById,
  claimReward,
} from "@/services/rewards";
import {
  CreateRewardPayload,
  RewardDto,
  UpdateRewardPayload,
} from "@/types/RewardDto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Lista de recompensas do filho logado
export function useRewardsForCurrentChild() {
  return useQuery<RewardDto[]>({
    queryKey: ["rewards", "child", "me"],
    queryFn: getRewardsForCurrentChild,
  });
}
export function useRewardsByChildId(childId: number | undefined) {
  return useQuery<RewardDto[]>({
    queryKey: ["rewards", "child", childId],
    queryFn: () => getRewardsByChildId(childId!),
    enabled: !!childId,
  });
}

export function useRewardById(id?: string | number, options?: any) {
  return useQuery<RewardDto>({
    queryKey: ["reward", id],
    queryFn: () => getRewardById(id!),
    enabled: !!id,
    ...options,
  });
}

// Lista de recompensas dos filhos do pai logado
export function useRewardsForParent() {
  return useQuery<RewardDto[]>({
    queryKey: ["rewards", "parent"],
    queryFn: getRewardsForParent,
  });
}

// Criar recompensa
export function useCreateReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRewardPayload) => createReward(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards", "parent"] });
      queryClient.invalidateQueries({ queryKey: ["rewards", "child", "me"] });
    },
    onError: (error) => {
      console.error("Erro ao criar recompensa:", error);
    },
  });
}

// Atualizar recompensa
export function useUpdateReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRewardPayload }) =>
      updateReward(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["rewards", "parent"] });
      queryClient.invalidateQueries({ queryKey: ["rewards", "child", "me"] });
      queryClient.invalidateQueries({ queryKey: ["reward", id] });
    },
    onError: (error) => {
      console.error("Erro ao atualizar recompensa:", error);
    },
  });
}

// Deletar recompensa
export function useDeleteReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteReward(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards", "parent"] });
      queryClient.invalidateQueries({ queryKey: ["rewards", "child", "me"] });
    },
    onError: (error) => {
      console.error("Erro ao deletar recompensa:", error);
    },
  });
}

export function useClaimReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => claimReward(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["rewards", "child", "me"] });
      queryClient.invalidateQueries({ queryKey: ["rewards", "parent"] });
      queryClient.invalidateQueries({ queryKey: ["reward", id] });
    },
    onError: (error) => {
      console.error("Erro ao resgatar recompensa:", error);
    },
  });
}
