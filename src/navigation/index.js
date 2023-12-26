import {View, Text} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import Auth from './Auth';
import App from './App';
import {AuthContext} from './AuthProvider';
import Splash from '../screens/authFlow/Splash';

const Stack = createNativeStackNavigator();
const Navigation = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(false);
  const [loading, setLoading] = useState(true)

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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='Splash'>
        <Stack.Screen name='Splash' component={Splash} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="App" component={App} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
