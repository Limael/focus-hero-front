import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { RewardTaskCard } from "../ui/RewardTaskCard";
import { TransparentButton } from "../ui/TransparentButton";
import ArrowDownSVG from "../ui/ArrowDownSVG";
import GiftSVG from "../ui/GiftSVG";
import {
  useRewardsForParent,
  useRewardsByChildId,
  useUpdateReward,
} from "@/hooks/useRewards";
import { useChildren } from "@/hooks/useChildren";
import { RewardModal } from "../ui/RewardModal";
import { RewardDto } from "@/types/RewardDto";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export function ParentRewardAccordion() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<RewardDto | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | undefined>(
    undefined
  );

  const { data: children = [] } = useChildren();
  const { mutate: updateReward } = useUpdateReward();
  const { data: allRewards = [], isLoading: isAllLoading } =
    useRewardsForParent();
  const { data: filteredRewards = [], isLoading: isFilteredLoading } =
    useRewardsByChildId(selectedChildId);

  const rewards = selectedChildId ? filteredRewards : allRewards;
  const isRewardsLoading = selectedChildId ? isFilteredLoading : isAllLoading;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = !expanded;
    setExpanded(next);

    Animated.timing(fadeAnim, {
      toValue: next ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: next ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  function handleConfirmReward(id: number) {
    updateReward({
      id,
      data: {
        status: "redeemed",
      },
    });
    alert("Recompensa marcada como entregue!");
    setSelected(null);
  }

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity onPress={toggle} style={styles.childHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <GiftSVG width={50} height={50} />
          <Text style={styles.childName}>Prêmios</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 24 }}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <ArrowDownSVG />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={[styles.taskList, { opacity: fadeAnim }]}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={
                selectedChildId !== undefined ? String(selectedChildId) : "all"
              }
              onValueChange={(itemValue) => {
                setSelectedChildId(
                  itemValue === "all" ? undefined : Number(itemValue)
                );
              }}
              style={styles.picker}
              dropdownIconColor="#1DCBE2"
            >
              <Picker.Item label="Todos os filhos" value="all" key="all" />
              {children.map((relation) => (
                <Picker.Item
                  label={relation.child.name}
                  value={String(relation.child.id)}
                  key={relation.child.id}
                />
              ))}
            </Picker>
          </View>

          {isRewardsLoading ? (
            <ActivityIndicator color="#1DCBE2" size="small" />
          ) : rewards.length > 0 ? (
            <>
              {rewards.map((reward) => (
                <RewardTaskCard
                  key={reward.id}
                  reward={reward.requiredPoints}
                  isTask={false}
                  rewardIcon={<GiftSVG width={80} height={86} />}
                  title={reward.description}
                  showReward={false}
                  onPress={() => setSelected(reward)}
                  cardBackground={
                    reward.status === "pending" || reward.status === "redeemed"
                      ? "#28914F"
                      : "#fff"
                  }
                  cardFontColor={
                    reward.status === "pending" || reward.status === "redeemed"
                      ? "#fff"
                      : "#C98B44"
                  }
                  rewardGradient={
                    reward.status === "pending" || reward.status === "redeemed"
                      ? ["#78E3A6", "#28914F"]
                      : ["#F8C98E", "#C98B44"]
                  }
                />
              ))}
              <TransparentButton
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(rewards)/create-edit-reward",
                  })
                }
              >
                Criar novo prêmio
              </TransparentButton>
            </>
          ) : (
            <>
              <Text style={styles.noTasks}>Sem prêmios cadastrados.</Text>
              <TransparentButton
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(rewards)/create-edit-reward",
                  })
                }
              >
                Criar novo prêmio
              </TransparentButton>
            </>
          )}
        </Animated.View>
      )}

      <RewardModal
        visible={!!selected}
        subTitle="Para editar a recompensa, clique no botão abaixo."
        reward={selected}
        onPressCard={() =>
          router.push({
            pathname: "/(tabs)/(rewards)/create-edit-reward",
            params: { id: selected?.id },
          })
        }
        onClose={() => setSelected(null)}
        onClaim={handleConfirmReward}
        claimText="Marcar como entregue"
        secondaryText="Fechar"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  accordionContainer: {
    marginBottom: 24,
  },
  childHeader: {
    backgroundColor: "#0A3B46",
    borderWidth: 1,
    borderColor: "#518692",
    padding: 16,
    marginBottom: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  childName: {
    color: "#fff",
    fontFamily: "SupersonicRocketship",
    fontSize: 18,
  },
  taskList: {
    marginTop: 16,
    gap: 16,
  },
  noTasks: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
  },
  pickerWrapper: {
    backgroundColor: "#155F6D",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: {
    color: "#fff",
    width: "100%",
  },
});
