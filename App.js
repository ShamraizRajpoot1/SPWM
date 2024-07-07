import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Navigation from './src/navigation';
import AuthProvider from './src/navigation/AuthProvider';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import GetData from './src/screens/appFlow/GetData';
import BackgroundFetch from 'react-native-background-fetch';

const App = () => {
  useEffect(() => {
    // Request permissions (iOS)
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    requestPermission();

    // Get the device token
    const getToken = async () => {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    };

    getToken();

    // Listen to whether the token changes
    const unsubscribe = messaging().onTokenRefresh(token => {
      console.log('FCM Token refreshed:', token);
    });

    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Handle foreground messages
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
        },
      });
    });

    // Configure background fetch
    const configureBackgroundFetch = async () => {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 0.05, // Fetch interval in minutes
          stopOnTerminate: false, // Continue running when the app is terminated
          startOnBoot: true, // Restart when the device is restarted
        },
        async (taskId) => {
          console.log('[BackgroundFetch] taskId: ', taskId);
          await GetData();
          BackgroundFetch.finish(taskId);
        },
        (taskId) => {
          console.log('[BackgroundFetch] failed to start: ', taskId);
          BackgroundFetch.finish(taskId);
        }
      );

      // Start the background fetch
      BackgroundFetch.start();
    };

    configureBackgroundFetch();

    return () => {
      unsubscribe();
      unsubscribeOnMessage();
    };
  }, []);

  useEffect(() => {
    // Create a notification channel for Android
    const createChannel = async () => {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    };

    createChannel();
  }, []);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <GetData />
        <Navigation />
        <Toast />
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
