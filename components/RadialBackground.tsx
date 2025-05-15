import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function RadialBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="grad"
            cx="50%"
            cy="35%"
            rx="50%"
            ry="50%"
            fx="50%"
            fy="35%"
          >
            <Stop offset="0%" stopColor="#52D3E8" />
            <Stop offset="38%" stopColor="#51D2E6" />
            <Stop offset="83%" stopColor="#3AB9C8" />
            <Stop offset="100%" stopColor="#31AFBC" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
      {children}
    </>
  );
}
