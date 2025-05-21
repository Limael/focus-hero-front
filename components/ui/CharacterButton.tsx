import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import HeroCharacterSVG from "./HeroCharacterSVG";

type Props = {
  onPress?: () => void;
  size?: number;
  icon?: React.ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function CharacterButton({
  onPress,
  size = 28,
  icon = <HeroCharacterSVG width={size} height={size} />,
  backgroundColor = "#298B96",
  borderColor = "#ffffff88",
  disabled = false,
  style,
}: Props) {
  return (
    <View
      style={[
        styles.gradientWrapper,
        {
          backgroundColor,
          borderColor,
          borderRadius: 14,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          { borderRadius: size * 0.5, padding: size * 0.2 },
        ]}
        disabled={disabled}
      >
        {icon}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientWrapper: {
    padding: 2,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
});
