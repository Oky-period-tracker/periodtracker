import React, { useState } from "react";
import { Calendar, CalendarProps, DateData } from "react-native-calendars";
import { StyleSheet, View } from "react-native";
import { Button, DisplayButton } from "../../components/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { Text } from "../../components/Text";
import { Modal } from "../../components/Modal";
import { useToggle } from "../../hooks/useToggle";

import {
  useCalculateStatusForDateRange,
  usePredictDay,
} from "../../contexts/PredictionProvider";
import moment from "moment";
import { isFutureDate } from "../../services/dateUtils";
import { DayModal } from "../../components/DayModal";
import { useSelector } from "react-redux";
import {
  allCardAnswersSelector,
  isFuturePredictionSelector,
} from "../../redux/selectors";

// TODO: dynamic start & end dates?
const startDate = moment().startOf("day").subtract(24, "months");
const endDate = moment().startOf("day").add(12, "months");

const CalendarScreen: ScreenComponent<"Calendar"> = ({ navigation }) => {
  const [selected, setSelected] = useState("");
  const date = moment(selected);
  const dataEntry = usePredictDay(date);

  const [choiceModalVisible, toggleChoiceModalVisible] = useToggle();
  const [dayModalVisible, toggleDayModal] = useToggle();

  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = setTimeout(() => {
      setMessage("");
    }, MESSAGE_DURATION);

    return () => {
      clearTimeout(timeout);
    };
  }, [message]);

  const toDailyCard = () => {
    toggleChoiceModalVisible();
    navigation.navigate("Day", { date: dataEntry.date });
  };

  const toDayModal = () => {
    toggleChoiceModalVisible();
    toggleDayModal();
  };

  const onDayPress = (day: DateData) => {
    const selectedMoment = moment(day.dateString);
    if (isFutureDate(selectedMoment)) {
      setMessage(`too_far_ahead`);
      return;
    }
    setSelected(day.dateString);
    toggleChoiceModalVisible();
  };

  const hasFuturePredictionActive = useSelector(isFuturePredictionSelector);
  const verifiedPeriodsData = useSelector((state) =>
    // @ts-expect-error TODO:
    allCardAnswersSelector(state)
  );

  // TODO: this is a massive object that could be reduced via dynamic start & end dates
  const markedDates = useCalculateStatusForDateRange(
    startDate,
    endDate,
    verifiedPeriodsData,
    !!hasFuturePredictionActive?.futurePredictionStatus
  );

  const messageOpacity = message ? 1 : 0;

  return (
    <View style={styles.screen}>
      <View style={[styles.messageBoxContainer, { opacity: messageOpacity }]}>
        <View style={styles.messageBox}>
          <Text>{message}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Calendar
          onDayPress={onDayPress}
          style={styles.calendar}
          theme={theme}
          enableSwipeMonths
          onVisibleMonthsChange={() => {
            //
          }}
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
          markedDates={markedDates}
        />
      </View>

      <Modal
        visible={choiceModalVisible}
        toggleVisible={toggleChoiceModalVisible}
      >
        <View style={styles.modalBody}>
          <Button onPress={toDailyCard} style={styles.modalButton}>
            to_daily_card
          </Button>
          <Button onPress={toDayModal}>change_period</Button>
        </View>
      </Modal>

      <DayModal
        data={dataEntry}
        visible={dayModalVisible}
        toggleVisible={toggleDayModal}
      />
    </View>
  );
};

export default CalendarScreen;

const MESSAGE_DURATION = 5000;

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
  messageBoxContainer: {
    width: "100%",
    alignItems: "center",
  },
  messageBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 160,
    minHeight: 60,
    padding: 12,
  },
  modalBody: {
    flexDirection: "column",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    borderRadius: 20,
  },
  modalButton: {
    marginBottom: 24,
  },
});
