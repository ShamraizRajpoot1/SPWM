import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AppStyles } from '../../../services/utilities/AppStyles';
import { Colors } from '../../../services/utilities/Colors';
import { scale } from 'react-native-size-matters';
import { LineChart } from 'react-native-chart-kit';
import Header from '../../../components/Header';
import CircleCard from '../../../components/CircleCard';
import { appIcons, appImages } from '../../../services/utilities/Assets';
import { responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';
import { fontFamily, fontSize } from '../../../services/utilities/Fonts';
import database from '@react-native-firebase/database';
import { AuthContext } from '../../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const PlantInfo = ({route, navigation }) => {
  const { id } = route.params; 
  const {user} = useContext(AuthContext)
  const [image, setImage] = useState(null);
  const [careTaker, setCareTaker] = useState([])
  const userid = user.uid
  useEffect(() => {
    const careTakerDocRef = firestore().collection('careTakers').doc(userid);
    const deviceDocRef = firestore().collection('Devices').doc(userid);

    const fetchCareTakers = async () => {
      try {
        const deviceDoc = await deviceDocRef.get();
        if (deviceDoc.exists) {
          const devicesData = deviceDoc.data();
          const selectedDevice = devicesData.messages.find(device => device.deviceId === id);
          const deviceCaretakerEmail = selectedDevice ? selectedDevice.careTaker : null;
  
          const doc = await careTakerDocRef.get();
          if (doc.exists) {
            const data = doc.data();
            const careTakers = data.careTakers.map((careTaker) => ({
              id: careTaker.email,
              ...careTaker,
            }));
  
            const filteredCareTakers = careTakers.find(
              (careTaker) => careTaker.email === deviceCaretakerEmail
            );
  
            setCareTaker(filteredCareTakers);
            setImage(filteredCareTakers.image)
            console.log('Filtered caretakers:', filteredCareTakers);
  
          } else {
            console.log('No caretakers document found!');
          }
        } else {
          console.log('No device document found!');
        }
      } catch (error) {
        console.error('Error fetching caretakers from Firestore:', error);
      }
    };

    fetchCareTakers();

   
  }, []);

  const Back = () => {
    navigation.goBack();
  }
  const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], // Updated labels for hours
    datasets: [
      {
        data: [25, 30, 28, 22, 26, 24, 28, 29, 25, 40], // Temperature data
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red for temperature
        strokeWidth: 2,
      },
      {
        data: [60, 50, 55, 70, 65, 75, 68, 62, 80, 75], // Humidity data
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue for humidity
        strokeWidth: 2,
      },
      {
        data: [404, 835, 545, 730, 838, 342, 536, 240, 738, 582], // Soil moisture data
        color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, // Green for soil moisture
        strokeWidth: 2,
      },
    ],
  };
  const temperatureData = data.datasets[0].data;
  const humidityData = data.datasets[1].data;
  const soilMoistureData = data.datasets[2].data;
  const labels = data.labels;

  const legend = [
    { label: 'Temperature', color: 'rgba(255, 0, 0, 1)' },
    { label: 'Humidity', color: 'rgba(0, 0, 255, 1)' },
    { label: 'Soil Moisture', color: 'rgba(0, 128, 0, 1)' },
  ];
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [soilMoisture, setSoilMoisture] = useState('');

  useEffect(() => {
    // Fetch temperature
    const temperatureRef = database().ref(`HouseInfo/${id}/temperature`)
    temperatureRef.on('value', snapshot => {
      setTemperature(snapshot.val());
    });

    // Fetch humidity
    const humidityRef = database().ref(`HouseInfo/${id}/humidity`);
    humidityRef.on('value', snapshot => {
      setHumidity(snapshot.val());
    });

    // Fetch moisture
    const moistureRef = database().ref(`HouseInfo/${id}/moisture`);
    moistureRef.on('value', snapshot => {
      setSoilMoisture(snapshot.val());
    });


    // Clean up the listeners on unmount
    return () => {
      temperatureRef.off('value');
      humidityRef.off('value');
      moistureRef.off('value');
    };
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '1',
    },
  };
  const caretakerInfo = (id) => {
    navigation.navigate('CareTakerDetail', { id });
  };

  return (
    <>
      <Header back text={"Saffron Crocus"} onPress={Back} press={() => navigation.navigate('Profile')} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[AppStyles.contentContainer]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
              <Text style={[styles.text,{textAlign:'center'}]}>Pasrur</Text>
            <View style={AppStyles.row}>
              <Text style={styles.text}>
                Download Report
              </Text>
              <View style={AppStyles.row}>
                <TouchableOpacity>
                  <Image source={appIcons.download} style={styles.icon1} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image source={appIcons.delete} style={styles.icon1} />
                </TouchableOpacity>
              </View>

            </View>
            
            <View style={AppStyles.row}>
              <CircleCard
                title="Temperature"
                value={`${temperature}°C`}
                color="#FF6347"
              />
              <CircleCard
                title="Humidity"
                value={`${humidity}%`}
                color="#87CEEB"
              />
            </View>
            <View style={[AppStyles.row, { marginTop: 0, }]}>
              <CircleCard
                title="Soil Moisture"
                value={`${soilMoisture}`}
                color="#98FB98"
              />
            </View>

            <View style={styles.graphContainer}>

              <LineChart
        data={data}
        width={350}
        height={300}
        yAxisLabel=""
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '1',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
<Text style={[styles.text]}>Humidity</Text>
<LineChart
        data={{
          datasets: [{ data: humidityData }],
        }}
        width={350}
        height={300}
        yAxisLabel=""
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      
      <Text style={[styles.text]}>Temprature</Text>
      <LineChart
        data={{
          datasets: [{ data: temperatureData }],
        }}
        width={350}
        height={300}
        yAxisLabel=""
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      
      <Text style={[styles.text]}>SoilMoisture</Text>
      <LineChart
        data={{
          datasets: [{ data: soilMoistureData }],
        }}
        width={350}
        height={300}
        yAxisLabel=""
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
            </View>
            <TouchableOpacity onPress={()=>caretakerInfo(careTaker.email)} style={styles.listItem}>
            <View style={styles.caretaker}>
            {/* {image ? (
                <Image
                  style={[styles.image, {borderRadius: scale(10)}]}
                  source={image}
                />
              ) : ( */}
                <Image style={styles.image} source={appImages.user} />
              {/* )} */}
            </View>
            <Text style={styles.name}>Shamraiz</Text>
            {/* <Text style={styles.name}>{careTaker.name}</Text> */}
        </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default PlantInfo;

const styles = StyleSheet.create({
  icon: {
    tintColor: Colors.lebal,
    height: scale(25)
  },
  graphContainer: {
    alignSelf: 'center'
  },
  icon1: {
    tintColor: Colors.lebal,
    height: scale(35),
    tintColor: Colors.appBackground3,
    marginHorizontal: responsiveScreenWidth(1)
  },
  text: {
    fontSize: fontSize.h1,
    fontWeight: '700',
    color: Colors.textColor1,
    marginLeft: responsiveScreenWidth(5)
  },
  listItem: {
    marginHorizontal:responsiveScreenWidth(5),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveScreenWidth(2),
    backgroundColor: Colors.appBackground5,
    borderRadius: scale(12)
},
image: {
    width: responsiveScreenWidth(20),
    height: responsiveScreenWidth(20),
    marginRight: responsiveScreenWidth(2),
},
image1: {
    width: responsiveScreenWidth(20),
    height: responsiveScreenWidth(20),
    marginRight: responsiveScreenWidth(2),
},
caretaker: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    backgroundColor: Colors.appBackground2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: responsiveWidth(3),
    borderRadius: scale(12)
},
name: {
    fontSize: fontSize.h1,
    fontWeight: 'bold',
    fontFamily: fontFamily.Montserrat,
    color: Colors.textColor1
},
});
