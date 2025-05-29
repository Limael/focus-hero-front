export type TaskStepDto = {
  id: number;
  taskId: number;
  order: number;
  instruction: string;
};
export type TaskMediaDto = {
  id: number;
  taskId: number;
  type: "image" | "video";
  url: string;
};

export type TaskSubmissionMediaDto = {
  id: number;
  submissionId: number;
  type: "image" | "video";
  url: string;
};

export type TaskSubmissionDto = {
  id: number;
  taskId: number;
  childId: number;
  totalTime: number;
  createdAt: string;
  media: TaskSubmissionMediaDto[];
};

export type TaskDto = {
  id: number;
  description: string;
  status: "pending" | "in_progress" | "completed";
  points: number;
  dueDate: string;
  parentId: number;
  childId: number;
  createdAt: string;
  updatedAt: string;
  steps: TaskStepDto[];
  media: TaskMediaDto[];
  submission: TaskSubmissionDto;
};

export type CreateTaskInput = {
  description: string;
  points: number;
  childId: number;
  dueDate?: string;
  steps?: Omit<TaskStepDto, "id" | "taskId">[];
  mediaFiles?: (File | Blob)[];
};

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  status?: "pending" | "in_progress" | "completed" | "overdue";
};

export type TaskFormPayload = {
  description: string;
  dueDate?: string;
  points: number;
  childId: number;
  steps?: Array<{
    order: number;
    instruction: string;
  }>;
  status?: "pending" | "in_progress" | "completed" | "overdue";
  mediaFiles?: {
    uri: string;
    name: string;
    type: string;
  }[];
  media?: { url: string; type: string }[];
};
