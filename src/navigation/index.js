import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import Auth from './Auth';
import App from './App';
import { AuthContext } from './AuthProvider';
import Splash from '../screens/authFlow/Splash';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['yourapp://'],
  config: {
    screens: {
      App: {
        screens: {
          // GetData: 'getdata',
          PlantInfo: 'plantinfo/:deviceId', 
        },
      },
      Auth: 'auth',
    },
  },
};


const Navigation = () => {
  const { user, setUser } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

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
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        {user ? (
          <Stack.Screen name="App" component={App} />
        ) : (
          <>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Auth" component={Auth} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
