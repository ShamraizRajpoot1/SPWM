import {Image, ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
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
import InputField from '../../../components/InputField';
import { appIcons } from '../../../services/utilities/Assets';
import Button from '../../../components/Button';
import { AuthContext } from '../../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { scale } from 'react-native-size-matters';

const Profile = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [userData, setUserData] = useState([])
  const [image, setImage] = useState(null)
  useEffect(() => {
    if (!user) {
      return;
    }
  
    const userId = user.uid;
    const userRef = firestore().collection('Users').doc(userId);
  
    const unsubscribe = userRef.onSnapshot((snapshot) => {
      if (snapshot.exists) {
        setUserData(snapshot.data());
        setImage(snapshot.data().profileImage)
        console.log('User data updated:', snapshot.data());
      } else {
        console.log('User document does not exist');
      }
    });
  
    return () => unsubscribe(); // Cleanup function to unsubscribe from snapshot listener
  
  }, []);
  
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
      <Header back onPress={()=>navigation.goBack()} text={"Profile"} profile/>
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
    {image ? (
                <Image
                  style={[AppStyles.image, {borderRadius: scale(200)}]}
                  source={{uri:image}}
                />
              ) : (
                <Image style={AppStyles.image} source={appIcons.user} />
              )}
            </View>
    <InputField lebal={'Email'} value={userData.email} placeholder={"s@gmail.com"} edit={false}/>
    <InputField lebal={'Phone'} value={userData.phone}  edit={false}/>
    <InputField lebal={'Name'}  value={userData.name} edit={false}/>
    <InputField lebal={'Country'} value={userData.location} edit={false}/>
    <View style={AppStyles.btnContainer}>
        <Button text={'Edit Profile'} onPress={()=>navigation.navigate('EditProfile')} />
      </View>
    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </LinearGradient>
   
  );
};

export default Profile;

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
