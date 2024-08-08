import {
  Dimensions,
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
import Share from 'react-native-share';
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
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';

const PlantInfo = ({route, navigation }) => {
  const { id } = route.params; 
  const {user} = useContext(AuthContext)
  const [image, setImage] = useState(null);
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
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
          setName(selectedDevice.name)
          setLocation(selectedDevice.location)
          const deviceCaretakerEmail = selectedDevice.careTaker !== '' ? selectedDevice.careTaker : null;
    
          if (deviceCaretakerEmail) {
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
              setImage(filteredCareTakers?.image ? filteredCareTakers.image : null);
              console.log('Filtered caretakers:', filteredCareTakers);
            } else {
              console.log('No caretakers document found!');
              setCareTaker(null);
              setImage(null);
            }
          } else {
            console.log('No caretaker assigned to the device!');
            setCareTaker(null);
            setImage(null);
          }
        } else {
          console.log('No device document found!');
          setCareTaker(null);
          setImage(null);
        }
      } catch (error) {
        console.error('Error fetching caretakers from Firestore:', error);
        setCareTaker(null);
        setImage(null);
      }
    };
    

    fetchCareTakers();

   
  }, []);

  const Back = () => {
    navigation.goBack();
  }
  const [data1, setData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([1,2]);
  const [humidityData, setHumidityData] = useState([0,1]);
  const [soilMoistureData, setSoilMoistureData] = useState([0,1]);
  const [labels, setLabels] = useState([]);
  const [excelData, setExcelData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await database().ref(`HouseInfos/${id}`).once('value');
        if (snapshot.exists()) {
          const fetchedData = snapshot.val();
          const dataEntries = Object.entries(fetchedData);

          const tempData = [];
          const humidData = [];
          const soilMoistData = [];
          const dateLabels = [];
          const excelDataArray = [];

          const currentDate = new Date();
          const cutoffDate10Days = new Date();
          cutoffDate10Days.setDate(currentDate.getDate() - 10);

          const cutoffDate2Months = new Date(currentDate);
          cutoffDate2Months.setMonth(currentDate.getMonth() - 2);

          // Check if the cutoff date is in the previous year
          if (cutoffDate2Months.getMonth() > currentDate.getMonth()) {
            cutoffDate2Months.setFullYear(currentDate.getFullYear() - 1);
          }


          dataEntries.forEach(([timestamp, data]) => {
            const date = new Date(timestamp);
            const formattedDate = `${date.getDate()}`;
            const formattedDate1 = `${date.getDate()}-${date.getMonth()+1}-${date.getYear()+1900}`;

            if (date >= cutoffDate2Months && date <= new Date(currentDate)) {
              excelDataArray.push({
                date: formattedDate1,
                temperature: data.temperature,
                humidity: data.humidity,
                soilMoisture: data.moisture,
              });
            }

            if (date >= cutoffDate10Days) {
              dateLabels.push(formattedDate);
              tempData.push(data.temperature);
              humidData.push(data.humidity);
              soilMoistData.push(data.moisture);
            }
          });
          setTemperatureData(tempData);
          setHumidityData(humidData);
          setSoilMoistureData(soilMoistData);
          setLabels(dateLabels);
          setExcelData(excelDataArray);

          console.log('Temperature Data: ', tempData);
          console.log('Humidity Data: ', humidData);
          console.log('Soil Moisture Data: ', soilMoistData);
          console.log('Labels: ', dateLabels);
          console.log('Excel Data: ', excelDataArray);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const generateExcel = async () => {
    const wsData = [
      ["Date", "Temperature", "Humidity", "Soil Moisture"], // Column Headers
      ...excelData.map(item => [item.date, item.temperature, item.humidity, item.soilMoisture]) // Data Rows
    ];
  console.log(wsData);
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    console.log('excel',wsData);

    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

    const downloadsPath = RNFS.DownloadDirectoryPath + `/${name}${location}.xlsx`;
    RNFS.writeFile(downloadsPath,wbout,'ascii')
    .then(() => {
      console.log('Spreadsheet created at path:', downloadsPath);

       notifee.displayNotification({
        title:'Download Complete',
        body:'download complete'
       })
      // Toast.show('File Download Successfully', Toast.LONG);
    //   Share.open({
    //   url: `file://${downloadsPath}`,
    //   mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   failOnCancel: false,
    // })

    
  })
};

const deleteDeviceMessage = async () => {
  try {
    
    const deviceDocRef = firestore().collection('Devices').doc(userid);

    // Fetch the document
    const deviceDoc = await deviceDocRef.get();
    if (!deviceDoc.exists) {
      console.log('Device document not found');
      return;
    }

    // Get the messages array
    const devicesData = deviceDoc.data();
    const messages = devicesData.messages || [];

    // Find the index of the message with matching deviceId
    const indexToDelete = messages.findIndex(device => device.deviceId === id);
    if (indexToDelete === -1) {
      console.log('Device message not found');
      return;
    }
    navigation.navigate('Home')
    // Remove the message from the array
    messages.splice(indexToDelete, 1);

    // Update the document with the modified messages array
    await deviceDocRef.update({
      messages: messages,
    });

    console.log('Device message deleted successfully');
  } catch (error) {
    console.error('Error deleting device message:', error);
  }
};
 
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
                <TouchableOpacity onPress={generateExcel}>
                  <Image source={appIcons.download} style={styles.icon1} />
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteDeviceMessage}>
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

              {/* <LineChart
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
      /> */}
{/* <Text style={[styles.text]}>Temperature</Text> */}
{/* <LineChart
        data={{
          labels:labels , // Adjust labels as needed
          datasets: [
            {
              data: temperatureData,
            },
          ],
        }}
        width={Dimensions.get('window').width - 20}
        height={220}
        yAxisSuffix="°C"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      />
      <Text style={[styles.text]}>Humidity</Text>
<LineChart
        data={{
          labels:labels, // Adjust labels as needed
          datasets: [
            {
              data: humidityData,
            },
          ],
        }}
        width={Dimensions.get('window').width - 20}
        height={220}
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      />
      <Text style={[styles.text]}>Soil Moisture</Text>
<LineChart
        data={{
          labels:labels, // Adjust labels as needed
          datasets: [
            {
              data: soilMoistureData,
            },
          ],
        }}
        width={Dimensions.get('window').width - 20}
        height={220}
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      /> */}

            </View>
           {careTaker !== null ? <TouchableOpacity onPress={()=>caretakerInfo(careTaker.email)} style={styles.listItem}>
            <View style={styles.caretaker}>
            {image ? (
                <Image
                  style={[styles.image, {borderRadius: scale(10)}]}
                  source={{uri:image}}
                />
              ) : (
                <Image style={styles.image} source={appImages.user} />
              )}
            </View>
            <Text style={styles.name}>{careTaker.name}</Text>
            {/* <Text style={styles.name}>{careTaker.name}</Text> */}
        </TouchableOpacity> : null }
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
chart: {
  marginVertical: 8,
  borderRadius: 16,
},
});