// services/userService.ts
import { GetChildrenResponse, UpdateUserInput, UserBase } from "@/types/user";
import { api } from "./api";

export type Gender = "male" | "female" | "other";

export type CreateChildInput = {
  name: string;
  password: string;
  gender: Gender;
};
export type PsychologistFamilyChild = {
  id: number;
  name: string;
  email: string;
  gender: "male" | "female" | "other";
  role: "child";
};

export type PsychologistFamilyParent = {
  id: number;
  name: string;
  email: string;
  gender: "male" | "female" | "other";
  children: PsychologistFamilyChild[];
};

export async function getChildren(): Promise<GetChildrenResponse> {
  const response = await api.get<GetChildrenResponse>("/users/me/children");
  return response.data;
}

export async function createUserChild(data: CreateChildInput) {
  const response = await api.post("/auth/children", data);
  return response.data;
}

export async function updateUser({
  id,
  data,
}: {
  id: number;
  data: UpdateUserInput;
}): Promise<UserBase> {
  const response = await api.put<UserBase>(`/users/${id}`, data);
  return response.data;
}

export async function getParentsAndChildren(): Promise<
  PsychologistFamilyParent[]
> {
  const response = await api.get<PsychologistFamilyParent[]>(
    "/users/me/parents-and-children"
  );
  return response.data;
}

export type LinkPsychologistInput = {
  associationKey: string;
};

export async function linkPsychologist(data: LinkPsychologistInput) {
  const response = await api.post("/users/link-psychologist", data);
  return response.data;
}
