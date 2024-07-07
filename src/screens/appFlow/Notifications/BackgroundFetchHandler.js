import notifee, { EventType } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  if (type === EventType.PRESS) {
    // Handle the notification press
    console.log('User pressed the notification', notification, pressAction);
  }

  // Add other event types if needed
});
