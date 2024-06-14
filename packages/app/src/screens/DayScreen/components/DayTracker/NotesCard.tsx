import React from "react";
import { StyleSheet, View } from "react-native";
import { Input } from "../../../../components/Input";

export const NotesCard = () => {
  const [noteTitle, setNoteTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");

  return (
    <View style={[styles.page]}>
      <Input
        value={noteTitle}
        onChangeText={setNoteTitle}
        placeholder="title"
      />
      <Input
        value={notes}
        onChangeText={setNotes}
        placeholder="write anything you like about your day"
        multiline={true}
      />
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
});
