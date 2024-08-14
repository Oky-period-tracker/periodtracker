import React from "react";
import { ReduxState } from "../../../redux/reducers";
import { useSelector } from "../../../redux/useSelector";
import { useDayScroll } from "../DayScrollContext";
import { getDayStatus } from "../../../hooks/useDayStatus";
import { palette } from "../../../config/theme";
import PieChart from "react-native-pie-chart";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "../../../components/Text";
import { ButtonProps } from "../../../components/Button";

export const WheelRing = () => {
  const { data, diameter, constants } = useDayScroll();

  const reduxState = useSelector((s) => s) as ReduxState;

  const innerCircleSize = Math.abs(diameter - constants.BUTTON_SIZE * 2);
  const coverRadius =
    diameter > 0 ? Math.round((innerCircleSize / diameter) * 100) / 100 : 0.1;

  const outerInnerCircleSize = innerCircleSize - 24;

  const outerCoverRadius =
    diameter > 0
      ? Math.round((outerInnerCircleSize / diameter) * 100) / 100
      : 0.1;

  const { series, sliceColor, sliceColorOuter } = React.useMemo(
    () =>
      data.reduce<{
        series: number[];
        sliceColor: string[];
        sliceColorOuter: string[];
      }>(
        (acc, curr) => {
          const { status, appearance } = getDayStatus(reduxState, curr);

          let border = palette.neutral.dark;
          let fill = palette.neutral.base;

          if (status === "danger" && appearance === "outline") {
            border = palette.danger.base;
            fill = palette.basic.highlight;
          }
          if (status === "danger") {
            border = palette.danger.dark;
            fill = palette.danger.base;
          }
          if (status === "tertiary") {
            border = palette.tertiary.dark;
            fill = palette.tertiary.base;
          }

          // TODO: these numbers assume NUMBER_OF_BUTTONS = 12
          // 100 / 12 = 8.3
          //  0.5 + 7.3 + 0.5 = 8.3
          const newSeries = [0.5, 7.3, 0.5];
          const newSliceColor = [border, fill, border];
          const newSliceColorOuter = [border, border, border];

          return {
            series: [...acc.series, ...newSeries],
            sliceColor: [...acc.sliceColor, ...newSliceColor],
            sliceColorOuter: [...acc.sliceColorOuter, ...newSliceColorOuter],
          };
        },
        {
          series: [],
          sliceColor: [],
          sliceColorOuter: [],
        }
      ),
    [data, reduxState]
  );

  return (
    <>
      <PieChart
        widthAndHeight={diameter + 12}
        series={series}
        sliceColor={sliceColorOuter}
        coverRadius={outerCoverRadius}
        style={[styles.pie, { position: "absolute" }]}
      />
      <PieChart
        widthAndHeight={diameter}
        series={series}
        sliceColor={sliceColor}
        coverRadius={coverRadius}
        style={styles.pie}
      />
    </>
  );
};

export const WheelRingButton = ({
  onPress,
  status = "neutral",
  appearance,
  text,
  ...props
}: ButtonProps & {
  text: string;
}) => {
  return (
    <TouchableOpacity onPress={onPress} {...props}>
      <Text
        style={[
          styles.text,
          appearance === "outline" && { color: palette[status].base },
        ]}
        enableTranslate={false}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pie: {
    // 45 Shift to align pie with segments
    // 30 to rotate by 1 segment
    // 360 / 12 = 30
    transform: [{ rotate: `${45 + 30}deg` }],
  },
  text: {
    width: "60%",
    textAlign: "center",
    fontWeight: "bold",
    marginRight: 8,
    color: "#fff",
  },
});
