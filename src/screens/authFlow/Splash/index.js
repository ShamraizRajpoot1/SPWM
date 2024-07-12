import { ImageBackground, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appImages } from '../../../services/utilities/Assets';
import { AppStyles } from '../../../services/utilities/AppStyles';

const Splash = ({ navigation }) => {
  useEffect(() => {
    const delay = 2000; 
    const timeout = setTimeout(async () => {
      const data = await AsyncStorage.getItem('Token');
      if (data) {
        navigation.navigate('App');
      } else {
        console.log('data: ', data);
        navigation.navigate('Auth');
        console.log('data: ', data);

      }
    }, delay);

    return () => clearTimeout(timeout);
  }, []); 

  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Image source={appImages.logo3} style={AppStyles.logo} />
    </View>
  );
};

export default Splash;
