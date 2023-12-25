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
  import React, { useEffect, useState } from 'react';
  import {AppStyles} from '../../../services/utilities/AppStyles';
  import {appIcons, appImages} from '../../../services/utilities/Assets';
import { Colors } from '../../../services/utilities/Colors';
import { scale } from 'react-native-size-matters';
import { LineChart } from 'react-native-chart-kit';
import { responsiveScreenHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { fontFamily, fontSize } from '../../../services/utilities/Fonts';
import Header from '../../../components/Header';
import CircleCard from '../../../components/CircleCard';
import { Chart, VerticalAxis, HorizontalAxis, Line } from 'react-native-responsive-linechart'


  const PlantInfo = ({navigation}) => {
    const [image, setImage] = useState(null);
   
    const Back =() =>{
      navigation.goBack();
    }
    const data = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], // Updated labels for hours
        datasets: [
          {
            data: [25, 30, 28, 22, 26, 24, 28, 29, 25,40], // Temperature data
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red for temperature
            strokeWidth: 2,
          },
          {
            data: [60, 50, 55, 70, 65, 75, 68, 62, 80,75], // Humidity data
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue for humidity
            strokeWidth: 2,
          },
          {
            data: [40, 35, 45, 30, 38, 42, 36, 40, 38,52], // Soil moisture data
            color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, // Green for soil moisture
            strokeWidth: 2,
          },
        ],
      };
    
      const legend = [
        { label: 'Temperature', color: 'rgba(255, 0, 0, 1)' },
        { label: 'Humidity', color: 'rgba(0, 0, 255, 1)' },
        { label: 'Soil Moisture', color: 'rgba(0, 128, 0, 1)' },
      ];
      const [temperature, setTemperature] = useState(25);
      const [humidity, setHumidity] = useState(60);
      const [soilMoisture, setSoilMoisture] = useState(75);
    
      useEffect(() => {
        setTemperature(25);
        setHumidity(60);
        setSoilMoisture(75);
      }, []);
    return (
     <>
        <Header back text={"Saffron Crocus"} onPress={Back} press={()=>navigation.navigate('Profile')} />
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              style={{flex: 1}}
              contentContainerStyle={[AppStyles.contentContainer]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
                
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
            <View style={[AppStyles.row,{marginTop: 0,}]}>
            <CircleCard
              title="Soil Moisture"
              value={`${soilMoisture}%`}
              color="#98FB98"
            />
            </View>
              
              <View style={styles.graphContainer}>
              {/* <View style={{  marginBottom: 10 }}>
        {legend.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <View style={{ width: responsiveWidth(3), height: responsiveWidth(3), backgroundColor: item.color, marginRight: 5 }} />
            <Text style={{color:Colors.lebal, fontSize: fontSize.fieldText,}}>{item.label}</Text>
          </View>
        ))}
      </View> */}

      {/* <Chart
  style={{ height: 200, width: '100%', backgroundColor: '#eee' }}
  xDomain={{ min: -2, max: 10 }}
  yDomain={{ min: -2, max: 20 }}
  padding={{ left: 20, top: 10, bottom: 10, right: 10 }}
>
  <Line data={data} smoothing="cubic-spline" theme={{ stroke: { color: 'blue', width: 1 } }} />
</Chart> */}

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
    </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        </>
    );
  };
  
  export default PlantInfo;
  
  const styles = StyleSheet.create({
    icon:{
        tintColor:Colors.lebal,
        height:scale(25)
    },
    graphContainer:{
        alignSelf:'center'
    }
  });
  