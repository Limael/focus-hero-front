import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import GiftSVG from "@/components/ui/GiftSVG";
import { RewardTaskCard } from "@/components/ui/RewardTaskCard";
import { RewardModal } from "@/components/ui/RewardModal";
import { useClaimReward, useRewardsForCurrentChild } from "@/hooks/useRewards";
import { RewardDto } from "@/types/RewardDto";
import { Text } from "react-native";
import BackButton from "@/components/ui/BackButton";
import { router } from "expo-router";

export default function RewardsScreen() {
  const [selected, setSelected] = useState<RewardDto | null>(null);

  const {
    data: rewards = [],
    isLoading,
    isError,
  } = useRewardsForCurrentChild();

  const { mutate: claimReward, isPending: isClaiming } = useClaimReward();

  function handleClaim(id: number) {
    claimReward(id, {
      onSuccess: () => {
        setSelected(null);
        Alert.alert("Sucesso", "O Mestre do Jogo vai analisar o seu pedido!");
      },
      onError: (error: any) => {
        Alert.alert("Erro", "Não foi possível resgatar a recompensa.");
      },
    });
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DCBE2" />
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.loadingContainer}>
        <RewardTaskCard title="Erro ao buscar recompensas" showReward={false} />
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 16, flex: 1 }}>
      <ScrollView contentContainerStyle={styles.list}>
        <BackButton onPress={() => router.back()}>Voltar</BackButton>

        {rewards.length === 0 && (
          <Text style={styles.noTasks}>Sem recompensas disponíveis.</Text>
        )}
        {rewards.map((r) => (
          <RewardTaskCard
            cardBackground={
              r.status === "pending" || r.status === "redeemed"
                ? "#28914F"
                : "#fff"
            }
            cardFontColor={
              r.status === "pending" || r.status === "redeemed"
                ? "#fff"
                : "#C98B44"
            }
            rewardGradient={
              r.status === "pending" || r.status === "redeemed"
                ? ["#78E3A6", "#28914F"]
                : ["#F8C98E", "#C98B44"]
            }
            key={r.id}
            title={r.description}
            reward={r.requiredPoints}
            showReward={false}
            onPress={() => {
              setSelected(r);
            }}
            rewardIcon={<GiftSVG width={80} height={86} />}
          />
        ))}
      </ScrollView>

      <RewardModal
        visible={!!selected}
        reward={selected}
        onClose={() => setSelected(null)}
        onClaim={() => selected && handleClaim(selected.id)}
        claimText={isClaiming ? "Resgatando..." : "Sim! Passa pra cá!"}
        secondaryText="Deixa pra próxima..."
        title="Quer reivindicar seu prêmio?"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 32, paddingTop: 16, gap: 32, marginTop: 12 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTasks: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
  },
});
