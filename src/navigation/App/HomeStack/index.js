import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../../../screens/appFlow/Home'
import Plants from '../../../screens/appFlow/Plants'
import PlantInfo from '../../../screens/appFlow/PlantsInfo/Index'

import CareTakers from '../../../screens/appFlow/CareTakers'
import Profile from '../../../screens/appFlow/Profile'
import EditProfile from '../../../screens/appFlow/EditProfile'
import CareTakerDetail from '../../../screens/appFlow/CareTakerDetail'


const Stack = createNativeStackNavigator()
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='Home' >
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Plants' component={Plants} />
        <Stack.Screen name='PlantInfo' component={PlantInfo} />
        <Stack.Screen name='CareTakers' component={CareTakers} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='EditProfile' component={EditProfile} />
        <Stack.Screen name='CareTakerDetail' component={CareTakerDetail} />
    </Stack.Navigator>
  )
}

export default HomeStack

const styles = StyleSheet.create({})