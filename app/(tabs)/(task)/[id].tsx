import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { RewardShield } from "@/components/ui/RewardShield";
import GemSVG from "@/components/ui/GemSVG";
import { GreenButton } from "@/components/ui/GreenButton";
import { TransparentButton } from "@/components/ui/TransparentButton";

type Step = { id: string; text: string; done: boolean };
type Task = {
  id: string;
  title: string;
  description: string;
  image?: any;
  steps: Step[];
  dueDate: string;
  expectedTime: string;
  reward: number;
};

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Lavar a louça",
    expectedTime: "30 min",
    reward: 150,
    description:
      "Lavar a louça do café da manhã, até às 14:00, não precisa lavar os talheres.",
    image: require("@/assets/images/dish.png"),
    dueDate: "2023-10-01T14:00:00Z",
    steps: [
      { id: "a", text: "Colocar 5 gotas de detergente na esponja", done: true },
      { id: "b", text: "Esfregar a esponja em todos os pratos", done: false },
    ],
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = mockTasks.find((t) => t.id === id);

  if (!task) {
    return <Text style={styles.errorText}>Tarefa não encontrada.</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentHeader}>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.dueDate}>
              Prazo: {formatDate(task.dueDate)}
            </Text>
          </View>

          <View style={styles.card}>
            <Image
              source={task.image}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={styles.taskHeader}>
              <Text style={styles.subTitle}>Como fazer...</Text>
              <View style={styles.rewardWrapper}>
                <RewardShield
                  text={`+${task.reward}`}
                  Icon={<GemSVG width={70} height={86} />}
                  gradientStart="#F8C98E"
                  gradientEnd="#C98B44"
                />
              </View>
            </View>

            <Text style={styles.steps}>
              {task.steps.map((step) => `\u2022 ${step.text}\n`)}
            </Text>

            <Text style={styles.subTitle}>Tempo esperado</Text>
            <Text
              style={styles.expectedTime}
            >{`\u2022 ${task.expectedTime}`}</Text>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <GreenButton onPress={() => console.log("Começou!")}>
            COMEÇAR TAREFA!
          </GreenButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    flex: 1,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Supersonic Rocketship",
    color: "#fff",
  },
  dueDate: {
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    color: "red",
    fontSize: 16,
  },
  card: {
    padding: 16,
    backgroundColor: "#0A3B46",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#518692",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A6F3FF",
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  rewardWrapper: {
    marginTop: -16,
  },
  subTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  steps: {
    width: "100%",
    color: "#fff",
    marginTop: -8,
    lineHeight: 22,
  },
  expectedTime: {
    color: "#fff",
    marginTop: 8,
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    position: "relative",
    bottom: 0,
  },
});
