import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/Button";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { useSelector } from "react-redux";
import { Input } from "../../components/Input";
import { currentUserSelector } from "../../redux/selectors";
import { SegmentControl } from "../../components/SegmentControl";
import {
  genders,
  locations,
  monthOptions,
  yearOptions,
} from "../../config/options";
import { User } from "../../types";
import { WheelPickerOption } from "../../components/WheelPicker";
import { months } from "../../data/data";
import { WheelPickerModal } from "../../components/WheelPickerModal";
import _ from "lodash";

type EditProfileState = {
  name: User["name"];
  gender: User["gender"];
  month: number;
  year: number;
  dateOfBirth: string;
  location: User["location"];
};

type Action<T extends keyof EditProfileState = keyof EditProfileState> = {
  type: T;
  value: EditProfileState[T];
};

const getInitialState = (user: User): EditProfileState => {
  const date = new Date(user.dateOfBirth);

  return {
    name: user.name,
    gender: user.gender,
    month: date.getMonth(),
    year: date.getFullYear(),
    dateOfBirth: user.dateOfBirth,
    location: user.location,
  };
};

function reducer(state: EditProfileState, action: Action): EditProfileState {
  switch (action.type) {
    case "month": {
      const month = action.value as number;
      if (!state.year) {
        return {
          ...state,
          month,
        };
      }

      const dateOfBirth = getDateOfBirth(state.year, month);

      return {
        ...state,
        month,
        dateOfBirth,
      };
    }

    case "year": {
      const year = action.value as number;
      if (!state.month || isNaN(state.month)) {
        return {
          ...state,
          year,
        };
      }

      const dateOfBirth = getDateOfBirth(year, state.month);
      return {
        ...state,
        year,
        dateOfBirth,
      };
    }

    default:
      return {
        ...state,
        [action.type]: action.value,
      };
  }
}

const getDateOfBirth = (year: number, month: number) => {
  const day = 2; // Prevents it defaulting to 31st of previous month
  return new Date(year, month, day).toISOString();
};

const EditProfileScreen: ScreenComponent<"EditProfile"> = () => {
  const currentUser = useSelector(currentUserSelector) as User;

  const initialState = React.useMemo(() => {
    return getInitialState(currentUser);
  }, [currentUser]);

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const onChangeName = (value: string) => {
    dispatch({ type: "name", value });
  };

  const onChangeGender = (value: string) => {
    dispatch({ type: "gender", value });
  };

  const onChangeLocation = (value: string) => {
    dispatch({ type: "location", value });
  };

  const onChangeMonth = (option: WheelPickerOption | undefined) => {
    const index = monthOptions.findIndex(
      (item) => item.value === option?.value
    );
    const value = index >= 0 ? index : undefined;
    if (!value) {
      return;
    }
    dispatch({ type: "month", value });
  };

  const onChangeYear = (option: WheelPickerOption | undefined) => {
    const value = option ? parseInt(option?.value) : undefined;
    if (!value) {
      return;
    }
    dispatch({ type: "year", value });
  };

  const month = months[state.month];
  const year = state.year?.toString();
  const initialMonth = monthOptions.find((item) => item.value === month);
  const initialYear = yearOptions.find((item) => item.value === year);

  const hasChanged = !_.isEqual(state, initialState);

  return (
    <Screen>
      {/* =============== Profile =============== */}
      <View style={styles.container}>
        {/* ===== Name ===== */}
        <View style={styles.segment}>
          <Input value={state.name} onChangeText={onChangeName} />
        </View>

        {/* ===== Gender ===== */}
        <View style={styles.segment}>
          <SegmentControl
            options={genders}
            selected={state.gender}
            onSelect={onChangeGender}
            // errors={errors}
            // errorKey={"no_gender"}
            // errorsVisible={state.errorsVisible}
          />
        </View>

        {/* ===== Month ===== */}
        <View style={styles.segment}>
          <WheelPickerModal
            inputWrapperStyle={styles.wheelPickerModal}
            initialOption={initialMonth}
            options={monthOptions}
            onSelect={onChangeMonth}
            placeholder={"what month were you born"}
            // errors={errors}
            // errorKey={"no_month"}
            // errorsVisible={state.errorsVisible}
          />
        </View>

        {/* ===== Year ===== */}
        <View style={styles.segment}>
          <WheelPickerModal
            inputWrapperStyle={styles.wheelPickerModal}
            initialOption={initialYear}
            options={yearOptions}
            onSelect={onChangeYear}
            placeholder={"what year were you born"}
            // errors={errors}
            // errorKey={"no_year"}
            // errorsVisible={state.errorsVisible}
          />
        </View>

        {/* ===== Location ===== */}
        <View style={styles.segment}>
          <SegmentControl
            options={locations}
            selected={state.location}
            onSelect={onChangeLocation}
            // errors={errors}
            // errorKey={"no_location"}
            // errorsVisible={state.errorsVisible}
          />
        </View>

        <Button
          status={hasChanged ? "primary" : "basic"}
          style={styles.confirm}
        >
          Confirm
        </Button>
      </View>
    </Screen>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    padding: 24,
    marginBottom: 24,
  },
  segment: {
    width: "100%",
    flexDirection: "row",
  },
  segmentLeft: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
  },
  segmentRight: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  confirm: {
    marginTop: 12,
    alignSelf: "center",
  },
  wheelPickerModal: {
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
});
