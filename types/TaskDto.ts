export type TaskStepDto = {
  id: number;
  taskId: number;
  order: number;
  instruction: string;
};

export type TaskMediaDto = {
  id: number;
  taskId: number;
  type: string;
  url: string;
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
};
