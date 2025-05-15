import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function ArrowDownSVG(props: SvgProps) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.354 11.354a.5.5 0 01-.708 0L8 5.707l-5.646 5.647a.5.5 0 01-.708-.708l6-6a.5.5 0 01.708 0l6 6a.5.5 0 010 .708z"
        fill="#fff"
      />
    </Svg>
  );
}

export default ArrowDownSVG;
