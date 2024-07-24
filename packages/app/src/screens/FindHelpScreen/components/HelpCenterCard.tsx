import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text } from "../../../components/Text";
import { A } from "../../../components/A";
import { useToggle } from "../../../hooks/useToggle";
import { Button } from "../../../components/Button";
import { helpCenterAttributes } from "../../../data/helpCenter";
import { HelpCenter } from "../../../core/types";

export const HelpCenterCard = ({
  helpCenter,
  isSaved,
  onSavePress,
}: {
  helpCenter: HelpCenter;
  isSaved: boolean;
  onSavePress: () => void;
}) => {
  const [expanded, toggleExpanded] = useToggle();
  const websites = helpCenter.website.split(",");

  const emoji = React.useMemo(() => {
    return (
      helpCenterAttributes.find(
        (item) => item.id === helpCenter.primaryAttributeId
      )?.emoji ?? defaultEmoji
    );
  }, [helpCenter]);

  return (
    <TouchableOpacity onPress={toggleExpanded} style={styles.helpCenterCard}>
      <View style={styles.topRow}>
        <View style={styles.topRowText}>
          <Text style={styles.title}>{helpCenter.title}</Text>
          <Text style={styles.caption}>{helpCenter.caption}</Text>
        </View>
        <Text style={styles.emoji}>{emoji}</Text>
        <Button
          style={styles.saveButton}
          status={isSaved ? "danger" : "basic"}
          onPress={onSavePress}
        >
          <FontAwesome
            size={18}
            name={isSaved ? `heart` : `heart-o`}
            color={"#fff"}
          />
        </Button>
      </View>

      {expanded && (
        <>
          <Text style={styles.subtitle}>Phone number:</Text>
          <Text style={styles.text}>{helpCenter.contactOne}</Text>
          {helpCenter.contactTwo && (
            <Text style={styles.text}>{helpCenter.contactTwo}</Text>
          )}

          <Text style={styles.subtitle}>Address:</Text>
          <Text style={styles.text}>{helpCenter.address}</Text>
          {/* TODO: Region and Subregion */}

          <Text style={styles.subtitle}>Website:</Text>
          {websites.map((website) => (
            <A key={website} href={website} style={styles.website}>
              {website}
            </A>
          ))}

          {/* TODO: Display all attributes */}
        </>
      )}
    </TouchableOpacity>
  );
};

const defaultEmoji = "😊";

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
  },
  helpCenterCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    marginVertical: 4,
    padding: 24,
  },
  saveButton: {
    width: 40,
    height: 40,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  topRowText: {
    flexDirection: "column",
    flex: 1,
  },
  text: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  caption: {
    marginBottom: 8,
  },
  emoji: {
    marginHorizontal: 8,
    width: 24,
    textAlign: "center",
  },
  website: {
    marginBottom: 8,
  },
});
