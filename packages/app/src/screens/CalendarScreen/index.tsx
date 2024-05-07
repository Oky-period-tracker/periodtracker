import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import { StyleSheet, View } from "react-native";
import { UntouchableButton } from "../../components/Button";
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
          style={{
            borderRadius: 20,
            width: "100%",
            height: "100%",
          }}
          theme={{
            monthTextColor: "#f49200",
            textMonthFontSize: 20,
            textMonthFontWeight: "bold",
          }}
          renderArrow={(direction) => {
            return (
              <UntouchableButton style={styles.arrowButton}>
                <FontAwesome
                  size={12}
                  name={`arrow-${direction}`}
                  color={"#fff"}
                />
              </UntouchableButton>
            );
          }}
          // markedDates={markedDates}
        />
      </View>
    </View>
  );
}

export default CalendarScreen;

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
    padding: 8,
    overflow: "hidden",
    backgroundColor: "white",
  },
  calendar: {
    width: "100%",
    height: "100%",
  },
  arrowButton: {
    width: 24,
    height: 24,
  },
});
