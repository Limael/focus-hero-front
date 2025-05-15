import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GemSVG from "./GemSVG";

export default function GemCounter({ amount = 100 }) {
  return (
    <View style={styles.wrapper}>
      <GemSVG width={38} height={48} style={styles.gem} />
      <LinearGradient
        colors={["#1A7C87", "#186B75"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.counterBox}
      >
        <Text style={styles.counterText}>{amount}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  gem: {
    resizeMode: "stretch",
    zIndex: 1,
    boxShadow: "0 14px 14px rgba(0, 0, 0, 0.25)",
    marginRight: -24,
    marginTop: -10,
  },
  counterBox: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#1A7C87",
    borderWidth: 2,
    borderColor: "#ffffff88",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
    paddingLeft: 24, 
  },
  counterText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
