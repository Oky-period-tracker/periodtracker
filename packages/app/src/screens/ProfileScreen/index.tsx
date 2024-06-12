import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { DisplayButton } from "../../components/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Screen } from "../../components/Screen";
import { Hr } from "../../components/Hr";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { CycleCard } from "./components/CycleCard";

const ProfileScreen: ScreenComponent<"Profile"> = ({ navigation }) => {
  return (
    <Screen>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <View style={styles.column}>
              <DisplayButton style={styles.icon}>
                <FontAwesome size={28} name={"user"} color={"#fff"} />
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
                <Text style={[styles.text, styles.bold]}>Alex</Text>
                <Text style={[styles.text, styles.bold]}>Male</Text>
                <Text style={[styles.text, styles.bold]}>Bali</Text>
                <Text style={[styles.text, styles.bold]}>Urban</Text>
              </View>
            </View>
          </TouchableOpacity>

          <Hr />

          <View style={styles.row}>
            <View style={styles.column}>
              <DisplayButton style={styles.icon} status={"secondary"}>
                <Text>29 days</Text>
              </DisplayButton>
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

          <Hr />

          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate("AvatarAndTheme")}
          >
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

        <CycleCard />
        <CycleCard />
        <CycleCard />
      </ScrollView>
    </Screen>
  );
};

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
});
