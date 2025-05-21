import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useChildren } from "@/hooks/useChildren";
import { ParentTaskAccordion } from "@/components/screens/ParentTaskAccordion";
import { ChildTaskList } from "@/components/screens/ChildTaskList";
import { TransparentButton } from "@/components/ui/TransparentButton";
import { useRouter } from "expo-router";
import { ParentRewardAccordion } from "@/components/screens/ParentRewardAccordion";
import PsychologistFamiliesScreen from "@/components/screens/PsychologistFamiliesScreen";

export default function TasksScreen() {
  const { user } = useAuth();
  const { data: children = [] } = useChildren();
  const router = useRouter();
  if (user?.role === "parent") {
    return (
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {children.map((relation) => (
            <ParentTaskAccordion
              key={relation.child.id}
              child={relation.child}
            />
          ))}
          <ParentRewardAccordion />
        </ScrollView>
        <View style={styles.footer}>
          <TransparentButton
            onPress={() => router.push("/(tabs)/(child)/create-edit-child")}
          >
            Adicionar novo Hero
          </TransparentButton>
        </View>
      </View>
    );
  }

  if (user?.role === "child") {
    return <ChildTaskList />;
  }

  if (user?.role === "psychologist") {
    return <PsychologistFamiliesScreen />;
  }
  return null;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
