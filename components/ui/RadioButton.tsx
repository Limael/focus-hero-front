import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

type RadioButtonProps = {
  checked: boolean;
  onPress?: () => void;
};

export function RadioButton({ checked, onPress }: RadioButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.outer, checked && styles.outerChecked]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {checked && <View style={styles.inner} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#A6F3FF",
    backgroundColor: "#155F73",
    justifyContent: "center",
    alignItems: "center",
  },
  outerChecked: {
    borderColor: "#fff",
    backgroundColor: "#2ee392",
  },
  inner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#2ee392",
  },
});
