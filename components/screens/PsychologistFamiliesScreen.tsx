import { useParentsAndChildren } from "@/hooks/usePsychologist";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { ParentAccordion } from "../ui/ParentAccordion";

export default function PsychologistFamiliesScreen() {
  const { data: parents = [], isLoading } = useParentsAndChildren();
  if (isLoading) return null;

  if (parents.length === 0) {
    return (
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ alignItems: "center", marginTop: 16 }}>
          <Text style={{ fontSize: 16, color: "#fff" }}>
            Nenhuma família encontrada.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {parents.map((parent) => (
        <ParentAccordion key={parent.id} parent={parent} />
      ))}
    </ScrollView>
  );
}
