// app/(tabs)/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

type Task = {
  id: string;
  title: string;
  description: string;
  done: boolean;
  image?: any;
};

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Lavar a louça",
    description:
      "Lavar a louça do café da manhã, até às 14:00, não precisa lavar os talheres.",
    done: true,
    image: require("@/assets/images/dish.png"),
  },
  {
    id: "2",
    title: "Estudar React Native",
    description: "Ler documentação e codar exercícios práticos.",
    done: false,
  },
  {
    id: "3",
    title: "Fazer compras",
    description: "Leite, pão, ovos e café.",
    done: false,
  },
];

export default function TasksScreen() {
  const [selected, setSelected] = useState<Task | null>(null);
  const router = useRouter();

  return (
    <View
      style={{
        paddingHorizontal: 16,
      }}
    >
      <Text style={styles.title}>Lista de tarefas</Text>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {mockTasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[styles.card, task.done && styles.cardDone]}
            activeOpacity={0.8}
            onPress={() => setSelected(task)}
          >
            {task.image ? (
              <Image source={task.image} style={styles.cardImage} />
            ) : (
              <View style={styles.cardImagePlaceholder} />
            )}

            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{task.title}</Text>
              <Text style={styles.cardDesc}>{task.description}</Text>
            </View>

            <View
              style={[styles.checkCircle, task.done && styles.checkCircleDone]}
            >
              {task.done && <Text style={styles.checkMark}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelected(null)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selected?.title}</Text>

            {selected?.image && (
              <Image
                source={selected.image}
                style={styles.modalImage}
                resizeMode="cover"
              />
            )}

            <Text style={styles.modalDesc}>{selected?.description}</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setSelected(null)}
              >
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.detailsButton]}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(task)/[id]",
                    params: { id: selected!.id },
                  })
                }
              >
                <Text style={[styles.modalButtonText, styles.detailsText]}>
                  Ver detalhes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const GREY = "#ECECEC";
const PRIMARY = "#1D3D47";
const LIGHT_GREY = "#F5F5F5";
const SUCCESS = "#4CAF50";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GREY,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginTop: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GREY,
    marginRight: 8,
  },
  headerLine: {
    width: 180,
    height: 16,
    borderRadius: 8,
    backgroundColor: GREY,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 32,
    height: 32,
    backgroundColor: GREY,
    borderRadius: 6,
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: PRIMARY,
    marginBottom: 12,
  },
  list: {
    paddingBottom: 32,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardDone: {
    borderWidth: 1,
    borderColor: SUCCESS,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cardImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: GREY,
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#222",
  },
  cardDesc: {
    fontSize: 13,
    color: "#555",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GREY,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleDone: {
    backgroundColor: SUCCESS,
    borderColor: SUCCESS,
  },
  checkMark: {
    color: "#fff",
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: PRIMARY,
    textAlign: "center",
  },
  modalImage: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalDesc: {
    fontSize: 14,
    color: "#333",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: GREY,
  },
  detailsButton: {
    backgroundColor: PRIMARY,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "# ",
  },
  detailsText: {
    color: "#fff",
  },
});
