// services/userService.ts
import { buildTaskFormData } from "@/utils/buildTaskFormData";
import { api } from "./api";
import { TaskDto, TaskFormPayload } from "@/types/TaskDto";

export async function getChildrenTaskById(id: number): Promise<TaskDto[]> {
  const response = await api.get(`/tasks/child/${id}`);
  return response.data;
}

export async function createTask(payload: TaskFormPayload) {
  const formData = buildTaskFormData(payload);
  const response = await api.postForm("/tasks", formData);
  return response.data;
}

export async function getTaskById(id: string): Promise<TaskDto> {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
}

export async function getTasksByChild(childId: string): Promise<TaskDto[]> {
  const response = await api.get(`/tasks/child/${childId}`);
  return response.data;
}

export async function getTasksForCurrentChild(): Promise<TaskDto[]> {
  const response = await api.get(`/tasks/child`);
  return response.data;
}

export async function getTasksByParent(): Promise<TaskDto[]> {
  const response = await api.get(`/tasks/parent`);
  return response.data;
}

export async function updateTask(
  id: number,
  payload: TaskFormPayload
): Promise<TaskDto> {
  const formData = buildTaskFormData(payload);

  const response = await api.putForm(`/tasks/edit/${id}`, formData);
  return response.data;
}

export async function updateTaskStatus(
  id: number,
  status: "pending" | "in_progress" | "completed" | "overdue"
) {
  const response = await api.put(`/tasks/${id}`, { status });
  return response.data;
}

export async function deleteTask(id: number) {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
}

export type SubmitTaskPayload = {
  taskId: number;
  totalTime: number;
  mediaFiles: {
    uri: string;
    name: string;
    type: string;
  }[];
};

export async function submitTask(payload: SubmitTaskPayload) {
  const { taskId, totalTime, mediaFiles } = payload;

  const formData = new FormData();
  formData.append("totalTime", String(totalTime));

  mediaFiles.forEach((file) => {
    formData.append("media", {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);
  });

  const response = await api.postForm(`/tasks/submit/${taskId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function deleteTaskMedia(mediaId: number) {
  const response = await api.delete(`/tasks/media/${mediaId}`);
  return response.data;
}
