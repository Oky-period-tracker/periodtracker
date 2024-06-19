import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { DisplayButton } from "../../../components/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Hr } from "../../../components/Hr";
import { ScreenProps } from "../../../navigation/RootNavigator";

export const ProfileDetails = ({ navigation }: ScreenProps<"Profile">) => {
  const goToEdit = () => {
    navigation.navigate("EditProfile");
  };

  const goToAvatarAndTheme = () => {
    navigation.navigate("AvatarAndTheme");
  };

  return (
    <View style={styles.container}>
      {/* ===== Top Section ===== */}
      <TouchableOpacity style={styles.row} onPress={goToEdit}>
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

      {/* ===== Middle Section ===== */}
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
