import { TaskFormPayload } from "@/types/TaskDto";

export function buildTaskFormData(payload: TaskFormPayload) {
  const formData = new FormData();

  formData.append("description", payload.description);
  formData.append("points", String(payload.points));
  formData.append("childId", String(payload.childId));

  if (payload.dueDate) {
    formData.append("dueDate", payload.dueDate);
  }
  if (payload.steps) {
    formData.append("steps", JSON.stringify(payload.steps));
  }
  if (payload.status) {
    formData.append("status", payload.status);
  }
  if (payload.media && payload.media.length > 0) {
    formData.append("media", JSON.stringify(payload.media));
  }
  if (payload.mediaFiles && payload.mediaFiles.length > 0) {
    payload.mediaFiles.forEach((file) => {
      formData.append("mediaFiles", file as any);
    });
  }
  return formData;
}
