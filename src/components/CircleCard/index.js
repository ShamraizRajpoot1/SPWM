import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'
import { fontSize } from '../../services/utilities/Fonts'
import { Colors } from '../../services/utilities/Colors'

const CircleCard = ({ title, value, color }) => {
  return (
    <View style={[styles.circle, { backgroundColor: color }]}>
    <Text style={styles.text}>{title}</Text>
    <Text style={styles.text}>{value}</Text>
  </View>
  )
}

export default CircleCard

const styles = StyleSheet.create({
    circle: {
        width: responsiveScreenWidth(35),
        height: responsiveScreenWidth(35),
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
        margin: responsiveScreenHeight(2),
      },
      text: {
        fontSize: fontSize.h1,
        fontWeight: 'bold',
        color: Colors.lebal,
      },
})