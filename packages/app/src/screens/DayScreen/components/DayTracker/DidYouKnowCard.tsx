import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "../../../../redux/useSelector";
import { allDidYouKnowsSelectors } from "../../../../redux/selectors";
import _ from "lodash";

export const DidYouKnowCard = () => {
  const allDidYouKnows = useSelector(allDidYouKnowsSelectors);
  const randomDidYouKnow = React.useMemo(() => {
    return _.sample(allDidYouKnows);
  }, []);

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Did you know?</Text>
      <Text>{randomDidYouKnow?.title}</Text>
      <View style={styles.body}>
        <Text style={styles.content}>{randomDidYouKnow?.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    padding: 24,
  },
  button: {
    marginLeft: "auto",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F49200",
    marginBottom: 24,
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E3629B",
    marginBottom: 24,
    textAlign: "center",
  },
});
