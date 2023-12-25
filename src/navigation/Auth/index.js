import { View, Text } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../../screens/authFlow/Login';
import SignUp from '../../screens/authFlow/SignUp';
import Forgot from '../../screens/authFlow/Forgot';

const Stack = createNativeStackNavigator();

const Auth = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, }} >
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='SignUp' component={SignUp} />
      <Stack.Screen name='Forgot' component={Forgot} />
    </Stack.Navigator>
  )
}

export default Auth