import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
import { AuthContext } from '../../../navigation/AuthProvider';

const GetData = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const userDocRef = firestore().collection('Devices').doc(user.uid);

    const fetchMessages = async docSnapshot => {
      try {
        if (docSnapshot.exists) {
          const userData = docSnapshot.data();
          const messages = userData.messages || [];

          setInitialData(messages);
        } else {
          setInitialData([]);
        }
      } catch (error) {
        console.error('Error fetching messages from Firestore:', error);
        setInitialData([]);
      }
    };

    const unsubscribe = userDocRef.onSnapshot(fetchMessages);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  useEffect(() => {
    if (initialData.length > 0) {
      const listeners = [];

      const updateData = async item => {
        const temperatureRef = database().ref(`HouseInfo/${item.deviceId}/temperature`);
        const humidityRef = database().ref(`HouseInfo/${item.deviceId}/humidity`);
        const moistureRef = database().ref(`HouseInfo/${item.deviceId}/moisture`);

        const onValueChange = async () => {
          const [temperatureSnapshot, humiditySnapshot, moistureSnapshot] = await Promise.all([
            temperatureRef.once('value'),
            humidityRef.once('value'),
            moistureRef.once('value'),
          ]);

          const temperature = temperatureSnapshot.val();
          const humidity = humiditySnapshot.val();
          const moisture = moistureSnapshot.val();

          let plantData = {};
          try {
            const plantDoc = await firestore().collection('Plants').doc(item.plant).get();
            if (plantDoc.exists) {
              plantData = plantDoc.data();
            }
          } catch (error) {
            console.error(`Error fetching plant data for plant ID ${item.plant}:`, error);
          }

          let wasOptimal = true;
          const isOptimal = temperature >= 20 && temperature <= 40 && humidity >= 20 && humidity <= plantData.maxHumi;

          if (!isOptimal && wasOptimal) {
            await notifee.displayNotification({
              title: `${item.name} ${item.location} `,
              body: `The conditions for your plant are not optimal!\nTemperature: ${temperature}°C\nHumidity: ${humidity}%\nMoisture: ${moisture}%`,
              android: {
                channelId: 'default',
                importance: AndroidImportance.HIGH,
                color: '#FF0000',
                smallIcon: 'ic_launcher', 
                largeIcon: 'ic_launcher',
                style: {
                  type: AndroidStyle.BIGTEXT,
                  text: `The conditions for your plant are not optimal`,
                },
                pressAction: {
                  id: 'default',
                  launchActivity: 'default',
                  url: `plantInfo/${item.deviceId}`,
                },
                actions: [ 
                  {
                    title: 'View Details',  
                    pressAction: {
                      id: 'view-details',
                      launchActivity: 'default',
                      url: `yourapp://plantinfo/${item.deviceId}`, // Adjust this to match your deep linking structure
                    },
                  },
                  {
                    title: 'Ignore',
                    pressAction: {
                      id: 'ignore',
                    },
                  },
                ],                
              },
            });
          }

          wasOptimal = isOptimal;

          setFilteredData(prevData => {
            return prevData.map(dataItem =>
              dataItem.deviceId === item.deviceId
                ? {
                    ...item,
                    temperature,
                    humidity,
                    moisture,
                    isOptimal,
                    plantData,
                  }
                : dataItem,
            );
          });
        };

        temperatureRef.on('value', onValueChange);
        humidityRef.on('value', onValueChange);
        moistureRef.on('value', onValueChange);

        listeners.push({ ref: temperatureRef, callback: onValueChange });
        listeners.push({ ref: humidityRef, callback: onValueChange });
        listeners.push({ ref: moistureRef, callback: onValueChange });
      };

      initialData.forEach(item => updateData(item));

      return () => {
        listeners.forEach(({ ref, callback }) => ref.off('value', callback));
      };
    }
  }, [initialData]);

  useEffect(() => {
    const subscription = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        const { notification } = detail;
        console.log('Notification Payload:', notification);
        const url = notification?.android?.pressAction?.url;
        console.log('Extracted URL:', url);
        
        if (url) {
          // Extract deviceId from the deep link URL
          const deviceId = url.split('/').pop(); 
  
          // Navigate to PlantInfo screen 
          navigation.navigate('HomeStack', { screen: 'PlantInfo', Id: deviceId }); 
        }
      }
    });
  
    return () => {
      subscription.remove();
    };
  }, []);

  return <View>{/* Render your filtered data here */}</View>;
};

export default GetData;
