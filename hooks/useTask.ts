import {
  createTask,
  deleteTask,
  deleteTaskMedia,
  getChildrenTaskById,
  getTaskById,
  getTasksByParent,
  getTasksForCurrentChild,
  submitTask,
  SubmitTaskPayload,
  updateTask,
  updateTaskStatus,
} from "@/services/taskService";
import { TaskFormPayload } from "@/types/TaskDto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTasksByChild(id: number) {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getChildrenTaskById(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskFormPayload) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Error creating task:", error);
    },
  });
}

export function useTaskById(id: string) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskById(id),
    enabled: !!id,
  });
}

export function useTasksForCurrentChild() {
  return useQuery({
    queryKey: ["tasks", "child", "me"],
    queryFn: getTasksForCurrentChild,
  });
}

export function useTasksByParent() {
  return useQuery({
    queryKey: ["tasks", "parent"],
    queryFn: getTasksByParent,
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskFormPayload }) =>
      updateTask(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: "pending" | "in_progress" | "completed" | "overdue";
    }) => updateTaskStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["task", String(id)] });

      queryClient.invalidateQueries({ queryKey: ["tasks", "parent"] });

      queryClient.invalidateQueries({ queryKey: ["tasks", "child", "me"] });
    },
  });
}

export function useSubmitTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitTaskPayload) => submitTask(payload),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["task", String(taskId)] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "parent"] });
    },
  });
}

export function useDeleteTaskMediaById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaId: number) => deleteTaskMedia(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "parent"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Erro ao deletar mídia:", error);
    },
  });
}
