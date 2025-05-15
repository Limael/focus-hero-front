import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function GearButton({ onPress }: { onPress?: () => void }) {
  return (
    <LinearGradient
      colors={["#C85C40", "#C45A3E", "#BB5539", "#AB4E31", "#944326"]}
      start={[0.5, 0]}
      end={[0.5, 1]}
      style={styles.gradientWrapper}
    >
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Image
          source={require("@/assets/images/gear.png")}
          style={styles.icon}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientWrapper: {
    borderRadius: 16,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
  },
  button: {
    borderRadius: 14,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
