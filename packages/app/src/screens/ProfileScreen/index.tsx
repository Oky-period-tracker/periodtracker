import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { UntouchableButton } from "../../components/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Screen } from "../../components/Screen";

function ProfileScreen({ navigation }) {
  return (
    <Screen>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate("EditProfileScreen")}
          >
            <View style={styles.column}>
              <UntouchableButton style={styles.icon}>
                <FontAwesome size={28} name={"user"} color={"#fff"} />
              </UntouchableButton>
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
                <Text style={[styles.text, styles.bold]}>Alex</Text>
                <Text style={[styles.text, styles.bold]}>Male</Text>
                <Text style={[styles.text, styles.bold]}>Bali</Text>
                <Text style={[styles.text, styles.bold]}>Urban</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.hr}></View>

          <View style={styles.row}>
            <View style={styles.column}>
              <UntouchableButton style={styles.icon} status={"secondary"}>
                <Text>29 days</Text>
              </UntouchableButton>
            </View>
            <View style={styles.column}>
              <View>
                <Text style={styles.text}>Cycle length</Text>
                <Text style={styles.text}>period length</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View>
                <Text style={[styles.text, styles.bold]}>29 days</Text>
                <Text style={[styles.text, styles.bold]}>4 days</Text>
              </View>
            </View>
          </View>

          <View style={styles.hr}></View>

          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate("AvatarAndThemeScreen")}
          >
            <View style={styles.column}>
              <UntouchableButton style={styles.icon}>
                <FontAwesome size={28} name={"user"} color={"#fff"} />
              </UntouchableButton>
            </View>
            <View style={styles.column}>
              <View>
                <UntouchableButton style={styles.icon} status="basic">
                  <FontAwesome size={28} name={"user"} color={"#fff"} />
                </UntouchableButton>
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
              <View>
                <UntouchableButton
                  style={styles.emojiCircle}
                  status={"basic"}
                ></UntouchableButton>
                <Text style={styles.emojiText}>Mood</Text>
              </View>
              <View>
                <UntouchableButton
                  style={styles.emojiCircle}
                  status={"basic"}
                ></UntouchableButton>
                <Text style={styles.emojiText}>Mood</Text>
              </View>
              <View>
                <UntouchableButton
                  style={styles.emojiCircle}
                  status={"basic"}
                ></UntouchableButton>
                <Text style={styles.emojiText}>Mood</Text>
              </View>
              <View>
                <UntouchableButton
                  style={styles.emojiCircle}
                  status={"basic"}
                ></UntouchableButton>
                <Text style={styles.emojiText}>Mood</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.cycleCard}>
          <View style={styles.cycleCardHeader}></View>
          <View style={styles.cycleCardBody}></View>
        </View>
        <View style={styles.cycleCard}>
          <View style={styles.cycleCardHeader}></View>
          <View style={styles.cycleCardBody}></View>
        </View>
        <View style={styles.cycleCard}>
          <View style={styles.cycleCardHeader}></View>
          <View style={styles.cycleCardBody}></View>
        </View>
      </ScrollView>
    </Screen>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    marginVertical: 4,
  },
  row: {
    flexDirection: "row",
    height: 120,
  },
  column: {
    flexBasis: "33%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 60,
    height: 60,
  },
  text: {
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  hr: {
    width: "100%",
    height: 1,
    backgroundColor: "#f0f0f0",
  },
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
    backgroundColor: "green",
    width: "100%",
    height: " 33%",
    paddingHorizontal: 16,
  },
  cycleCardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "blue",
    flex: 1,
  },
  cycleCardBodyLeft: {
    width: "50%",
    height: "100%",
    backgroundColor: "purple",
    flexDirection: "column",
    justifyContent: "center",
    padding: 16,
  },
  cycleCardBodyRight: {
    width: "50%",
    height: "100%",
    backgroundColor: "pink",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  emojiContainer: {},
  emojiCircle: {
    width: 28,
    height: 28,
  },
  emojiText: {
    fontSize: 10,
  },
});
