import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
} from "react-native";
import { RewardTaskCard } from "./RewardTaskCard";
import { GreenButton } from "./GreenButton";
import { TransparentButton } from "./TransparentButton";
import GiftSVG from "./GiftSVG";

type Reward = {
  id: number;
  description: string;
  requiredPoints: number;
  status: "available" | "redeemed" | "pending";
  childId: number;
  createdAt: string;
  updatedAt: string;
};

type RewardModalProps = {
  visible: boolean;
  reward: Reward | null;
  onClose: () => void;
  onClaim: (id: number) => void;
  claimText?: string;
  secondaryText?: string;
  title?: string;
  subTitle?: string;
  onPressCard?: () => void;
  claimable?: boolean;
};

export function RewardModal({
  visible,
  reward,
  onClose,
  onClaim,
  claimText = "Resgatar",
  secondaryText = "Fechar",
  title,
  subTitle,
  claimable = true,
  onPressCard,
}: RewardModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  if (!reward) return null;

  const displayTitle = title || "Recompensa";
  const displaySubTitle =
    subTitle ||
    (reward.status === "redeemed"
      ? "Recompensa já resgatada"
      : reward.status === "pending"
      ? "Recompensa pendente"
      : undefined);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.modal,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>{displayTitle}</Text>
          {!!displaySubTitle && (
            <Text style={styles.subTitle}>{displaySubTitle}</Text>
          )}

          <RewardTaskCard
            title={reward.description}
            reward={reward.requiredPoints}
            showReward={false}
            rewardIcon={<GiftSVG width={70} height={86} />}
            rewardGradient={["#78E3A6", "#28914F"]}
            cardBackground="#28914F"
            cardFontColor="#fff"
            isTask={false}
            onPress={onPressCard}
          />

          <View style={styles.statusChipWrapper}>
            <Text style={[styles.statusChip, getStatusStyle(reward.status)]}>
              {reward.status === "available" && "Disponível"}
              {reward.status === "redeemed" && "Resgatada"}
              {reward.status === "pending" && "Pendente"}
            </Text>
          </View>

          <View style={styles.buttons}>
            <View style={styles.button}>
              <TransparentButton onPress={onClose}>
                {secondaryText}
              </TransparentButton>
            </View>
            {reward.status === "available" && claimable && (
              <View style={styles.button}>
                <GreenButton onPress={() => onClaim(reward.id)}>
                  {claimText}
                </GreenButton>
              </View>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

function getStatusStyle(status: Reward["status"]) {
  if (status === "redeemed") return { backgroundColor: "#aaa", color: "#222" };
  if (status === "pending")
    return { backgroundColor: "#E2B52B", color: "#222" };
  return { backgroundColor: "#28914F", color: "#fff" };
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000055",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    maxWidth: 360,
    backgroundColor: "#0A3B46",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 18,
    color: "#fff",
    width: "80%",
  },
  subTitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    color: "#fff",
  },
  statusChipWrapper: {
    marginVertical: 12,
  },
  statusChip: {
    fontWeight: "bold",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 16,
    overflow: "hidden",
    textAlign: "center",
    fontSize: 14,
    alignSelf: "center",
  },
  buttons: {
    marginTop: 12,
    width: "100%",
    gap: 12,
  },
  button: {
    width: "100%",
  },
});
