import { StyleSheet, Text, View } from "react-native";
import { EmojiBadge } from "../../../components/EmojiBadge";

export const CycleCard = () => {
  return (
    <View style={styles.cycleCard}>
      <View style={styles.cycleCardHeader}>
        <Text>Cycle 1</Text>
        <Text>29 day cycle</Text>
        <Text>13 Mar - 10 Apr</Text>
      </View>
      <View style={styles.cycleCardBody}>
        <View style={styles.cycleCardBodyLeft}>
          <Text>4 day period</Text>
          <Text>13 mar - 17 mar</Text>
        </View>
        <View style={styles.cycleCardBodyRight}>
          <EmojiBadge
            emoji={"😊"}
            text={"Mood"}
            status={"basic"}
            size={"small"}
          />
          <EmojiBadge
            emoji={"😊"}
            text={"Mood"}
            status={"basic"}
            size={"small"}
          />
          <EmojiBadge
            emoji={"😊"}
            text={"Mood"}
            status={"basic"}
            size={"small"}
          />
          <EmojiBadge
            emoji={"😊"}
            text={"Mood"}
            status={"basic"}
            size={"small"}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cycleCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    height: 140,
    marginVertical: 4,
    flexDirection: "column",
    overflow: "hidden",
  },
  cycleCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e3629b",
    width: "100%",
    height: " 33%",
    paddingHorizontal: 16,
  },
  cycleCardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  cycleCardBodyLeft: {
    width: "50%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    padding: 16,
  },
  cycleCardBodyRight: {
    width: "50%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
