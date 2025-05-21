export type RewardStatus = "available" | "redeemed" | "pending";

export type RewardDto = {
  id: number;
  description: string;
  requiredPoints: number;
  childId: number;
  status: RewardStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateRewardPayload = {
  description: string;
  requiredPoints: number;
  childId: number;
  status?: RewardStatus;
};

export type UpdateRewardPayload = {
  description?: string;
  requiredPoints?: number;
  status?: RewardStatus;
};
