import { getChildrenTaskById } from "@/services/taskService";
import { useQuery } from "@tanstack/react-query";

export function useTasksByChild(id: number) {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getChildrenTaskById(id),
    enabled: !!id,
  });
}
