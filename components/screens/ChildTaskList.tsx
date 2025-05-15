import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTasksByChild } from "@/hooks/useTask";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { RewardTaskCard } from "../ui/RewardTaskCard";

export function ChildTaskList() {
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useTasksByChild(user?.id!);
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.list}>
      {isLoading ? (
        <View style={styles.messageWrapper}>
          <Text>Carregando tarefas...</Text>
        </View>
      ) : tasks.length > 0 ? (
        tasks.map((task, index) => (
          <RewardTaskCard
            key={task.id}
            isTask
            title={task.description}
            showReward={index === 0}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(task)/[id]",
                params: { id: task.id },
              })
            }
          />
        ))
      ) : (
        <View style={styles.messageWrapper}>
          <Text>Você ainda não possui tarefas.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 16,
  },
  messageWrapper: {
    marginTop: 16,
    alignItems: "center",
  },
});
