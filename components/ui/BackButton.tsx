import React, { useRef } from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Animated,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type BackButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export default function BackButton({
  onPress,
  children,
  disabled,
}: BackButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[styles.animated, { transform: [{ scale: scaleAnim }] }]}
      >
        <LinearGradient
          colors={["#C85C40", "#C45A3E", "#BB5539", "#AB4E31", "#944326"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.text}>{children}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  animated: {
    width: "30%",
    shadowColor: "#C45A3E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 6,
    marginBottom: 16,
  },
  gradientWrapper: {
    borderRadius: 8,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
    width: "30%",
    marginBottom: 16,
  },
  button: {
    borderRadius: 14,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "SupersonicRocketship",
  },
});
