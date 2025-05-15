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
  id: string;
  title: string;
  subTitle?: string;
  description: string;
  image?: any;
  claimed: boolean;
};

type RewardModalProps = {
  visible: boolean;
  reward: Reward | null;
  onClose: () => void;
  onClaim: (id: string) => void;
  claimText?: string;
  secondaryText?: string;
};

export function RewardModal({
  visible,
  reward,
  onClose,
  onClaim,
  claimText = "Resgatar",
  secondaryText = "Fechar",
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
          <Text style={styles.title}>{reward.title}</Text>
          {!!reward.subTitle && (
            <Text style={styles.subTitle}>{reward.subTitle}</Text>
          )}

          <RewardTaskCard
            title={reward.title}
            reward={110}
            showReward={false}
            onPress={() => {}}
            rewardIcon={<GiftSVG width={70} height={86} />}
            rewardGradient={["#78E3A6", "#28914F"]}
            cardBackground="#28914F"
            cardFontColor="#fff"
            isTask={false}
          />

          <View style={styles.buttons}>
            <View style={styles.button}>
              <TransparentButton onPress={onClose}>
                {secondaryText}
              </TransparentButton>
            </View>
            {!reward.claimed && (
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
    marginBottom: 4,
    color: "#fff",
  },
  subTitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    color: "#fff",
  },
  buttons: {
    marginTop: 20,
    width: "100%",
    gap: 12,
  },
  button: {
    width: "100%",
  },
  claimText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  closeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});
