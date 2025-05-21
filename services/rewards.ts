import {
  CreateRewardPayload,
  RewardDto,
  UpdateRewardPayload,
} from "@/types/RewardDto";
import { api } from "./api";

export async function createReward(
  payload: CreateRewardPayload
): Promise<RewardDto> {
  const response = await api.post("/rewards", payload);
  return response.data;
}

export async function getRewardsForCurrentChild(): Promise<RewardDto[]> {
  const response = await api.get("/rewards/child");
  return response.data;
}
export async function getRewardsByChildId(id: number): Promise<RewardDto[]> {
  const response = await api.get(`/rewards/child/${id}`);
  return response.data;
}

export async function getRewardById(id: string | number): Promise<RewardDto> {
  const response = await api.get(`/rewards/${id}`);
  return response.data;
}

export async function getRewardsForParent(): Promise<RewardDto[]> {
  const response = await api.get("/rewards/parent");
  return response.data;
}

export async function updateReward(
  id: number,
  data: UpdateRewardPayload
): Promise<RewardDto> {
  const response = await api.put(`/rewards/${id}`, data);
  return response.data;
}

export async function deleteReward(id: number): Promise<RewardDto> {
  const response = await api.delete(`/rewards/${id}`);
  return response.data;
}

export async function claimReward(id: number): Promise<RewardDto> {
  const response = await api.put(`/rewards/${id}/claim`);
  return response.data;
}
