import {Image, ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React, { useContext, useState } from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {fontFamily, fontSize} from '../../../services/utilities/Fonts';
import {Colors} from '../../../services/utilities/Colors';
import { AppStyles } from '../../../services/utilities/AppStyles';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../components/Header';
import SwitchToggle from "react-native-switch-toggle";
import Button from '../../../components/Button';
import { appIcons } from '../../../services/utilities/Assets';
import { AuthContext } from '../../../navigation/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Setting = ({navigation}) => {
  const {logout, user} = useContext(AuthContext);
  const [on, setOn] = useState(false);
  const Logout = async () => {
    try {
      await AsyncStorage.removeItem('Token');
      logout();
      navigation.navigate('Auth', {screen: 'Login'});
    } catch (error) {
      console.error('Error getting Token from AsyncStorage:', error);
    }
  };
  const Add = () =>{
 navigation.navigate('HomeStack')
  }
  return (
    
    <LinearGradient
    colors={Colors.appGradientColors1}
      start={{ x: -1, y:-1  }}
      end={{ x: 0, y: 1 }}
      style={[
        AppStyles.linearGradient,
      ]}
    >
      <Header text={"Settings"} press={()=>navigation.navigate('Profile')} />
     <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}>
        <TouchableWithoutFeedback>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            contentContainerStyle={[AppStyles.contentContainer]}
            keyboardShouldPersistTaps="handled">
    <View style={styles.container}>
    <View style={AppStyles.imageContainer}>
              <Image style={AppStyles.image} source={appIcons.user} />
              <Text style={styles.forgot}>Shamraiz</Text>
            </View>
      <View style={[AppStyles.row,{width:'97%', alignItems:'center'}]}>
        <Text style={styles.forgot}>Notifications</Text>
    <SwitchToggle
      switchOn={on}
      onPress={() => setOn(!on)} 
      circleColorOff= {Colors.appBackground2}
      circleColorOn={Colors.appBackground2}
      backgroundColorOn={Colors.appBackground1}
      backgroundColorOff='#C4C4C4'
    />
    </View>
    <View style={AppStyles.btnContainer}>
        <Button text={'Add CareTaker'} background={Colors.appBackground5} onPress={()=>navigation.navigate('AddCareTaker')} />
      </View>
      <View style={AppStyles.btnContainer}>
        <Button text={'Logout'} background={Colors.appBackground6} onPress={Logout} />
      </View>
    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </LinearGradient>
   
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  
  forgot:{
    color:Colors.textColor1,
    marginTop:responsiveScreenHeight(1),
    fontFamily:fontFamily.Montserrat,
    fontSize:fontSize.h2,
    fontWeight:'700'
  }
  
});
