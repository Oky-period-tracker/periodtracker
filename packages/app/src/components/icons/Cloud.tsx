import * as React from "react";
import { View } from "react-native";
import { Svg, Rect, G, Path } from "react-native-svg";
import { SvgIconProps } from "./types";
import { palette } from "../../config/theme";

export const Cloud = ({
  style,
  size = 80,
  status = "neutral",
}: SvgIconProps) => {
  const colors = palette[status];

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        <G transform="matrix(1.00952 0 0 1.00952 226.8 317.367)">
          <Rect
            width={175.064}
            height={48.768}
            x={-202.544}
            y={-208.035}
            ry={24.384}
            fill={"#000"}
            fillOpacity={0.1}
            strokeWidth={0.304875}
            transform="matrix(1 0 0 1.08976 -3.21 14.731)"
          />
          <Rect
            width={98.48}
            height={109.763}
            x={-191.881}
            y={-285.088}
            rx={46.967}
            ry={45.091}
            fill={"#000"}
            fillOpacity={0.1}
            strokeWidth={0.159205}
            transform="matrix(.91372 0 0 .73067 -9.523 -74.33)"
          />
          <Rect
            width={96.084}
            height={92.794}
            x={-144.796}
            y={-253.22}
            rx={45.825}
            ry={38.12}
            fill={"#000"}
            fillOpacity={0.1}
            strokeWidth={0.144595}
            transform="matrix(.98527 0 0 .98527 -2.244 -2.252)"
          />
        </G>
        <Rect
          width={54.757}
          height={58.03}
          x={5.059}
          y={88.682}
          rx={57.881}
          ry={58.03}
          fill={colors.shadow}
          fillOpacity={1}
          strokeWidth={0.264583}
        />
        <G transform="translate(-189.476 154.849)">
          <Rect
            width={158.568}
            height={44.172}
            x={209.966}
            y={-48.979}
            ry={22.086}
            fill={colors.shadow}
            fillOpacity={1}
            strokeWidth={0.276146}
          />
          <Rect
            width={152.275}
            height={50.959}
            x={197.343}
            y={-66.255}
            ry={25.48}
            fill={colors.shadow}
            fillOpacity={1}
            strokeWidth={0.290658}
          />
          <Rect
            width={84.318}
            height={99.419}
            x={218.225}
            y={-113.496}
            rx={40.213}
            ry={40.842}
            fill={colors.shadow}
            fillOpacity={1}
            strokeWidth={0.140203}
          />
          <Rect
            width={89.2}
            height={99.419}
            x={219.623}
            y={-118.771}
            rx={42.542}
            ry={40.842}
            fill={colors.shadow}
            fillOpacity={1}
            strokeWidth={0.144205}
          />
          <Rect
            width={87.03}
            height={84.05}
            x={262.272}
            y={-89.906}
            rx={41.507}
            ry={34.528}
            fill={colors.shadow}
            fillOpacity={1}
            strokeWidth={0.130968}
          />
        </G>
        <Path
          d="M55.388 124.195a19.12 17.912 0 0 1-10.28 23.424 19.12 17.912 0 0 1-25.007-9.62 19.12 17.912 0 0 1 10.26-23.432 19.12 17.912 0 0 1 25.015 9.601L37.74 131.09z"
          fill={colors.dark}
          fillOpacity={1}
          strokeWidth={0.145241}
        />
        <G transform="translate(-178.182 154.093)">
          <Rect
            width={158.568}
            height={44.172}
            x={209.966}
            y={-48.979}
            ry={22.086}
            fill={colors.highlight}
            fillOpacity={1}
            strokeWidth={0.276146}
          />
          <Rect
            width={152.275}
            height={50.959}
            x={197.343}
            y={-66.255}
            ry={25.48}
            fill={colors.highlight}
            fillOpacity={1}
            strokeWidth={0.290658}
          />
          <Rect
            width={84.318}
            height={99.419}
            x={218.225}
            y={-113.496}
            rx={40.213}
            ry={40.842}
            fill={colors.highlight}
            fillOpacity={1}
            strokeWidth={0.140203}
          />
          <Rect
            width={89.2}
            height={99.419}
            x={219.623}
            y={-118.771}
            rx={42.542}
            ry={40.842}
            fill={colors.highlight}
            fillOpacity={1}
            strokeWidth={0.144205}
          />
          <Rect
            width={87.03}
            height={84.05}
            x={262.272}
            y={-89.906}
            rx={41.507}
            ry={34.528}
            fill={colors.highlight}
            fillOpacity={1}
            strokeWidth={0.130968}
          />
        </G>
        <G transform="translate(-178.118 160.324)">
          <Rect
            width={158.568}
            height={44.172}
            x={209.966}
            y={-48.979}
            ry={22.086}
            fill={colors.base}
            fillOpacity={1}
            strokeWidth={0.276146}
          />
          <Rect
            width={152.275}
            height={55.094}
            x={197.343}
            y={-66.255}
            ry={27.547}
            fill={colors.base}
            fillOpacity={1}
            strokeWidth={0.302219}
          />
          <Rect
            width={84.318}
            height={99.419}
            x={218.225}
            y={-113.496}
            rx={40.213}
            ry={40.842}
            fill={colors.base}
            fillOpacity={1}
            strokeWidth={0.140203}
          />
          <Rect
            width={89.2}
            height={99.419}
            x={219.623}
            y={-118.771}
            rx={42.542}
            ry={40.842}
            fill={colors.base}
            fillOpacity={1}
            strokeWidth={0.144205}
          />
          <Rect
            width={87.03}
            height={84.05}
            x={262.272}
            y={-89.906}
            rx={41.507}
            ry={34.528}
            fill={colors.base}
            fillOpacity={1}
            strokeWidth={0.130968}
          />
        </G>
      </Svg>
    </View>
  );
};
export default Cloud;
