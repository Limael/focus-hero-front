import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { RewardShield } from "./RewardShield";
import { CentralizedShield } from "./CentralizedShield";
import { useRouter } from "expo-router";
import GiftSVG from "./GiftSVG";
import GemSVG from "./GemSVG";

type RewardTaskCardProps = {
  title: string;
  reward?: number;
  onPress?: () => void;
  showReward?: boolean;
  rewardGradient?: [string, string];
  rewardIcon?: React.ReactNode;
  cardBackground?: string;
  cardFontColor?: string;
  isTask?: boolean;
};

export function RewardTaskCard({
  title,
  reward = 150,
  onPress,
  showReward,
  rewardGradient = ["#F8C98E", "#C98B44"],
  rewardIcon = <GemSVG width={70} height={86} />,
  cardBackground = "#fff",
  cardFontColor = "#C98B44",
  isTask = false,
}: RewardTaskCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={[styles.card, { backgroundColor: cardBackground }]}>
          {showReward && (
            <View style={styles.giftShieldContainer}>
              <Pressable
                onPress={() => router.push({ pathname: "/(tabs)/(rewards)" })}
                style={styles.giftWrapper}
              >
                <CentralizedShield
                  Icon={<GiftSVG width={40} height={40} />}
                  gradientStart="#F8C98E"
                  gradientEnd="#C98B44"
                />
              </Pressable>
            </View>
          )}

          <Text
            style={[styles.title, { color: cardFontColor }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>

        <View style={styles.rewardShieldWrapper}>
          <RewardShield
            isTask={isTask}
            text={`${reward}`}
            Icon={rewardIcon}
            gradientStart={rewardGradient[0]}
            gradientEnd={rewardGradient[1]}
          />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  card: {
    borderRadius: 16,
    marginBottom: 12,
    flex: 1,
    paddingVertical: 26,
    paddingLeft: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    width: "88%",
    fontWeight: "600",
  },
  giftWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 11,
  },
  giftShieldContainer: {
    position: "absolute",
    top: -24,
    zIndex: 11,
  },
  rewardShieldWrapper: {
    marginLeft: -28,
  },
});
