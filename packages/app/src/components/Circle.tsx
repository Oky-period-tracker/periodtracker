import * as React from "react";
import { Svg, Circle } from "react-native-svg";

export const CircleSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="200mm"
    height="200mm"
    viewBox="0 0 200 200"
    {...props}
  >
    <Circle
      cx={95}
      cy={105}
      r={90}
      fill={"#53b8c8"}
      fillOpacity={1}
      strokeWidth={0.23971}
    />
    <Circle
      cx={105}
      cy={95}
      r={90}
      fill={"#fff"}
      fillOpacity={1}
      strokeWidth={0.23971}
    />
    <Circle
      cx={99}
      cy={104}
      r={90}
      fill={"#2f9cb1"}
      fillOpacity={1}
      strokeWidth={0.23971}
    />
    <Circle
      cx={100}
      cy={100}
      r={90}
      fill={"#91d9e2"}
      fillOpacity={1}
      strokeWidth={0.23971}
    />
  </Svg>
);
