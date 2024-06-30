import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Modal, ModalProps } from "./Modal";
import Cloud from "./icons/Cloud";
import { IconButton } from "./IconButton";
import moment from "moment";
import { formatMomentDayMonth } from "../services/utils";
import {
  useHistoryPrediction,
  useIsActiveSelector,
  usePredictDay,
  usePredictionDispatch,
  useTodayPrediction,
  usePredictionEngineState,
} from "../contexts/PredictionProvider";
import { useSelector } from "../redux/useSelector";
import {
  decisionProcessNonPeriod,
  decisionProcessPeriod,
} from "../prediction/predictionLogic";
import { useDispatch } from "react-redux";
import {
  currentUserSelector,
  isFuturePredictionSelector,
} from "../redux/selectors";
import {
  answerVerifyDates,
  smartPredictionRequest,
  updateFuturePrediction,
} from "../redux/actions";
import { fetchNetworkConnectionStatus } from "../services/network";
import { User } from "../redux/reducers/authReducer";
import { DayData } from "../screens/MainScreen/DayScrollContext";
// import { usePredictDay } from "../contexts/PredictionProvider";

export const DayModal = ({
  data,
  visible,
  toggleVisible,
}: { data: DayData } & ModalProps) => {
  const selectedDayInfo = data;
  const inputDay = data.date;
  // const dataEntry = usePredictDay(date);

  // const { id: themeName } = useTheme();
  // const source = useStatusForSource(themeName);
  const dispatch = usePredictionDispatch();
  // const undoFunc = useUndoPredictionEngine();
  const history = useHistoryPrediction();
  const selectedDayInfoEngine = usePredictDay(inputDay);
  const isActive = useIsActiveSelector();
  const reduxDispatch = useDispatch();
  const currentUser = useSelector(currentUserSelector) as User; // TODO:
  const userID = currentUser?.id;
  const currentCycleInfo = useTodayPrediction();
  const inputDayStr = moment(inputDay).format("YYYY-MM-DD");
  const todayStr = moment().format("YYYY-MM-DD");

  // flower
  // const cardAnswersToday = useSelector((state) =>
  //   verifyPeriodDaySelectorWithDate(state, moment(inputDayStr))
  // );

  const predictionFullState = usePredictionEngineState();
  const [addNewCycleHistory, setNewCycleHistory] = React.useState(false);
  const hasFuturePredictionActive = useSelector(isFuturePredictionSelector);
  const futurePredictionStatus =
    hasFuturePredictionActive?.futurePredictionStatus;

  React.useEffect(() => {
    if (
      moment(inputDay).diff(moment(currentCycleInfo.cycleStart), "days") < 0
    ) {
      setNewCycleHistory(true);
    }
  }, [addNewCycleHistory]);

  // const minimizeToTutorial = () => {
  //   toggleVisible();
  //   setTimeout(
  //     () => {
  //       navigateToTutorial();
  //     },
  //     Platform.OS === "ios" ? 500 : 300
  //   );
  // };

  if (inputDay === null) {
    return <View />;
  }

  // TODO:
  // eslint-disable-next-line
  const errorCallBack = (err: string) => {
    // if (err) {
    //   // setDisplayTextStatic(err);
    // }
    return null;
  };

  // TODO:
  // eslint-disable-next-line
  const getPredictedCycles = (flag: boolean): any => {
    if (flag) {
      // @ts-expect-error TODO: THIS IS ALWAYS TRUE !!!!
      if (fetchNetworkConnectionStatus()) {
        const tempHistory = [...history];
        const tempPeriodsCycles = [];
        const tempPeriodsLength = [];
        tempPeriodsCycles.push(predictionFullState.currentCycle.cycleLength);
        tempPeriodsLength.push(predictionFullState.currentCycle.periodLength);
        tempHistory.forEach((item) => {
          tempPeriodsCycles.push(item.cycleLength);
          tempPeriodsLength.push(item.periodLength);
        });
        tempPeriodsCycles.reverse();
        tempPeriodsLength.reverse();
        for (let i = 0; i < 10; i++) {
          if (tempPeriodsCycles.length < 10) {
            tempPeriodsCycles.unshift(0);
            tempPeriodsLength.unshift(0);
          }
        }
        reduxDispatch(
          smartPredictionRequest({
            cycle_lengths: tempPeriodsCycles,
            period_lengths: tempPeriodsLength,
            age: moment().diff(moment(currentUser.dateOfBirth), "years"),
            predictionFullState,
            futurePredictionStatus,
          })
        );
      }
    }
    reduxDispatch(
      updateFuturePrediction(
        Boolean(futurePredictionStatus),
        predictionFullState.currentCycle
      )
    );
  };

  const actionPink = decisionProcessPeriod({
    inputDay,
    selectedDayInfo: selectedDayInfoEngine,
    currentCycleInfo,
    history,
    isActive,
    // errorCallBack,
    // getPredictedCycles,
  });

  const actionBlue = decisionProcessNonPeriod({
    inputDay,
    selectedDayInfo: selectedDayInfoEngine,
    currentCycleInfo,
    history,
    isActive,
  });

  const checkForDay = () => {
    // For Current day
    if (moment(inputDayStr).isSame(moment(todayStr))) {
      if (
        !selectedDayInfo.onPeriod &&
        inputDay.diff(moment().startOf("day"), "days") === 0 &&
        inputDay.diff(selectedDayInfo.cycleStart, "days") >=
          selectedDayInfo.periodLength + minBufferBetweenCycles
      ) {
        if (
          moment(todayStr).diff(moment(currentCycleInfo.cycleStart), "days") <
          11
        ) {
          dispatch({
            type: actionPink.type,
            inputDay: actionPink.day,
            errorCallBack,
          });
        } else {
          dispatch({
            type: "start-next-cycle",
            inputDay,
            errorCallBack,
            getPredictedCycles,
          });
        }
      } else {
        if (actionPink) {
          dispatch({
            type: actionPink.type,
            inputDay: actionPink.day,
            errorCallBack,
            getPredictedCycles,
          });
        }
      }
    } else {
      dispatch({
        type: actionPink.type,
        inputDay: actionPink.day,
        errorCallBack,
        getPredictedCycles,
      });
    }
    reduxDispatch(
      answerVerifyDates({
        userID,
        utcDateTime: inputDay,
        periodDay: true,
      })
    );
  };

  function onYesPress() {
    // if (fetchNetworkConnectionStatus()) {
    //   analytics().logEvent("periodDayCloudTap", { user: currentUser });
    // }
    // if (moment(inputDay).isAfter(moment())) {
    //   setDisplayTextStatic("too_far_ahead");
    //   toggleVisible();
    //   return;
    // }
    if (addNewCycleHistory) {
      if (selectedDayInfo.onPeriod) {
        reduxDispatch(
          answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: true,
          })
        );
        // incFlowerProgress();
      } else {
        dispatch({
          type: "add-new-cycle-history",
          inputDay,
          errorCallBack,
          getPredictedCycles,
        });
        reduxDispatch(
          answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: true,
          })
        );
        // incFlowerProgress();
      }
    } else {
      if (selectedDayInfo.onPeriod) {
        reduxDispatch(
          answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: true,
          })
        );
        // incFlowerProgress();
      } else {
        checkForDay();
      }
    }

    toggleVisible();
  }

  const onNoPress = () => {
    // if (fetchNetworkConnectionStatus()) {
    //   analytics().logEvent('noPeriodDayCloudTap', { user: currentUser })
    // }
    if (moment(inputDay).isAfter(moment())) {
      // setDisplayTextStatic("too_far_ahead");
      toggleVisible();
      return;
    }
    if (selectedDayInfoEngine.onPeriod) {
      if (actionBlue) {
        dispatch({
          type: actionBlue.type,
          inputDay: actionBlue.day,
          errorCallBack,
          getPredictedCycles,
        });
        reduxDispatch(
          answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: false,
          })
        );
      }
    }
    toggleVisible();
  };

  return (
    <Modal visible={visible} toggleVisible={toggleVisible} style={styles.modal}>
      <Text style={styles.title}>Did you have your period today?</Text>
      <Text style={styles.description}>
        Tell Oky about your period to get better predictions, did you have your
        period today?
      </Text>

      <IconButton
        Icon={Cloud}
        size={160}
        text={formatMomentDayMonth(inputDay)}
        status={"basic"}
      />

      <View style={styles.buttons} pointerEvents="box-none">
        <IconButton
          Icon={Cloud}
          onPress={onYesPress}
          size={100}
          text={"Yes"}
          status={"danger"}
        />
        <IconButton Icon={Cloud} onPress={onNoPress} size={100} text={"No"} />
      </View>
    </Modal>
  );
};

const minBufferBetweenCycles = 2;

const styles = StyleSheet.create({
  modal: {
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  description: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  dateIcon: {
    width: 160,
    height: 160,
  },
  buttons: {
    marginTop: 48,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
});
