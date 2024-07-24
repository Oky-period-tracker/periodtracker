import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { DisplayButton } from "../../../components/Button";
import { Text } from "../../../components/Text";
import { assets } from "../../../assets";

interface CardProps {
  title: string;
  iconType: "fontawesome" | "custom";
  fontAwesomeName?: keyof typeof FontAwesome.glyphMap;
  iconComponent?: React.ReactNode;
  iconHeading: string;
  description: string;
}

const Card: React.FC<CardProps> = ({
  iconType,
  fontAwesomeName,
  iconComponent,
  iconHeading,
  description,
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case "fontawesome":
        return <FontAwesome name={fontAwesomeName} size={40} color="white" />;
      case "custom":
        return iconComponent;
      default:
        return null;
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.welcomeContainer}>
        <Image source={assets.static.launch_icon} style={styles.logo} />
        <Text style={styles.headText}>auth_welcome</Text>
      </View>
      <DisplayButton status={"primary"} style={styles.displayImage}>
        {renderIcon()}
      </DisplayButton>
      <Text style={styles.iconHead}>{iconHeading}</Text>
      <Text style={styles.belowText}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    marginBottom: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginLeft: "auto",
  },
  displayImage: {
    height: 80,
    width: 80,
  },

  logo: {
    width: 150,
    height: 150,
  },
  welcomeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  headText: {
    fontSize: 28,
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Roboto",
    color: "#e3629b",
    marginRight: 32,
  },
  iconHead: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  belowText: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 16,
    paddingHorizontal: 32,
    textAlign: "center",
  },
});

export default Card;
