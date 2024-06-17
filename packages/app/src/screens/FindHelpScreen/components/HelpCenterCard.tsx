import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../../components/Text";
import { HelpCenter } from "../../../data/data";
import { A } from "../../../components/A";
import { useToggle } from "../../../hooks/useToggle";

export const HelpCenterCard = ({ helpCenter }: { helpCenter: HelpCenter }) => {
  const [expanded, toggleExpanded] = useToggle();
  const websites = helpCenter.websites.split(",");

  return (
    <TouchableOpacity onPress={toggleExpanded} style={styles.helpCenterCard}>
      <Text style={styles.title}>{helpCenter.title}</Text>
      <Text style={styles.caption}>{helpCenter.caption}</Text>

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
            <A href={website} style={styles.website}>
              {website}
            </A>
          ))}

          {/* TODO: Display all attributes */}
        </>
      )}
    </TouchableOpacity>
  );
};

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
  website: {
    marginBottom: 8,
  },
});
