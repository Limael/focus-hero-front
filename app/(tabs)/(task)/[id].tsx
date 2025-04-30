// app/(tabs)/task/[id].tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

type Step = { id: string; text: string; done: boolean };
type Task = {
  id: string;
  title: string;
  description: string;
  image?: any;
  steps: Step[];
};

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Lavar a louça",
    description:
      "Lavar a louça do café da manhã, até às 14:00, não precisa lavar os talheres.",
    image: require("@/assets/images/dish.png"),
    steps: [
      { id: "a", text: "Colocar 5 gotas de detergente na esponja", done: true },
      { id: "b", text: "Esfregar a esponja em todos os pratos", done: false },
    ],
  },
  // … outros mocks
];

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const task = mockTasks.find((t) => t.id === id);

  // mantém os passos no estado
  const [steps, setSteps] = useState<Step[]>(task?.steps ?? []);

  if (!task) {
    return <Text style={styles.errorText}>Tarefa não encontrada.</Text>;
  }

  function toggleStep(stepId: string) {
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s))
    );
  }
  //
  return (
    <View
      style={{
        paddingHorizontal: 16,
        minHeight: "100%",
        backgroundColor: "#fff",
      }}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {task.image && <Image source={task.image} style={styles.image} />}

        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.description}>{task.description}</Text>

        <Text style={styles.sectionTitle}>Passo a passo</Text>
        {steps.map((step) => (
          <TouchableOpacity
            key={step.id}
            style={[styles.stepRow, step.done && styles.stepRowDone]}
            activeOpacity={0.7}
            onPress={() => toggleStep(step.id)}
          >
            <View
              style={[styles.stepCircle, step.done && styles.stepCircleDone]}
            >
              {step.done && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={[styles.stepText, step.done && styles.stepTextDone]}>
              {step.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>Completar Missão</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.back()}
        >
          <Text style={styles.ctaText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PRIMARY = "#1D3D47";
const GREY_LIGHT = "#ECECEC";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", marginTop: 36 },
  content: { padding: 16, paddingBottom: 32 },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: PRIMARY,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: GREY_LIGHT,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  stepRowDone: {
    backgroundColor: "#F0FFF4", // leve destaque verde
  },

  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GREY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepCircleDone: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  checkMark: {
    color: "#fff",
    fontWeight: "700",
  },

  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  stepTextDone: {
    textDecorationLine: "line-through",
    color: "#888",
  },

  ctaButton: {
    marginTop: 24,
    backgroundColor: GREY_LIGHT,
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 16,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "600",
    color: PRIMARY,
  },

  backButton: {
    marginTop: 12,
    alignItems: "center",
  },
  backText: {
    fontSize: 14,
    color: PRIMARY,
  },

  errorText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    color: "red",
    fontSize: 16,
  },
  buttonsContainer: {
    display: "flex",
    gap: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    alignItems: "center",
  },
});
