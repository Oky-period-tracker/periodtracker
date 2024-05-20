import * as React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Screen } from "../../components/Screen";
import { Button, DisplayButton } from "../../components/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { useSelector, useDispatch } from "react-redux";
import { setName } from "../../redux/reducers/appReducer";

const EditProfileScreen: ScreenComponent<"EditProfile"> = () => {
  // @ts-ignore
  const name = useSelector((state) => state.app?.name);
  const dispatch = useDispatch();

  const onChangeText = (value) => {
    dispatch(setName(value));
  };

  const [tempName, setTempName] = React.useState("bum");
  const onChangeLocalState = (v) => {
    setTempName(v);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.segment}>
          <View style={styles.segmentLeft}>
            <DisplayButton style={styles.iconContainer}>
              <FontAwesome size={28} name={"user"} color={"#fff"} />
            </DisplayButton>
          </View>
          <View style={styles.segmentRight}>
            <Text style={styles.label}>Name !</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              onChangeText={onChangeText}
              value={name}
            />
          </View>
        </View>

        <View style={styles.segment}>
          <View style={styles.segmentLeft}>
            <DisplayButton style={styles.iconContainer}>
              <FontAwesome size={28} name={"user"} color={"#fff"} />
            </DisplayButton>
          </View>
          <View style={styles.segmentRight}>
            <Text style={styles.label}>Name local</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              onChangeText={onChangeLocalState}
              value={tempName}
            />
          </View>
        </View>

        <View style={styles.segment}>
          <View style={styles.segmentLeft}>
            <DisplayButton style={styles.iconContainer}>
              <FontAwesome size={28} name={"user"} color={"#fff"} />
            </DisplayButton>
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
            <DisplayButton style={styles.iconContainer}>
              <FontAwesome size={28} name={"user"} color={"#fff"} />
            </DisplayButton>
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
            <DisplayButton style={styles.iconContainer}>
              <FontAwesome size={28} name={"user"} color={"#fff"} />
            </DisplayButton>
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
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    padding: 8,
    width: "100%",
    borderRadius: 8,
  },
  label: {
    marginBottom: 4,
  },
});
