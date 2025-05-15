import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Defs, RadialGradient, Stop } from "react-native-svg";

type CentralizedShieldProps = {
  Icon?: React.ReactNode;
  gradientStart?: string;
  gradientEnd?: string;
};

export function CentralizedShield({
  Icon,
  gradientStart = "#FFD1A3",
  gradientEnd = "#CE8842",
}: CentralizedShieldProps) {
  return (
    <View style={styles.wrapper}>
      <Svg
        width={50}
        height={50}
        viewBox="0 0 105 102"
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          <RadialGradient
            id="grad"
            cx={0}
            cy={0}
            r={1}
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(0 50 -50.5 0 52.5 52)"
          >
            <Stop stopColor={gradientStart} />
            <Stop offset={1} stopColor={gradientEnd} />
          </RadialGradient>
        </Defs>

        <Path
          d="M87 2H18C9.163 2 2 9.163 2 18v47.872a16 16 0 008.507 14.137l34.074 18.059a16 16 0 0014.87.06L94.377 79.98A16 16 0 00103 65.783V18c0-8.837-7.163-16-16-16z"
          fill="url(#grad)"
          stroke="#FFECD9"
          strokeWidth={3}
        />
      </Svg>

      <View style={styles.content}>
        {Icon && <View style={styles.iconWrapper}>{Icon}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  content: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  iconWrapper: {
    marginBottom: 1,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
