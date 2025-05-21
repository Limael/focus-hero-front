import { useParentsAndChildren } from "@/hooks/usePsychologist";
import React from "react";
import { ScrollView } from "react-native";
import { ParentAccordion } from "../ui/ParentAccordion";

export default function PsychologistFamiliesScreen() {
  const { data: parents = [], isLoading } = useParentsAndChildren();
  console.log("parents", parents);
  if (isLoading) return null;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {parents.map((parent) => (
        <ParentAccordion key={parent.id} parent={parent} />
      ))}
    </ScrollView>
  );
}
