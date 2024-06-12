import React from "react";
import { Calendar, CalendarProps, DateData } from "react-native-calendars";
import { StyleSheet, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DisplayButton } from "./Button";
import { formatDate } from "../services/utils";
import { MarkedDates } from "react-native-calendars/src/types";

export const DatePicker = ({
  selectedDate,
  onDayPress,
}: {
  selectedDate: Date;
  onDayPress: (day: DateData) => void;
}) => {
  const dateString = formatDate(selectedDate);

  const markedDates: MarkedDates = {
    [dateString]: {
      selected: true,
      selectedColor: "#E3629B",
      selectedTextColor: "#fff",
    },
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        style={styles.calendar}
        theme={theme}
        markedDates={markedDates}
        renderArrow={(direction) => {
          return (
            <DisplayButton style={styles.arrowButton}>
              <FontAwesome
                size={12}
                name={`arrow-${direction}`}
                color={"#fff"}
              />
            </DisplayButton>
          );
        }}
      />
    </View>
  );
};

const theme: CalendarProps["theme"] = {
  monthTextColor: "#f49200",
  textMonthFontSize: 20,
  textMonthFontWeight: "bold",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: "100%",
    width: "100%",
    paddingHorizontal: 12,
  },
  container: {
    borderRadius: 20,
    padding: 12,
    overflow: "hidden",
    maxHeight: 400,
  },
  calendar: {
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  arrowButton: {
    width: 24,
    height: 24,
  },
  selectedContainer: {
    // borderColor,
    borderWidth: 2,
    backgroundColor: "#CF386D",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedText: {
    color: "#CF386D",
    fontWeight: "600",
    fontSize: 14,
  },
});

/* 
export interface MarkingProps extends DotProps {
  type?: MarkingTypes;
  theme?: Theme;
  selected?: boolean;
  marked?: boolean;
  today?: boolean;
  disabled?: boolean;
  inactive?: boolean;
  disableTouchEvent?: boolean;
  activeOpacity?: number;
  textColor?: string;
  selectedColor?: string;
  selectedTextColor?: string;
  customTextStyle?: StyleProp<TextStyle>;
  customContainerStyle?: StyleProp<ViewStyle>;
  dotColor?: string;
  dots?: DOT[];
  periods?: PERIOD[];
  startingDay?: boolean;
  endingDay?: boolean;
  accessibilityLabel?: string;
  customStyles?: CustomStyle;
} */
