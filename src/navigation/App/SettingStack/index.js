import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Setting from '../../../screens/appFlow/Settings'
import AddCareTaker from '../../../screens/appFlow/AddCareTaker'


const Stack = createNativeStackNavigator()
const SettingStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Setting' component={Setting} />
        <Stack.Screen name='AddCareTaker' component={AddCareTaker} />
    </Stack.Navigator>
  )
}

export default SettingStack

const styles = StyleSheet.create({})