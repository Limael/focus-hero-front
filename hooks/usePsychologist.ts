import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getParentsAndChildren,
  linkPsychologist,
  LinkPsychologistInput,
  PsychologistFamilyParent,
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
