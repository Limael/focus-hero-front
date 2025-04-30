// app/(tabs)/rewards.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";

type Reward = {
  id: string;
  title: string;
  description: string;
  image?: any;
  claimed: boolean;
};

const mockRewards: Reward[] = [
  {
    id: "r1",
    title: "Uma ida no Mc Donald’s",
    description:
      "Valido para um lanche médio à sua escolha no McDonald’s mais próximo.",
    image: require("@/assets/images/dish.png"),
    claimed: false,
  },
  {
    id: "r2",
    title: "Um brinquedo novo",
    description: "Escolha um brinquedo de até R$50 em nossa loja parceira.",
    image: require("@/assets/images/dish.png"),
    claimed: false,
  },
  {
    id: "r3",
    title: "Sessão de cinema",
    description:
      "Ingresso de cinema para você e um amigo (válido até o fim do mês).",
    image: require("@/assets/images/dish.png"),
    claimed: false,
  },
  {
    id: "r4",
    title: "Sorvete grátis",
    description:
      "Vale um sorvete médio em qualquer sorveteria artesã gratúita.",
    image: require("@/assets/images/dish.png"),
    claimed: false,
  },
  {
    id: "r5",
    title: "Dia sem tarefas",
    description:
      "Escolha um dia da semana para descansar e pular todas as tarefas.",
    image: require("@/assets/images/dish.png"),
    claimed: false,
  },
];

export default function RewardsScreen() {
  const [selected, setSelected] = useState<Reward | null>(null);
  const [rewards, setRewards] = useState<Reward[]>(mockRewards);

  function handleClaim(id: string) {
    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, claimed: true } : r))
    );
    setSelected(null);
    alert("Recompensa resgatada!");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Lista de tarefas</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {rewards.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={[styles.card, r.claimed && styles.cardClaimed]}
            onPress={() => setSelected(r)}
            activeOpacity={0.8}
          >
            {r.image && <Image source={r.image} style={styles.thumb} />}
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{r.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {r.description}
              </Text>
            </View>
            {r.claimed && <Text style={styles.badge}>✓</Text>}
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
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{selected?.title}</Text>
            {selected?.image && (
              <Image source={selected.image} style={styles.modalImage} />
            )}
            <Text style={styles.modalDesc}>{selected?.description}</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.closeBtn]}
                onPress={() => setSelected(null)}
              >
                <Text style={(styles.modalBtnText, styles.modalCloseBtnText)}>
                  Fechar
                </Text>
              </TouchableOpacity>
              {!selected?.claimed && (
                <TouchableOpacity
                  style={[styles.modalBtn, styles.claimBtn]}
                  onPress={() => handleClaim(selected!.id)}
                >
                  <Text style={[styles.modalBtnText, styles.claimText]}>
                    Resgatar
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const PRIMARY = "#1D3D47";
const LIGHT = "#fff";
const GREY = "#ECECEC";

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingHorizontal: 16 },
  list: { padding: 16, paddingBottom: 32 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: GREY,
  },
  cardClaimed: {
    opacity: 0.6,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: PRIMARY,
    marginBottom: 12,
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardDesc: { fontSize: 13, color: "#555" },
  badge: {
    fontSize: 18,
    color: PRIMARY,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: 300,
    backgroundColor: LIGHT,
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  modalImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalDesc: {
    fontSize: 14,
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  closeBtn: {
    backgroundColor: GREY,
  },
  claimBtn: {
    backgroundColor: PRIMARY,
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: LIGHT,
  },
  claimText: {
    color: LIGHT,
  },
  modalCloseBtnText: {
    color: "#000",
  },
});
