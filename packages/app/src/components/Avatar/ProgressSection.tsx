import React from "react";
import { StyleSheet, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { cardAnswerSelector } from "../../redux/selectors";
import moment from "moment";
import { useSelector } from "../../redux/useSelector";
import { ProgressBar } from "./ProgressBar";
import { palette, starColor } from "../../config/theme";

export const ProgressSection = () => {
  const cardAnswersToday = useSelector((state) =>
    cardAnswerSelector(state, moment.utc())
  );

  return (
    <View style={[styles.container]}>
      {/* ===== HEARTS ===== */}
      <View style={styles.section}>
        <FontAwesome
          name={getHeart(Object.keys(cardAnswersToday).length)}
          color={palette.danger.base}
          size={ICON_SIZE}
          style={styles.icon}
        />
        <ProgressBar color={palette.danger.base} />
      </View>

      {/* ===== STARS ===== */}
      <View style={styles.section}>
        <FontAwesome
          name={getStar(Object.keys(cardAnswersToday).length)}
          color={starColor}
          size={ICON_SIZE}
          style={styles.icon}
        />
        <ProgressBar
          color={starColor}
          value={
            Object.keys(cardAnswersToday).length * 25 >= 100
              ? 100
              : Object.keys(cardAnswersToday).length * 25
          }
        />

        {/* <HeartAnimation count={animatedHearts} /> */}
      </View>
    </View>
  );
};

const getHeart = (numberOfElements: number) => {
  if (numberOfElements === null) return "heart-o";
  if (numberOfElements < 2) return "heart-o";
  if (numberOfElements >= 2 && numberOfElements < 4) return "heart";
  if (numberOfElements >= 4) return "heart";
};

const getStar = (numberOfElements: number) => {
  if (numberOfElements === null) return "star-o";
  if (numberOfElements < 2) return "star-o";
  if (numberOfElements >= 2 && numberOfElements < 4) return "star-half-full";
  if (numberOfElements >= 4) return "star";
};

const ICON_SIZE = 12;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 32,
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
