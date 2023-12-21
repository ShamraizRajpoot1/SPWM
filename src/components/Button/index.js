import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  responsiveScreenHeight, responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { Colors } from '../../services/utilities/Colors';
import { fontFamily, fontSize } from '../../services/utilities/Fonts';
import { scale } from 'react-native-size-matters';

const Button = props => {
  const buttonStyles = {
    width: responsiveScreenWidth(70),
    height: responsiveScreenHeight(6.5),
    backgroundColor: props.background ? props.background : Colors.appBackground5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(12),
  };
  const textStyles = {
    color:  Colors.textColor1,
    fontSize: fontSize.h1,
    fontWeight: props.fontWeight || 'bold' ,
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyles]}
      onPress={props.onPress}
      disabled={props.disabled} 
    >
      {props.isLoading ? ( 
        <ActivityIndicator color={Colors.lebal} /> 
      ) : (
        <Text style={[textStyles]}>{props.text}</Text> 
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
