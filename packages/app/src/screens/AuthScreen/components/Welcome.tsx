import React from "react";
import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Swiper } from "../../../components/Swiper";
import { Button } from "../../../components/Button";
import { useAuthMode } from "../AuthModeContext";
import { UserIcon } from "../../../components/icons/UserIcon";
import { WelcomeCard } from "./WelcomeCard";
import { useDispatch } from "react-redux";
import { setHasOpened } from "../../../redux/actions";

export const Welcome = () => {
  const [index, setIndex] = React.useState(0);

  const pages = [
    <WelcomeCard
      icon={
        <FontAwesome name={"calendar-check-o"} size={ICON_SIZE} color="white" />
      }
      subtitle={"calendar"}
      description={"calendar_onboard"}
    />,
    <WelcomeCard
      icon={<FontAwesome name={"file-text"} size={ICON_SIZE} color="white" />}
      subtitle={"the_facts"}
      description={"the_facts_onboard"}
    />,
    <WelcomeCard
      icon={<UserIcon size={ICON_SIZE} />}
      subtitle={"friend"}
      description={"friends_onboard"}
    />,
  ];

  return (
    <Swiper
      index={index}
      setIndex={setIndex}
      pages={pages}
      renderActionRight={renderActionRight}
    />
  );
};

const renderActionRight = (currentPage: number, total: number) => {
  const dispatch = useDispatch();
  const { setAuthMode } = useAuthMode();

  const onPress = () => {
    dispatch(setHasOpened(true));
    setAuthMode("start");
  };

  const isLastPage = currentPage === total - 1;
  const opacity = isLastPage ? 1 : 0;

  return (
    <Button
      onPress={onPress}
      style={[styles.button, { opacity }]}
      status={"secondary"}
    >
      continue
    </Button>
  );
};

const ICON_SIZE = 40;

const styles = StyleSheet.create({
  button: {
    marginLeft: "auto",
  },
  displayImage: {
    width: 80,
    height: 80,
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
    marginTop: "2%",
    marginLeft: "13%",
  },
  headText: {
    fontSize: 28,
    textAlign: "left",
    width: "80%",
    fontWeight: "bold",
    fontFamily: "Roboto",
    color: "#e3629b",
  },
  iconHead: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "5%",
  },
  belowText: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: "5%",
    paddingHorizontal: "8%",
    alignItems: "center",
    textAlign: "center",
  },
});
