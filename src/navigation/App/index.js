import { View, Text } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from './Bottom';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} >
    <Stack.Screen name='Bottom' component={BottomTab} />
    </Stack.Navigator>
  )
}

export default App