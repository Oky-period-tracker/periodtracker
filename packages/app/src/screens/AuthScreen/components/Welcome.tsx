import React from "react";
import { StyleSheet } from "react-native";
import { Swiper } from "../../../components/Swiper";
import { Button } from "../../../components/Button";
import { useAuthMode } from "../AuthModeContext";
import { UserIcon } from "../../../components/icons/UserIcon";
import WelcomeCard from "./WelcomeCard";
import { useDispatch } from "react-redux";
import { setHasOpened } from "../../../redux/actions";

export const Welcome = () => {
  const [index, setIndex] = React.useState(0);

  const pages = [
    {
      iconType: "fontawesome",
      fontAwesomeName: "calendar-check-o",
      iconHeading: "calendar",
      description: "calendar_onboard",
    },
    {
      iconType: "fontawesome",
      fontAwesomeName: "file-text",
      iconHeading: "the_facts",
      description: "the_facts_onboard",
    },
    {
      iconType: "custom",
      iconComponent: <UserIcon size={50} />,
      iconHeading: "friend",
      description: "friends_onboard",
    },
  ];
  return (
    <Swiper
      index={index}
      setIndex={setIndex}
      pages={pages.map((page) => (
        //@ts-expect-error Giving Error about Prop type
        <WelcomeCard key={page.title} {...page} />
      ))}
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
