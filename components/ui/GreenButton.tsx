import React, { useRef } from "react";
import { Pressable, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type GradientButtonProps = {
  onPress?: () => void;
  children: React.ReactNode;
};

export function GreenButton({ onPress, children }: GradientButtonProps) {
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
    >
      <Animated.View
        style={[styles.animated, { transform: [{ scale: scaleAnim }] }]}
      >
        <LinearGradient
          colors={["#2FAC66", "#2EA863", "#2C9F5B", "#288F4D", "#288E4C"]}
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
    width: "100%",
    shadowColor: "#53EA90",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 6, // Android shadow
  },
  button: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "#53EA90",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "ComicNeue-Bold",
  },
});
