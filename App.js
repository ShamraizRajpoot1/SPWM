import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Navigation from './src/navigation';
import AuthProvider from './src/navigation/AuthProvider';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import GetData from './src/screens/appFlow/GetData';
import BackgroundFetch from 'react-native-background-fetch';
import { Linking } from 'react-native';

const App = () => {
  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    const getToken = async () => {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    };

    const unsubscribe = messaging().onTokenRefresh(token => {
      console.log('FCM Token refreshed:', token);
    });

    requestPermission();
    getToken();

    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
            url: `yourapp://plantinfo/${remoteMessage.data.deviceId}`,
          },
        },
      });
    });
 
    const configureBackgroundFetch = async () => {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15,
          stopOnTerminate: false,
          startOnBoot: true,
          enableHeadless: true,
        },
        async taskId => {
          console.log('[BackgroundFetch] taskId: ', taskId);
          await GetData();
          BackgroundFetch.finish(taskId);
        },
        taskId => {
          console.log('[BackgroundFetch] failed to start: ', taskId);
          BackgroundFetch.finish(taskId);
        }
      );

      BackgroundFetch.start();
    };

    configureBackgroundFetch();

    return () => {
      unsubscribe();
      unsubscribeOnMessage();
    };
  }, []);

  useEffect(() => {
    const createChannel = async () => {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    };

    createChannel();

    const handleOpenURL = ({ url }) => {
      console.log('Opened URL:', url);
      Linking.openURL(url);
    };

    Linking.addEventListener('url', handleOpenURL);

    return () => {
      Linking.removeEventListener('url', handleOpenURL);
    };
  }, []);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <GetData /> 
        <Navigation />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
