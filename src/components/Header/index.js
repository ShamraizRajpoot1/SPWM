import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { scale } from 'react-native-size-matters';
import { appIcons, appImages } from '../../services/utilities/Assets';
import { Colors } from '../../services/utilities/Colors';

const Header = (props) => {

  return (
    
      <View style={styles.container}>
       
       
        <TouchableOpacity style= {styles.back} onPress={props.onPress}>
        {props.back &&
        <Image source={appIcons.back} style={styles.logo}/>}
        </TouchableOpacity>
        <Text style={styles.text}>{props.text}</Text>
        <TouchableOpacity style={styles.user}>
         <Image source={appIcons.user} style={styles.logo}/>
        </TouchableOpacity>
      </View>
   
  );
};

export default Header;

const styles = StyleSheet.create({
  
  container: {
    height: responsiveScreenHeight(6),
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    flexDirection:'row'
  },
  text: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: '700',
    color: Colors.textColor1 ,
    width: responsiveScreenWidth(70),
     alignContent:'center',
     textAlign:'center'
  },
  logo:{
    width:scale(30),
    height:scale(30),
    tintColor:'#000000'
  },
  back:{
    width:responsiveScreenWidth(15),
    alignItems:'center'
  },
  user:{
    width:responsiveScreenWidth(15)
  }
});
