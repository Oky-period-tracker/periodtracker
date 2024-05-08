import * as React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Screen } from "../../components/Screen";
import { Button, UntouchableButton } from "../../components/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";

function EditProfileScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.segment}>
          <View style={styles.segmentLeft}>
            <UntouchableButton style={styles.iconContainer}>
              <FontAwesome size={28} name={"user"} color={"#fff"} />
            </UntouchableButton>
          </View>
          <View style={styles.segmentRight}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              onChangeText={() => null}
              value={""}
            />
          </View>
        </View>

        <View style={styles.segment}>
          <View style={styles.segmentLeft}>
            <UntouchableButton style={styles.iconContainer}>
              <FontAwesome size={28} name={"user"} color={"#fff"} />
            </UntouchableButton>
          </View>
          <View style={styles.segmentRight}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              onChangeText={() => null}
              value={""}
            />
          </View>
        </View>

        <View style={styles.segment}>
          <View style={styles.segmentLeft}>
            <UntouchableButton style={styles.iconContainer}>
              <FontAwesome size={28} name={"user"} color={"#fff"} />
            </UntouchableButton>
          </View>
          <View style={styles.segmentRight}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              onChangeText={() => null}
              value={""}
            />
          </View>
        </View>

        <View style={styles.segment}>
          <View style={styles.segmentLeft}>
            <UntouchableButton style={styles.iconContainer}>
              <FontAwesome size={28} name={"user"} color={"#fff"} />
            </UntouchableButton>
          </View>
          <View style={styles.segmentRight}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              onChangeText={() => null}
              value={""}
            />
          </View>
        </View>

        <View style={styles.segment}>
          <View style={styles.segmentLeft}>
            <UntouchableButton style={styles.iconContainer}>
              <FontAwesome size={28} name={"user"} color={"#fff"} />
            </UntouchableButton>
          </View>
          <View style={styles.segmentRight}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              onChangeText={() => null}
              value={""}
            />
          </View>
        </View>
      </View>

      <Button>Confirm</Button>
    </Screen>
  );
}

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    padding: 24,
    marginBottom: 24,
  },
  segment: {
    width: "100%",
    flexDirection: "row",
  },
  segmentLeft: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  iconContainer: {
    width: 60,
    height: 60,
  },
  segmentRight: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
  },
  input: {
    borderColor: "#f0f0f0",
    borderBottomWidth: 1,
    backgroundColor: "white",
    padding: 8,
    width: "100%",
    borderRadius: 8,
  },
  label: {
    marginBottom: 4,
  },
});
