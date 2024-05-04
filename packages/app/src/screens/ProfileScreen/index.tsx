import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { UntouchableButton } from "../../components/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";

function ProfileScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "red",
        padding: 12,
      }}
    >
      <View style={styles.container}>
        <View style={styles.row}>
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
        </View>

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

        <View style={styles.row}>
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
        </View>
      </View>
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
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
});
