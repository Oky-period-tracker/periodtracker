import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { DisplayButton } from '../../../components/Button';


interface CardProps {
  title: string;
  iconType:'fontawesome' | 'custom';
  fontAwesomeName?: keyof typeof FontAwesome.glyphMap; 
  iconComponent?: React.ReactNode; 
  iconHeading: string;
  description: string;
}



const Card: React.FC<CardProps> = ({ title, iconType, fontAwesomeName, iconComponent, iconHeading, description }) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'fontawesome':
        return <FontAwesome name={fontAwesomeName} size={40} color="white" />;
      case 'custom':
        return iconComponent;
      default:
        return null;
    }
  };

  return (
    <View style={styles.page}>
    <View style={styles.welcomeContainer}>
      <Image source={require('../../../assets/images/slider/logo.png')} style={styles.logo} />
      <Text style={styles.headText}>{title}</Text>
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
        marginBottom: "20%",
        justifyContent: "center",
        alignItems: "center",
      },
    button: {
        marginLeft: "auto",
      },
    displayImage:{
        height:80,
        width:80,

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
        marginTop:"4%",
        marginLeft:"12%"
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
        marginTop:"8%"
      },
    belowText:{
        fontSize:15,
        fontWeight:"600",
        marginTop:"8%",
        paddingHorizontal:"8%",
        alignItems:"center",
        textAlign:"center"
      },
});

export default Card;
