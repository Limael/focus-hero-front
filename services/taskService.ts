// services/userService.ts
import { api } from "./api";
import { TaskDto } from "@/types/TaskDto";

export async function getChildrenTaskById(id: number): Promise<TaskDto[]> {
  const response = await api.get(`/tasks/child/${id}`);
  return response.data;
}
