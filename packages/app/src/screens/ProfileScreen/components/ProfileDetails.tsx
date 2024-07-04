import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { DisplayButton } from "../../../components/Button";
import { Hr } from "../../../components/Hr";
import { ScreenProps } from "../../../navigation/RootNavigator";
import { CircleProgress } from "../../MainScreen/components/CircleProgress";
import { UserIcon } from "../../../components/icons/UserIcon";
import { useSelector } from "../../../redux/useSelector";
import {
  currentAvatarSelector,
  currentThemeSelector,
  currentUserSelector,
} from "../../../redux/selectors";
import { useTodayPrediction } from "../../../contexts/PredictionProvider";
import { formatMonthYear } from "../../../services/dateUtils";
import { getAsset } from "../../../services/asset";

export const ProfileDetails = ({ navigation }: ScreenProps<"Profile">) => {
  const currentUser = useSelector(currentUserSelector);
  const avatar = useSelector(currentAvatarSelector);
  const theme = useSelector(currentThemeSelector);
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
            <UserIcon size={28} />
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
          <Image
            source={getAsset(`avatars.${avatar}.theme`)}
            style={styles.avatarImage}
          />
        </View>
        <View style={styles.column}>
          <View style={styles.themeWrapper}>
            <Image
              source={getAsset(`backgrounds.${theme}.default`)}
              style={styles.themeImage}
            />
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
    height: 100,
    padding: 12,
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
  avatarImage: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    aspectRatio: 1,
    resizeMode: "contain",
  },
  themeWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  themeImage: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    resizeMode: "cover",
  },
});
