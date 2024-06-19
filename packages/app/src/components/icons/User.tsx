import * as React from "react";
import { Svg, G, Path } from "react-native-svg";
import { SvgIconProps } from "./types";
import { palette } from "../../config/theme";
import { View } from "react-native";

export const User = ({
  style,
  size = 80,
  status = "neutral",
}: SvgIconProps) => {
  const colors = palette[status];

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        <G strokeWidth={0.99996019} strokeDasharray={"none"}>
          <Path
            d="M97.537 46.761a34.495 34.495 0 0 0-4.91.352 34.495 34.495 0 0 0-4.808 1.046 34.495 34.495 0 0 0-4.612 1.72 34.495 34.495 0 0 0-4.32 2.359 34.495 34.495 0 0 0-3.94 2.95 34.495 34.495 0 0 0-3.48 3.48 34.495 34.495 0 0 0-2.949 3.939 34.495 34.495 0 0 0-2.359 4.32 34.495 34.495 0 0 0-1.72 4.611 34.495 34.495 0 0 0-1.045 4.81 34.495 34.495 0 0 0-.352 4.909 34.495 34.495 0 0 0 .352 4.909 34.495 34.495 0 0 0 1.045 4.809 34.495 34.495 0 0 0 1.72 4.611 34.495 34.495 0 0 0 2.36 4.32 34.495 34.495 0 0 0 2.948 3.94 34.495 34.495 0 0 0 3.48 3.48 34.495 34.495 0 0 0 3.94 2.95 34.495 34.495 0 0 0 4.32 2.358 34.495 34.495 0 0 0 4.612 1.72 34.495 34.495 0 0 0 4.809 1.046 34.495 34.495 0 0 0 4.91.351 34.495 34.495 0 0 0 4.908-.35 34.495 34.495 0 0 0 4.81-1.047 34.495 34.495 0 0 0 4.61-1.72 34.495 34.495 0 0 0 4.32-2.359 34.495 34.495 0 0 0 3.94-2.95 34.495 34.495 0 0 0 3.48-3.48 34.495 34.495 0 0 0 2.95-3.939 34.495 34.495 0 0 0 2.359-4.32 34.495 34.495 0 0 0 1.72-4.611 34.495 34.495 0 0 0 1.046-4.81 34.495 34.495 0 0 0 .35-4.908 34.495 34.495 0 0 0-.04-1.693 34.495 34.495 0 0 0-.125-1.689 34.495 34.495 0 0 0-.207-1.68 34.495 34.495 0 0 0-.29-1.668 34.495 34.495 0 0 0-.37-1.652 34.495 34.495 0 0 0-.452-1.632 34.495 34.495 0 0 0-.532-1.607 34.495 34.495 0 0 0-.609-1.58 34.495 34.495 0 0 0-.686-1.548 34.495 34.495 0 0 0-.761-1.512 34.495 34.495 0 0 0-.835-1.473 34.495 34.495 0 0 0-.906-1.43 34.495 34.495 0 0 0-.974-1.385 34.495 34.495 0 0 0-1.042-1.335 34.495 34.495 0 0 0-1.106-1.282 34.495 34.495 0 0 0-1.167-1.226 34.495 34.495 0 0 0-1.227-1.168 34.495 34.495 0 0 0-1.282-1.105 34.495 34.495 0 0 0-1.335-1.042 34.495 34.495 0 0 0-1.384-.975 34.495 34.495 0 0 0-1.43-.906 34.495 34.495 0 0 0-1.473-.834 34.495 34.495 0 0 0-1.512-.762 34.495 34.495 0 0 0-1.549-.685 34.495 34.495 0 0 0-1.579-.61 34.495 34.495 0 0 0-1.607-.53 34.495 34.495 0 0 0-1.632-.452 34.495 34.495 0 0 0-1.652-.372 34.495 34.495 0 0 0-1.669-.289 34.495 34.495 0 0 0-1.68-.207 34.495 34.495 0 0 0-1.688-.125 34.495 34.495 0 0 0-1.693-.042zM94.2 74.127a3.773 3.773 0 0 1 3.773 3.772 3.773 3.773 0 0 1-3.773 3.773 3.773 3.773 0 0 1-3.772-3.773 3.773 3.773 0 0 1 3.772-3.772zm-13.713.152a3.773 3.773 0 0 1 3.772 3.773 3.773 3.773 0 0 1-3.772 3.772 3.773 3.773 0 0 1-3.773-3.772 3.773 3.773 0 0 1 3.773-3.773zm-3.493 14.32h27.5a13.75 13.75 0 0 1-6.875 11.908 13.75 13.75 0 0 1-13.75 0 13.75 13.75 0 0 1-6.875-11.908z"
            opacity={1}
            fill={colors.highlight}
            strokeWidth={0.99996019}
            strokeDasharray={"none"}
            fillOpacity={1}
            transform="translate(-76.138 -81.696) scale(1.74707)"
          />
          <Path
            d="M-47.73-214.451a53.489 53.489 0 0 1-26.745 46.322 53.489 53.489 0 0 1-53.488 0 53.489 53.489 0 0 1-26.745-46.322h53.49z"
            fill={colors.highlight}
            fillOpacity={1}
            strokeWidth={0.99996019}
            strokeDasharray={"none"}
            transform="matrix(-1.74707 0 0 -1.74707 -76.888 -174.66)"
          />
        </G>
      </Svg>
    </View>
  );
};
