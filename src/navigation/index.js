import { View, Text } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import Auth from './Auth';
import { Colors } from '../services/utilities/Colors';
import { AuthContext } from './AuthProvider';
import auth from '@react-native-firebase/auth';
import Splash from '../screens/authFlow/Splash';
import App from '../../App';

const Stack = createNativeStackNavigator();
const Navigation = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(false);
  //const [loading, setLoading] = useState(true)

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer >
      <Stack.Navigator  screenOptions={{headerShown: false, statusBarColor: Colors.backgroud1}}>
      <Stack.Screen name='Splash' component={Splash} />
        <Stack.Screen name='Auth' component={Auth} />
        <Stack.Screen name='App' component={App} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation