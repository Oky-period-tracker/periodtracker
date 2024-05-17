import React, { useState } from "react";
import { Calendar, CalendarProps } from "react-native-calendars";
import { StyleSheet, View } from "react-native";
import { DisplayButton } from "../../components/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";

function CalendarScreen({ navigation }) {
  const [selected, setSelected] = useState("");

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Calendar
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          style={styles.calendar}
          theme={theme}
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
          // markedDates={markedDates}
        />
      </View>
    </View>
  );
}

export default CalendarScreen;

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
    backgroundColor: "red",
    padding: 12,
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
});
