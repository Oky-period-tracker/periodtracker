import React from "react";
import { StyleSheet, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { cardAnswerSelector } from "../../redux/selectors";
import moment from "moment";
import { useSelector } from "../../redux/useSelector";
import { ProgressBar } from "./ProgressBar";
import { palette, starColor } from "../../config/theme";
import {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";
import { HeartAnimation } from "./HeartAnimation";

export const ProgressSection = ({
  heartProgress,
}: {
  heartProgress: SharedValue<number>;
}) => {
  const [progress, setProgress] = React.useState(0);

  useAnimatedReaction(
    () => heartProgress.value,
    (currentHeartProgress) => {
      runOnJS(setProgress)(currentHeartProgress);
    },
    [heartProgress]
  );

  const heartPercent = Math.min(progress * 5, 100);

  const cardAnswersToday = useSelector((state) =>
    cardAnswerSelector(state, moment.utc())
  );

  const starPercent = Math.min(Object.keys(cardAnswersToday).length * 25, 100);

  return (
    <View style={[styles.container]} pointerEvents={"none"}>
      {/* ===== Hearts ===== */}
      <View style={styles.section}>
        <FontAwesome
          name={getHeart(heartPercent)}
          color={palette.danger.base}
          size={ICON_SIZE}
          style={styles.icon}
        />
        <ProgressBar color={palette.danger.base} value={heartPercent} />
      </View>

      {/* ===== Stars ===== */}
      <View style={styles.section}>
        <FontAwesome
          name={getStar(Object.keys(cardAnswersToday).length)}
          color={starColor}
          size={ICON_SIZE}
          style={styles.icon}
        />
        <ProgressBar color={starColor} value={starPercent} />
      </View>

      {/* ===== Animated hearts ===== */}
      <HeartAnimation count={progress} />
    </View>
  );
};

const getHeart = (numberOfElements: number) => {
  if (numberOfElements === null) return "heart-o";
  if (numberOfElements < 50) return "heart-o";
  if (numberOfElements >= 50) return "heart"; // TODO: half-heart
  if (numberOfElements >= 100) return "heart";
  return "heart-o";
};

const getStar = (numberOfElements: number) => {
  if (numberOfElements === null) return "star-o";
  if (numberOfElements < 2) return "star-o";
  if (numberOfElements >= 2 && numberOfElements < 4) return "star-half-full";
  if (numberOfElements >= 4) return "star";
  return "star-o";
};

const ICON_SIZE = 12;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 28,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 2,
    borderRadius: 5,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 1,
  },
  icon: {
    marginRight: 4,
  },
});
