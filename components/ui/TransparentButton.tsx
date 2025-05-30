import React, { useRef } from "react";
import { Pressable, Text, StyleSheet, Animated } from "react-native";

type TransparentButtonProps = {
  onPress?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
};

export function TransparentButton({
  onPress,
  children,
  disabled,
}: TransparentButtonProps) {
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
        style={[styles.button, { transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.text}>{children}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "SupersonicRocketship", // ou o que você estiver usando
  },
});
