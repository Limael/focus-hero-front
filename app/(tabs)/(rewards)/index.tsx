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
import { CentralizedShield } from "@/components/ui/CentralizedShield";
import GiftSVG from "@/components/ui/GiftSVG";
import { RewardTaskCard } from "@/components/ui/RewardTaskCard";
import { RewardModal } from "@/components/ui/RewardModal";

type Reward = {
  id: string;
  title: string;
  subTitle?: string;
  description: string;
  image?: any;
  claimed: boolean;
};

const mockRewards: Reward[] = [
  {
    id: "r1",
    title: "Uma ida no Mc Donald’s",
    subTitle: "Combo médio liberado!",
    description:
      "Válido para um lanche médio à sua escolha no McDonald’s mais próximo.",
    image: require("@/assets/images/dish.png"),
    claimed: false,
  },
  {
    id: "r2",
    title: "Um brinquedo novo",
    subTitle: "Presente garantido!",
    description: "Escolha um brinquedo de até R$50 em nossa loja parceira.",
    image: require("@/assets/images/dish.png"),
    claimed: false,
  },
  {
    id: "r3",
    title: "Sessão de cinema",
    subTitle: "Filme e pipoca liberados!",
    description:
      "Ingresso de cinema para você e um amigo (válido até o fim do mês).",
    image: require("@/assets/images/dish.png"),
    claimed: false,
  },
  {
    id: "r4",
    title: "Sorvete grátis",
    subTitle: "Doce recompensa!",
    description:
      "Vale um sorvete médio em qualquer sorveteria artesanal gratuita.",
    image: require("@/assets/images/dish.png"),
    claimed: false,
  },
  {
    id: "r5",
    title: "Dia sem tarefas",
    subTitle: "Descanso merecido!",
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
    <View
      style={{
        paddingHorizontal: 16,
        flex: 1,
      }}
    >
      <ScrollView contentContainerStyle={styles.list}>
        {rewards.map((r, index) => (
          <RewardTaskCard
            key={r.id}
            title={r.title}
            showReward={false}
            onPress={() => setSelected(r)}
            rewardIcon={<GiftSVG width={80} height={86} />}
          />
        ))}
      </ScrollView>

      <RewardModal
        visible={!!selected}
        reward={selected}
        onClose={() => setSelected(null)}
        onClaim={handleClaim}
        claimText="Resgatar"
        secondaryText="Fechar"
      />
    </View>
  );
}

const PRIMARY = "#1D3D47";
const LIGHT = "#fff";
const GREY = "#ECECEC";

const styles = StyleSheet.create({
  list: { paddingBottom: 32, paddingTop: 16, gap: 32, marginTop: 12 },

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
  claimText: {
    fontSize: 14,
    fontWeight: "600",
    color: LIGHT,
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});
