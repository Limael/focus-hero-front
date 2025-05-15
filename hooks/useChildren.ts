// hooks/useChildren.ts
import { useQuery } from "@tanstack/react-query";
import { getChildren } from "@/services/userService";

export function useChildren() {
  return useQuery({
    queryKey: ["children"],
    queryFn: getChildren,
  });
}
