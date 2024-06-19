import React from "react";
import { StyleSheet, Text, View, Image, ImageSourcePropType } from "react-native";
import { Swiper } from "../../../components/Swiper";
import { Button , DisplayButton } from "../../../components/Button";
import { Dimensions } from 'react-native';
import { useAuthMode } from "../AuthModeContext";
import calenderSrc from "../../../assets/images/slider/calender.png";
import buddySrc from "../../../assets/images/slider/buddy.png";
import newsSrc from "../../../assets/images/slider/news.png";

const screenHeight = Dimensions.get('window').height;

interface CardProps {
  title: string;
  iconSrc: ImageSourcePropType;
  iconHeading:string;
  description: string;
}
const Card: React.FC<CardProps> = ({ title,iconSrc, description ,iconHeading}) => {
  return (
    <View style={styles.page}>
      <View style={styles.welcomeContainer}>
        <Image source={require('../../../assets/images/slider/logo.png')} style={styles.logo} />
        <Text style={styles.headText}>{title}</Text>
      </View>
      <DisplayButton status={"primary"} style={styles.displayImage}>
        <Image source={iconSrc} style={styles.displayImage} />
      </DisplayButton>
      <Text style={styles.iconHead}>{iconHeading}</Text>
      <Text style={styles.belowText}>{description}</Text>
    </View>
  );
};


export const Welcome = () => {
  const [index, setIndex] = React.useState(0);
  
  const pages = [
    { title: "Welcome to Oky!", iconSrc:calenderSrc,iconHeading:"Calender", description: "Get to know YOU by tracking what's going on with your body and mood every month" }, // ... replace "..." with actual description
    { title: "Welcome to Oky!", iconSrc: newsSrc,iconHeading:"The facts", description: "Be informed about periods and learn new things about your body and your health" }, // Update these for page 2 content (if any)
    { title: "Welcome to Oky!", iconSrc: buddySrc,iconHeading:"Your Oky buddy", description: "Friendly characters guide you through the app !" }, // Update these for page 3 content (if any)
  ];
  return (
    <Swiper
      index={index}
      setIndex={setIndex}
      pages={pages.map((page) => (
        <Card key={page.title} {...page} /> // Pass props to the Card component
      ))}
      renderActionRight={renderActionRight}
    />
  );
};

const renderActionRight = (currentPage: number, total: number) => {
  const { setAuthMode } = useAuthMode();
  const onPress = () => setAuthMode("start");

  const isLastPage = currentPage === total - 1;
  const opacity = isLastPage ? 1 : 0;

  return (
    <Button
      onPress={onPress}
      style={[styles.button, { opacity }]}
      status={"secondary"}
    >
      Continue
    </Button>
  );
};

const styles = StyleSheet.create({
  page: {
    height: screenHeight * 0.55,
    width: "100%",
    alignItems: "center",
  },
  button: {
    marginLeft: "auto",
  },
  displayImage:{
    width: 80,
    height: 80,
  },
  logo: {
    width: 150,
    height: 150,
  },
  welcomeContainer:{
    width:"100%",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    marginTop:"2%",
    marginLeft:"13%"
  },
  headText:{
   fontSize:28,
   marginLeft:"-4%",
   textAlign:"left",
   width:"80%",
   fontWeight:"bold",
   fontFamily:"Roboto",
   color:"#e3629b"
  },
  iconHead:{
    fontSize:20,
    fontWeight:"bold",
    marginTop:"5%"
  },
  belowText:{
    fontSize:15,
    fontWeight:"600",
    marginTop:"5%",
    paddingHorizontal:"8%",
    alignItems:"center",
    textAlign:"center"
  }
});
