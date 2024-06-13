import { StyleSheet, TouchableOpacity, View } from "react-native";
import { DisplayButton } from "./Button";
import Cloud from "./icons/Cloud";
import { Star } from "./icons/Star";
import { EmojiBadge } from "./EmojiBadge";
import { IconButton } from "./IconButton";

type DailyCardProps = {
  onPress: () => void;
};

export const DailyCard = ({ onPress }: DailyCardProps) => {
  const status = "neutral";

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.top}>
        <DisplayButton status={status}>Day 12</DisplayButton>
        <IconButton Icon={Cloud} text={"12 June"} />
        <Star size={24} />
      </View>

      <View style={styles.bottom}>
        <EmojiBadge emoji={"😊"} text={"Mood"} status={status} />
        <EmojiBadge emoji={"😊"} text={"Mood"} status={status} />
        <EmojiBadge emoji={"😊"} text={"Mood"} status={status} />
        <EmojiBadge emoji={"😊"} text={"Mood"} status={status} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    width: "100%",
    backgroundColor: "#fff",
    overflow: "hidden",
    aspectRatio: 1.5,
    flexDirection: "column",
    padding: 12,
  },
  top: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  date: {
    height: 80,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  dateIcon: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  dateText: {
    width: "60%",
    textAlign: "center",
    marginRight: 8,
  },
  iconRight: {
    height: 24,
    width: 24,
  },
  bottom: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
