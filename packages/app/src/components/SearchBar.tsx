import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Input } from "./Input";
import { Button } from "./Button";

type SearchBarProps = {
  query: string;
  setQuery: (value: string) => void;
  style?: StyleProp<ViewStyle>;
};

export const SearchBar = ({ query, setQuery, style }: SearchBarProps) => {
  const reset = () => {
    setQuery("");
  };

  return (
    <Input
      value={query}
      onChangeText={setQuery}
      style={style}
      placeholder={"type_to_search"}
      actionRight={
        query.length > 0 && (
          <Button style={styles.closeButton} status={"basic"} onPress={reset}>
            <FontAwesome name="close" size={12} color="white" />
          </Button>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  closeButton: {
    width: 24,
    height: 24,
  },
});
