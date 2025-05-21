import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function ThreeDotsSVG(props: SvgProps) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <Path
        d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
        fill="#fff"
      />
    </Svg>
  );
}

export default ThreeDotsSVG;
