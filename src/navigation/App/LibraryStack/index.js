import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Library from '../../../screens/appFlow/Library'
import CareGuide from '../../../screens/appFlow/CareGuide'
import Profile from '../../../screens/appFlow/Profile'
import EditProfile from '../../../screens/appFlow/EditProfile'


const Stack = createNativeStackNavigator()
const LibraryStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Library' component={Library} />
        <Stack.Screen name='CareGuide' component={CareGuide} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='EditProfile' component={EditProfile} />
    </Stack.Navigator>
  )
}

export default LibraryStack

const styles = StyleSheet.create({})