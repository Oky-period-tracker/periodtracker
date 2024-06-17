import * as React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Screen } from "../../components/Screen";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { CycleCard } from "./components/CycleCard";
import { ProfileDetails } from "./components/ProfileDetails";

const ProfileScreen: ScreenComponent<"Profile"> = (props) => {
  
  return (
    <Screen>
      {/* TODO: FlatList ? */}
      <ScrollView style={styles.scrollView}>
        <ProfileDetails {...props} />
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
});
