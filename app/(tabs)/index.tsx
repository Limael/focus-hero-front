import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useChildren } from "@/hooks/useChildren";
import { ParentTaskAccordion } from "@/components/screens/ParentTaskAccordion";
import { ChildTaskList } from "@/components/screens/ChildTaskList";
import { TransparentButton } from "@/components/ui/TransparentButton";

export default function TasksScreen() {
  const { user } = useAuth();
  const { data: children = [] } = useChildren();

  if (user?.role === "parent") {
    return (
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {children.map((relation: any) => (
            <ParentTaskAccordion
              key={relation.child.id}
              child={relation.child}
            />
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <TransparentButton>Adicionar novo Hero</TransparentButton>
        </View>
      </View>
    );
  }

  if (user?.role === "child") {
    return <ChildTaskList />;
  }

  return null;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // espaço pro botão não cobrir
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
