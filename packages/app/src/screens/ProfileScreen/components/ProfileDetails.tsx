import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { DisplayButton } from "../../../components/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Hr } from "../../../components/Hr";
import { ScreenProps } from "../../../navigation/RootNavigator";
import { CircleProgress } from "../../MainScreen/components/CircleProgress";
import { User } from "../../../components/icons/User";
import { useSelector } from "../../../redux/useSelector";
import { currentUserSelector } from "../../../redux/selectors";
import { useTodayPrediction } from "../../../contexts/PredictionProvider";
import { formatMonthYear } from "../../../services/dateUtils";

export const ProfileDetails = ({ navigation }: ScreenProps<"Profile">) => {
  const currentUser = useSelector(currentUserSelector);
  const todayInfo = useTodayPrediction();

  const goToEdit = () => {
    navigation.navigate("EditProfile");
  };

  const goToAvatarAndTheme = () => {
    navigation.navigate("AvatarAndTheme");
  };

  const cycleLength =
    todayInfo.cycleLength === 100 ? "-" : `${todayInfo.cycleLength} days`;
  const periodLength =
    todayInfo.periodLength === 0 ? "-" : `${todayInfo.periodLength} days`;

  return (
    <View style={styles.container}>
      {/* ===== Top Section ===== */}
      <TouchableOpacity style={styles.row} onPress={goToEdit}>
        <View style={styles.column}>
          <DisplayButton style={styles.icon}>
            <User size={28} />
          </DisplayButton>
        </View>
        <View style={styles.column}>
          <View>
            <Text style={styles.text}>Name</Text>
            <Text style={styles.text}>Date of birth</Text>
            <Text style={styles.text}>Gender</Text>
            <Text style={styles.text}>Location</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View>
            <Text style={[styles.text, styles.bold]}>{currentUser?.name}</Text>
            <Text style={[styles.text, styles.bold]}>
              {currentUser?.gender}
            </Text>
            <Text style={[styles.text, styles.bold]}>
              {formatMonthYear(currentUser?.dateOfBirth)}
            </Text>
            <Text style={[styles.text, styles.bold]}>
              {currentUser?.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <Hr />

      {/* ===== Middle Section ===== */}
      <View style={styles.row}>
        <View style={styles.column}>
          <CircleProgress />
        </View>
        <View style={styles.column}>
          <View>
            <Text style={styles.text}>Cycle length</Text>
            <Text style={styles.text}>period length</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View>
            <Text style={[styles.text, styles.bold]}>{cycleLength}</Text>
            <Text style={[styles.text, styles.bold]}>{periodLength}</Text>
          </View>
        </View>
      </View>
      <Hr />

      {/* ===== Bottom Section ===== */}
      <TouchableOpacity style={styles.row} onPress={goToAvatarAndTheme}>
        <View style={styles.column}>
          <DisplayButton style={styles.icon}>
            <FontAwesome size={28} name={"user"} color={"#fff"} />
          </DisplayButton>
        </View>
        <View style={styles.column}>
          <View>
            <DisplayButton style={styles.icon} status="basic">
              <FontAwesome size={28} name={"user"} color={"#fff"} />
            </DisplayButton>
          </View>
        </View>
        <View style={styles.column}>
          <View>
            <Text style={[styles.text, styles.bold]}>Ari</Text>
            <Text style={[styles.text, styles.bold]}>Hills</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    marginVertical: 4,
  },
  row: {
    flexDirection: "row",
    height: 112,
    padding: 8,
  },
  column: {
    flexBasis: "33%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 52,
    height: 52,
  },
  text: {
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
});
