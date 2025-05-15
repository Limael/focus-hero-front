import React from "react";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
import HeroCharacterSVG from "./HeroCharacterSVG";

export default function CharacterButton({ onPress }: { onPress?: () => void }) {
  return (
    <View style={styles.gradientWrapper}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <HeroCharacterSVG width={28} height={28} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientWrapper: {
    borderRadius: 16,
    padding: 2,
    backgroundColor: "#298B96",
    borderWidth: 2,
    borderColor: "#ffffff88",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    borderRadius: 14,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
