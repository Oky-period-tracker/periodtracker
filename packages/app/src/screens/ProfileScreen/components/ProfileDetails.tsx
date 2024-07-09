import * as React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { DisplayButton } from "../../../components/Button";
import { Hr } from "../../../components/Hr";
import { ScreenProps } from "../../../navigation/RootNavigator";
import { CircleProgress } from "../../MainScreen/components/CircleProgress";
import { UserIcon } from "../../../components/icons/UserIcon";
import { Text } from "../../../components/Text";
import { useSelector } from "../../../redux/useSelector";
import {
  currentAvatarSelector,
  currentThemeSelector,
  currentUserSelector,
} from "../../../redux/selectors";
import { useTodayPrediction } from "../../../contexts/PredictionProvider";
import { formatMonthYear } from "../../../services/dateUtils";
import { getAsset } from "../../../services/asset";
import { SaveAccountButton } from "./SaveAccountButton";

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
      {currentUser?.isGuest && (
        <>
          <View style={styles.row}>
            <SaveAccountButton />
          </View>
          <Hr />
        </>
      )}

      {/* ===== Top Section ===== */}
      <TouchableOpacity style={styles.row} onPress={goToEdit}>
        <View style={styles.column}>
          <DisplayButton style={styles.icon}>
            <UserIcon size={28} />
          </DisplayButton>
        </View>
        <View style={styles.column}>
          <View>
            <Text style={styles.text}>name</Text>
            <Text style={styles.text}>age</Text>
            <Text style={styles.text}>gender</Text>
            <Text style={styles.text}>location</Text>
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
            <Text style={styles.text}>cycle_length</Text>
            <Text style={styles.text}>period_length</Text>
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
            <Text style={[styles.text, styles.bold]} enableTranslate={false}>Ari</Text>
            <Text style={[styles.text, styles.bold]} enableTranslate={false}>Hills</Text>
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
    alignItems: "center",
    justifyContent: "center",
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
