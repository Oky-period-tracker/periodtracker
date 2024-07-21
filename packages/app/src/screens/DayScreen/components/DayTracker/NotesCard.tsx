import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Input } from "../../../../components/Input";
import { Text } from "../../../../components/Text";
import { Hr } from "../../../../components/Hr";
import {
  currentUserSelector,
  notesAnswerSelector,
} from "../../../../redux/selectors";
import { useSelector } from "../../../../redux/useSelector";
import { DayData } from "../../../MainScreen/DayScrollContext";
import { useDispatch } from "react-redux";
import { answerNotesCard } from "../../../../redux/actions";

export const NotesCard = ({ dataEntry }: { dataEntry?: DayData }) => {
  const userID = useSelector(currentUserSelector)?.id;

  const reduxEntry = useSelector((state) =>
    notesAnswerSelector(state, dataEntry?.date)
  );

  const reduxDispatch = useDispatch();

  const [title, setTitle] = React.useState(reduxEntry.title);
  const [notes, setNotes] = React.useState(reduxEntry.notes);

  const onPress = () => {
    if (!userID || !dataEntry) {
      return;
    }

    reduxDispatch(
      answerNotesCard({
        title,
        notes,
        userID,
        utcDateTime: dataEntry?.date,
      })
    );
  };

  return (
    <>
      <View style={styles.page}>
        <Input value={title} onChangeText={setTitle} placeholder="title" />
        <Input
          value={notes}
          onChangeText={setNotes}
          placeholder="write anything you like about your day"
          multiline={true}
        />
      </View>
      <Hr />
      <TouchableOpacity onPress={onPress} style={styles.confirm}>
        <Text style={styles.confirmText}>confirm</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  confirm: {
    padding: 24,
  },
  confirmText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
