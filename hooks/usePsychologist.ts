import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getParentsAndChildren,
  linkPsychologist,
  LinkPsychologistInput,
  PsychologistFamilyParent,
  unlinkParentFromPsychologist,
  unlinkPsychologistFromParent,
} from "@/services/userService";

export function useParentsAndChildren() {
  return useQuery<PsychologistFamilyParent[]>({
    queryKey: ["parents-and-children"],
    queryFn: getParentsAndChildren,
  });
}
export function useLinkPsychologist() {
  return useMutation({
    mutationFn: (data: LinkPsychologistInput) => linkPsychologist(data),
  });
}

export function useUnlinkPsychologistFromParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["unlinkPsychologistFromParent"],
    mutationFn: (id: number) => unlinkPsychologistFromParent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useUnlinkParentFromPsychologist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["unlinkParentFromPsychologist"],
    mutationFn: (id: number) => unlinkParentFromPsychologist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["parents-and-children"] });
    },
  });
}
